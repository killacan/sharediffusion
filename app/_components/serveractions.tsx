'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation';
import { headers, cookies } from 'next/headers'
import { createPostSchema, updatePostSchema } from './schemas';
import { signinFormSchema, signupFormSchema, updateVersionFormSchema } from './schemas' 
import { z } from 'zod';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import B2 from 'backblaze-b2';

// const b2 = new S3Client({
//   endpoint: 'https://s3.us-west-004.backblazeb2.com',
//   region: 'us-west-004',
//   credentials: {
//     accessKeyId: process.env.BACKBLAZE_KEY_ID!,
//     secretAccessKey: process.env.BACKBLAZE_APP_KEY!,
//   },
// })

const b2 = new B2({
  applicationKeyId: process.env.BACKBLAZE_TEST_APP_KEY_ID!, // or accountId: 'accountId'
  applicationKey: process.env.BACKBLAZE_TEST_APP_KEY! // or masterApplicationKey
});

const bucket = 'sharediffusion-img-test'
const bucketId = process.env.BACKBLAZE_TEST_BUCKET_ID!

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

export async function createPost(values: z.infer<typeof createPostSchema>) {
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
  return redirect('/createpost')

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
    console.log(user.user?.id, user_id, "this is the user id")
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

export async function deletePost(title: string) {
  'use server'

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return redirect('/login?message=must be logged in to delete a post')
  }

  console.log(title, user.user.id, "this is the title and user id")

  const { error: postVersionError } = await supabase.from('posts').delete().eq('user_id', user.user.id).eq('title', title)

  if (postVersionError) {
    console.log(postVersionError)
    return redirect('/models?message=Could not delete post')
  }

  return redirect(`/models?message=Model Post deleted successfully`)
}

type SignedURLResponse = {
  failure?: undefined;
  success: {
      url: string;
      authorizationToken: string;
  };
} | {
  failure: string;
  success?: undefined;
};

export async function getSignedURL(): Promise<SignedURLResponse>{
  'use server' 

  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: user, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { failure: 'must be logged in to create a post' }
  }

  let uploadURL

  try {
    await b2.authorize({
      // ...common arguments (optional)
    }); 
    uploadURL = await b2.getUploadUrl({
      bucketId: bucketId,
    })
    console.log(bucketId, "this is the bucket id")
  } catch (error) {
    console.log(error, "this is the error")
    return { failure: 'Could not authenticate user' }
  }

  console.log(uploadURL.data.uploadUrl, "this is the upload url")


  // const putObjectCommand = new PutObjectCommand({
  //   Bucket: bucket,
  //   Key: `test-file`,
  // })
  // // need to update this so that I fetch tbe Backblaze url instead of the amazon one.
  // const signedURL = await getSignedUrl(b2, putObjectCommand, { expiresIn: 60 })
  
  return { success: { url: uploadURL.data.uploadUrl, authorizationToken: uploadURL.data.authorizationToken } }


}