'use client'
import OAuthWithDiscord from '../_components/oauthbutton'
import OAuthWithGithub from '../_components/oauthgithub'
import { signIn, signUp } from '../_components/serveractions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../_components/ui/tabs"
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
import { signinFormSchema, signupFormSchema } from '../_components/schemas'



export default function Login({
  searchParams,
}: {
  searchParams: { message: string }
}) {

  const signinForm = useForm<z.infer<typeof signinFormSchema>>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: {
        email: '',
        password: '',
    }
  })

  const signupForm = useForm<z.infer<typeof signupFormSchema>>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: {
        username: '',
        email: '',
        password: '',
    }
  })

  function onSignin(values: z.infer<typeof signinFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    signIn(values)
  }

  function onSignup(values: z.infer<typeof signupFormSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    signUp(values)
  }

  return (
    <div className="flex-1 flex flex-col w-full sm:max-w-lg gap-2 place-content-center animate-in">
      <Tabs defaultValue="Signin" className="">
        <TabsList>
          <TabsTrigger value="Signin">Sign In</TabsTrigger>
          <TabsTrigger value="Signup">Sign Up</TabsTrigger>
        </TabsList>
      <TabsContent value="Signin" className='animate-in'>
      <Form {...signinForm}>
            <form onSubmit={signinForm.handleSubmit(onSignin)} className="space-y-8">
                <FormField
                control={signinForm.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                        <Input placeholder="put your email here!" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={signinForm.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="••••••••" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />

                <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 w-full hover:bg-green-600">
                  Sign In
                </button>
              </form>
            </Form>
            <div className='flex justify-center w-full gap-2'>
              <OAuthWithDiscord />
              <OAuthWithGithub />
            </div>
      </TabsContent>
      <TabsContent value="Signup" className='animate-in'>
      <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-8">
                <FormField
                control={signupForm.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>username</FormLabel>
                    <FormControl>
                        <Input placeholder="awesome username" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={signupForm.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>email</FormLabel>
                    <FormControl>
                        <Input placeholder="put your email here" {...field} />
                    </FormControl>
                    {/* <FormDescription>
                        This is your public display name.
                    </FormDescription> */}
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                    <FormLabel>password</FormLabel>
                    <FormControl>
                        <Input type='password' placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormDescription>
                        Password must be at least 8 characters long and contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <button className="flex items-center justify-center border border-foreground/20 w-full rounded-md px-4 py-2 text-foreground mb-2 hover:bg-btn-background-hover"
                >
                  Sign Up
                </button>
              </form>
            </Form>
            <div className='flex justify-center w-full gap-2'>
              <OAuthWithDiscord />
              <OAuthWithGithub />
            </div>
      </TabsContent>
      </Tabs>

      {searchParams?.message && (
        <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
          {searchParams.message}
        </p>
      )}

    </div>
  )
}
