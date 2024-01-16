'use client'

import { createPost } from "../_components/loginactions"
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from "../_components/ui/button"
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

export const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters long'
    }),
    magnet: z.string(),
    description: z.string(),

})

export default function PostAModel() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: '',
            magnet: '',
        }
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        createPost(values)
        console.log(values)
      }


    return (
        <div className="flex-1 flex flex-col w-full sm:max-w-lg px-8 gap-2 place-content-center">
            <h1 className="text-3xl font-bold">Post A Model</h1>
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