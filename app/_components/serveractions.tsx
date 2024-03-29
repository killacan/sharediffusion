'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers'
import { createPostSchema, updatePostSchema } from './schemas';
import { signinFormSchema, signupFormSchema, updateVersionFormSchema } from './schemas' 
import { z } from 'zod';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const r2 = new S3Client({
  endpoint: process.env.CLOUDFLARE_SPECIFIC_ENDPOINT!,
  region: "auto",
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY!,
  },
})

// const b2 = new B2({
//   applicationKeyId: process.env.BACKBLAZE_TEST_APP_KEY_ID!, // or accountId: 'accountId'
//   applicationKey: process.env.BACKBLAZE_TEST_APP_KEY! // or masterApplicationKey
// });

const bucket = 'sharediffusion-img'

export async function signIn(values: z.infer<typeof signinFormSchema>) {
    'use server';

    const email = values.email as string
    const password = values.password as string
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/')

}

export async function signUp(values: z.infer<typeof signupFormSchema>) {
  'use server';

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const origin = headers().get('origin')
  const email = values.email as string
  const password = values.password as string
  const username = values.username as string
  // console.log(email, password, username, origin)
  const { data: user } = await supabase.from('users').select('*').eq('username', username).single()

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
      emailRedirectTo: `${origin}/auth/callback`,
    },
  })

  if (user) {
    return redirect('/login?message=Username already taken')
  }

  if (error) {
    console.log(error, "this is the error message")
    if (error.status === 422) {
      return redirect('/login?message=check password complexity')
    }
    return redirect('/login?message=Could not authenticate user')
  }

  return redirect('/login?message=Check email to continue sign in process')
}

export async function updateProfile(values: z.infer<typeof signupFormSchema>) {
  "use server"

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user.user) {
    return redirect('/login?message=must be logged in to update profile')
  }
}

export async function createPost(values: z.infer<typeof createPostSchema>, hasFile: boolean) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const title = values.title
  const magnet = values.magnet
  const description = values.description
  const version = values.version
  const version_desc = values.version_desc

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login?message=must be logged in to create a post')
  }

  const {data: postData, error: postError } = await supabase.from('posts').insert([
    {
      title,
      description,
      user_id: user.user.id,
    },
  ]).select()

  if (postError || !postData) {
    console.log(postError)
    return redirect('/createpost?message=Could not create post')
  }

  // console.log(postData, "this is some post data")

  const { error: postVersionError } = await supabase.from('versions').insert([
    {
      version_magnet: magnet,
      name: version,
      post_id: postData[0].post_id,
      user_id: user.user.id,
      version_desc,
    },
  ])

  if (postVersionError) {
    console.log(postVersionError)
    return redirect('/createpost?message=Could not create post (version error)')
  }

  // console.log(title, magnet, description)
  if (hasFile) {
    return postData[0].post_id
  } else {
    return redirect('/models?message=Model Post created successfully')
  }

}

export async function updatePost(values: z.infer<typeof updatePostSchema>) {
  'use server' 

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const title = values.title
  const description = values.description

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login?message=must be logged in to update a post')
  }

  const { error: postVersionError } = await supabase.from('posts').update({title, description}).eq('user_id', user.user.id).eq('title', title)

  if (postVersionError) {
    console.log(postVersionError)
    return redirect('/models?message=Could not update post')
  }

  return redirect(`/models/${title}?message=Model Post updated successfully`)
}

export async function deletePost(title: string, post_id: number) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login?message=must be logged in to delete a post')
  }

  console.log(title, user.user.id, "this is the title and user id")

  // const { data: photoData, error: photoError } = await supabase
  //   .from('pictures')
  //   .select('file_name')
  //   .eq('post_id', post_id)

  const { error: postVersionError } = await supabase.from('posts').delete().eq('user_id', user.user.id).eq('title', title)

  // if (photoData) {

  // }

  if (postVersionError) {
    console.log(postVersionError)
    return redirect('/models?message=Could not delete post')
  }

  return redirect(`/models?message=Model Post deleted successfully`)
}

export async function getPosts(page: number) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user } = await supabase.auth.getUser()
  console.log(user, "this is the user")
  
  if (!user.user) {
    const { data: postData, error } = await supabase
    .from('posts')
    .select('*, pictures(*)')
    .order('updated_at', { ascending: false })
    .range(page * 25, (page * 25) + 25)

    postData?.forEach((post: any) => {
      post.pictures = post.pictures.filter((img: any) => img.nsfw === false)
    })

    console.log(postData, error, "this is the post data")
  if (error) {
    console.error(error)
    return { posts: [] }
  }

  return { posts: postData }
  }
  
  
  const currentUser = await supabase.from('users').select('*').eq('user_id', user.user.id).single()
  console.log(currentUser, "this is the current user")

  if (currentUser.data.allow_nsfw === false) {
    const { data: postData, error } = await supabase
    .from('posts')
    .select('*, pictures(*)')
    .order('updated_at', { ascending: false })
    .range(page * 25, (page * 25) + 25)

    postData?.forEach((post: any) => {
      post.pictures = post.pictures.filter((img: any) => img.nsfw === false)
    })

    console.log(postData, error, "this is the post data")
  if (error) {
    console.error(error)
    return { posts: [] }
  }

  return { posts: postData }
  } else {
    const { data: postData, error } = await supabase
    .from('posts')
    .select('*, pictures(*)')
    .order('updated_at', { ascending: false })
    .range(page * 25, (page * 25) + 25)

    console.log(postData, error, "this is the post data")
  if (error) {
    console.error(error)
    return { posts: [] }
  }

  return { posts: postData }
  }

  
}

export async function updateVersion(values: z.infer<typeof updateVersionFormSchema>, post: number, user_id: string, title: string) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const version_magnet = values.version_magnet
  const name = values.name
  const version_desc = values.version_desc
  const post_id = post

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login?message=must be logged in to create a post')
  }

  if (user.user?.id !== user_id) {
    // TODO: add error message
    // console.log(user.user?.id, user_id, "this is the user id")
    return redirect('/models?message=You do not have permission to edit this post')
  }

  const { error: postVersionError } = await supabase.from('versions').update({name, version_magnet, version_desc}).eq('post_id', post_id).eq('user_id', user.user.id)

  if (postVersionError) {
    console.log(postVersionError)
    return redirect('/models?message=Could not update post (version error)')
  }

  return redirect(`/models/${title}?message=Version updated successfully`)

}

export async function addVersion(values: z.infer<typeof updateVersionFormSchema>, post: number, user_id: string, title: string) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const version_magnet = values.version_magnet
  const name = values.name
  const version_desc = values.version_desc
  const post_id = post

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login?message=must be logged in to create a post')
  }

  if (user.user?.id !== user_id) {
    return redirect('/models?message=You do not have permission to add a version to this model')
  }

  const { error: postVersionError } = await supabase.from('versions').insert([
    {
      version_magnet,
      name,
      post_id,
      user_id: user.user.id,
      version_desc,
    },
  ])

  if (postVersionError) {
    console.log(postVersionError)
    return redirect('/models?message=Could not add version to post')
  }

  return redirect(`/models/${title}?message=Version added successfully`)
}

type SignedURLResponse = {
  failure?: undefined;
  success: {
      url: string;
      // authorizationToken: string;
  };
} | {
  failure: string;
  success?: undefined;
};

const acceptedTypes = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/svg+xml',
  'image/tiff',
  'image/bmp',
  'image/ico',
  'image/x-icon',
  'image/x-png',
  'image/x-tiff',
  'image/x-xbitmap',
]

const maxFileSize = 1024 * 1024 * 10 // 10MB

export async function getSignedURL( fileType: string, size: number, name:string ): Promise<SignedURLResponse>{
  'use server' 

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { failure: 'must be logged in to create a post' }
  }

  if (!acceptedTypes.includes(fileType)) {
    return { failure: 'File type not accepted' }
  }

  if (size > maxFileSize) {
    return { failure: 'File size too large' }
  }

  let uploadURL

  // try {
  //   await b2.authorize({
  //     // ...common arguments (optional)
  //   }); 
  //   uploadURL = await b2.getUploadUrl({
  //     bucketId: bucketId,
  //   })
  //   console.log(bucketId, "this is the bucket id")
  // } catch (error) {
  //   console.log(error, "this is the error")
  //   return { failure: 'Could not authenticate user' }
  // }

  // this is for the s3 client
  try {
    uploadURL = await getSignedUrl(r2, new PutObjectCommand({
      Bucket: bucket,
      Key: name,
      ContentType: fileType,
      ContentLength: size,
    }), { expiresIn: 3600 } )
  } catch (error) {
    console.log(error, "this is the error")
    return { failure: 'Could not authenticate user' }
  }

  console.log(uploadURL, "this is the upload url")
  
  return { success: { url: uploadURL } }


}

export async function createImg(post_id: number | undefined, name: string, nsfw: boolean) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    return redirect('/createpost?message=must be logged in to create a post')
  }
  
  // // we need to allow people to upload images without creating a post. 
  // if (!post_id) {
  //   const { data: imgData, error } = await supabase.from('pictures').insert({
  //     url: `${authorizeResponse.data.downloadUrl}/file/${bucket}/${name}`,
  //     file_name: name,
  //     user_id: user.user.id,
  //     nsfw,
  //   })
  // } else {
  //   const { data: imgData, error} = await supabase.from('pictures').insert({
  //     url: `${authorizeResponse.data.downloadUrl}/file/${bucket}/${name}`,
  //     post_id,
  //     file_name: name,
  //     user_id: user.user.id,
  //     nsfw,
  //   })
  
  //   if (error || !imgData) {
  //     console.log(error)
  //     return redirect('/createpost?message=Could not create img')
  //   }
  // }
  

}

export async function getImgs(page: number) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user } = await supabase.auth.getUser()

  if (!user.user) {
    const { data: imgData, error } = await supabase
      .from('pictures')
      .select('*')
      .eq('nsfw', false)
      .order('updated_at', { ascending: false })
      .range(page * 25, (page * 25) + 25)

    if (error) {
      console.error(error)
      return { imgs: [] }
    }

    return { imgs: imgData }
  }

  const currentUser = await supabase.from('users').select('*').eq('user_id', user.user.id).single()

  if (currentUser.data.allow_nsfw === false) {
    const { data: imgData, error } = await supabase
      .from('pictures')
      .select('*')
      .eq('nsfw', false)
      .order('updated_at', { ascending: false })
      .range(page * 25, (page * 25) + 25)

    if (error) {
      console.error(error)
      return { imgs: [] }
    }

    return { imgs: imgData }
  } else {
    const { data: imgData, error } = await supabase
      .from('pictures')
      .select('*')
      .order('updated_at', { ascending: false })
      .range(page * 25, (page * 25) + 25)

    if (error) {
      console.error(error)
      return { imgs: [] }
    }

    return { imgs: imgData }
  }
}

export async function checkPostName(name: string) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: postData, error } = await supabase.from('posts').select('title').eq('title', name).single()

  console.log(postData, error, "this is the post data")
  if (error && error.details !== 'The result contains 0 rows' || postData) {
    return { success: false }
  }

  return { success: true }
}