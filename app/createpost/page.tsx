'use client'

import { createPost } from "../_components/serveractions"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../_components/ui/form"
import { Input } from "../_components/ui/input"
import FormButton from "../_components/ui/formButton"
import { Textarea } from "../_components/ui/textarea"
import { createPostSchema } from '../_components/schemas'



export default function PostAModel({
    searchParams,
  }: {
    searchParams: { message: string }
  }) {

    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: '',
            magnet: '',
            description: '',
            version: '',
            version_desc: '',
        }
    })

    function onSubmit(values: z.infer<typeof createPostSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        createPost(values)
        // console.log(values)
        form.reset()
      }


    return (
        <div className="flex-1 flex flex-col w-full sm:max-w-lg px-8 py-8 gap-2 place-content-center">
            <h1 className="text-3xl font-bold">Post A Model</h1>
            {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {searchParams.message}
                </p>
            )}
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                        <Input placeholder="awesome title here" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Initial Version</FormLabel>
                    <FormControl>
                        <Input placeholder="what version of your model is this?" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="version_desc"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Version Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="Describe this version, or what is unique about this version" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="magnet"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Magnet Link</FormLabel>
                    <FormControl>
                        <Input placeholder="put your magnet link here" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                        <Textarea placeholder="describe your model here" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormButton >Submit</FormButton>
            </form>
            </Form>
        </div>
      )
}