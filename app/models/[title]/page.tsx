// this page is going to be for grabbing an individual post and displaying it.
import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import VersionSelect from '@/app/_components/versionSelect'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import UpdateModelForm from '@/app/_components/updateModelForm'
import DeleteButton from '@/app/_components/deleteButton'


export const revalidate = 120

export interface Version {
    version_id: number,
    post_id: number,
    version_magnet: string,
    upload_date: string,
    name: string,
    user_id: string,
}

export default async function Post({ params: { title } }: { params: { title: string } }) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    const cleanTitle = title.replaceAll('%20', ' ')
    const { data, error } = await supabase.from('posts').select('*').eq('title', cleanTitle).single()

    let userData

    if (data) {
        userData = await supabase.from('users').select('username, description, profile_pic').eq('user_id', data.user_id).single()
        // console.log(userData)
    }

    let versions
    if (userData) {
        versions = await supabase.from('versions').select('*').eq('post_id', data.post_id)
    }

    if (!data || !userData?.data || error || !versions) {
        return (
            <div className="flex-1 w-full flex flex-col gap-20 items-center">
                <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                    <h1 className="text-3xl font-bold">Error getting model and versions</h1>
                </div>
            </div>
        )

    }

    let isOwner = false
    if (data.user_id === user?.id) {
        isOwner = true
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <div className='flex gap-3 pt-12'>
                    <div className='border border-white w-96 h-96 text-center rounded-md'>
                        <p> Img / Imgs will go here.</p>
                    </div>
                    {!isOwner && <div className='grid grid-rows-[70px_1fr_50px] w-72 border border-gray-500 rounded-md p-4'>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <VersionSelect versions={versions} />
                        <h2 className='text-xl font-bold mt-auto text-center'>
                            uploader: {userData.data.username}
                        </h2>
                    </div>}
                    {isOwner && <div className='grid grid-rows-[70px_1fr_50px] w-72 border border-gray-500 rounded-md p-4'>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <VersionSelect versions={versions} />
                        <h2 className='text-xl font-bold mt-auto text-center'>
                            uploader: {userData.data.username}
                        </h2>
                        <div className='flex justify-center w-full gap-2'>
                        <Dialog>
                            <DialogTrigger className='bg-green-700 flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground my-2 w-1/2 hover:bg-green-600'>Update</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Update Your Model</DialogTitle>
                                {/* <DialogDescription> */}
                                {/* </DialogDescription> */}
                                    <UpdateModelForm title={cleanTitle} desc={data.description} />
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger className='bg-red-500 flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground my-2 w-1/2 hover:bg-red-400'>Delete</DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Delete Your Model</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to delete this model? This action cannot be undone.
                                </DialogDescription>
                                <DialogFooter>
                                    <DialogClose className='bg-green-700 flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground my-2 w-1/2 hover:bg-green-600'>Cancel</DialogClose>
                                    <DeleteButton title={cleanTitle} />
                                </DialogFooter>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        </div>
                    </div>}

                </div>
                <div>
                    <h2>Description: </h2>
                    <p>{data.description}</p>
                </div>
            </div>
        </div>
    )
}