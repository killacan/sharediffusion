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
import { cache } from 'react'
import { UUID } from 'crypto'
import React from 'react';
import { Carousel } from 'antd';
import Image from 'next/image'


export const revalidate = 120

export interface Version {
    version_id: number,
    post_id: number,
    version_magnet: string,
    upload_date: string,
    name: string,
    user_id: string,
}

export interface userData {
    user_id: UUID,
    username: string,
    description?: string,
    profile_pic?: string,
    is_moderator: boolean,
}

export default async function Post({ params: { title } }: { params: { title: string } }) {

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const {
        data: { user },
    } = await supabase.auth.getUser()

    let currentUserData 
    
    if (user) {
        currentUserData = await supabase.from('users').select('username, profile_pic, user_id, is_moderator').eq('user_id', user.id).single() as { data: userData }
    }

    console.log(user, "this is user")

    const cleanTitle = title.replaceAll('%20', ' ')
    const { data, error } = await supabase.from('posts').select('*, versions(*)').eq('title', cleanTitle).single()

    console.log(data, "this is data")
    let userData

    if (data) {
        userData = await supabase.from('users').select('username, profile_pic, user_id, is_moderator').eq('user_id', data.user_id).single() as { data: userData }
        console.log(userData)
    }

    let images 
    if (userData) {
        images = await supabase
            .from('pictures')
            .select('*')
            .eq('post_id', data.post_id)
            .eq('user_id', userData.data.user_id)
            .filter('nsfw', 'eq', false)
        console.log(images, "this is images")
    }

    if (!data || !userData?.data || error || !data.versions) {
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
                        <Carousel autoplay>
                            {images && images.data && images?.data.map((image, index) => {
                                return (
                                    <div className='overflow-hidden rounded-md' key={index}>
                                        <Image src={image.url} alt={'uploaded ai image'} width={288} height={288} className='w-96 h-96 object-cover' />
                                    </div>
                                )
                            })}
                            {!images && <div className='rounded-lg bg-foreground/10 w-full h-72 text-white'>No Photo</div>}
                            {images?.data && images.data.length === 0 && <div className='rounded-lg bg-foreground/10 w-full h-72 text-white'>No Photo</div>}
                        </Carousel>
                    </div>
                    {!isOwner && <div className='grid grid-rows-[70px_1fr_50px] w-72 border border-gray-500 rounded-md p-4'>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <VersionSelect versions={data.versions} />
                        <h2 className='text-xl font-bold mt-auto text-center'>
                            By: {userData.data.username}
                        </h2>
                    </div>}
                    {isOwner && <div className='grid grid-rows-[70px_1fr_50px] w-72 border border-gray-500 rounded-md p-4'>
                        <h1 className="text-3xl font-bold">{data.title}</h1>
                        <VersionSelect versions={data.versions} />
                        <h2 className='text-xl font-bold mt-auto text-center'>
                            By: {userData.data.username}
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
                                        <DeleteButton title={cleanTitle} post_id={data.post_id} />
                                    </DialogFooter>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>}

                </div>
                {currentUserData?.data.is_moderator && 
                    <div className='flex flex-col justify-center w-full gap-2'>
                        <p>Moderator Tools:</p>
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
                                        <DeleteButton title={cleanTitle} post_id={data.post_id} />
                                    </DialogFooter>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                }
                <div>
                    <p>{data.description}</p>
                </div>
            </div>
        </div>
    )
}