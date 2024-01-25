'use client'

import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs"
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
} from "@/app/_components/ui/form"
import FormButton from "../_components/ui/formButton"
import { Textarea } from "../_components/ui/textarea"
import { updateVersionFormSchema } from "./schemas"
import { updateVersion } from "./serveractions"
import { selectedVersionStore } from "./selectedversion"
import { useSearchParams } from "next/navigation"

export default function UpdateModelForm({title}: {title: string}) {

    const searchParams = useSearchParams()
    const message = searchParams.get('message')
    const version = selectedVersionStore(state => state.selectedVersion)
    console.log(version, "version in update model form")

    const updateVersionForm = useForm<z.infer<typeof updateVersionFormSchema>>({
        resolver: zodResolver(updateVersionFormSchema),
        defaultValues: {
            version_magnet: version.version_magnet,
            version_desc: version.version_desc,
            name: version.name,
        }
      })
    
      const addNewVersionForm = useForm<z.infer<typeof updateVersionFormSchema>>({
        resolver: zodResolver(updateVersionFormSchema),
        defaultValues: {
            version_magnet: '',
            version_desc: '',
            name: '',
        }
      })
    
      function onUpdateVersion(values: z.infer<typeof updateVersionFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const post = version.post_id
        const user = version.user_id
        if (post && user) {
            updateVersion(values, post, user, title)
        } else {
            console.log("something went wrong")
        }
      }
    
      function onAddVersion(values: z.infer<typeof updateVersionFormSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        const post = version.post_id
        const user = version.user_id
        // signUp(values)
      }

    return (
        <Tabs defaultValue="Signin" className="">
        <TabsList>
          <TabsTrigger value="Signin">Update Version</TabsTrigger>
          <TabsTrigger value="Signup">New Version</TabsTrigger>
          <TabsTrigger value="UpdateModel">Update Model</TabsTrigger>
        </TabsList>
        <TabsContent value="Signin" className='animate-in'>
        <Form {...updateVersionForm}>
            <form onSubmit={updateVersionForm.handleSubmit(onUpdateVersion)} className="space-y-8">
            <FormField
                control={updateVersionForm.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Version Name</FormLabel>
                    <FormControl>
                        <Input placeholder="awesome Name Here here" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={updateVersionForm.control}
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
                control={updateVersionForm.control}
                name="version_magnet"
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
                <FormButton >Update</FormButton>
                {message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                    {message}
                    </p>
                )}
              </form>
            </Form>
        </TabsContent>
        <TabsContent value="Signup" className='animate-in'>
      <Form {...addNewVersionForm}>
            <form onSubmit={addNewVersionForm.handleSubmit(onAddVersion)} className="space-y-8">
            <FormField
                control={addNewVersionForm.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Version Name</FormLabel>
                    <FormControl>
                        <Input placeholder="awesome Name Here here" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={addNewVersionForm.control}
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
                control={addNewVersionForm.control}
                name="version_magnet"
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
                <FormButton >Add New</FormButton>
                {message && (
                    <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                    {message}
                    </p>
                )}
              </form>
            </Form>
        </TabsContent>
        </Tabs>
    )
}