'use client'
import OAuthWithDiscord from '../_components/oauthbutton'
import OAuthWithGithub from '../_components/oauthgithub'
import { signIn, signUp } from '../_components/loginactions'
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

export const signinFormSchema = z.object({
  email: z.string().email({
      message: 'Please enter a valid email address'
  }),
  password: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
  }),
})

export const signupFormSchema = z.object({
  username: z.string().min(2, {
      message: 'Username must be at least 2 characters long'
  }),
  email: z.string().email({
      message: 'Please enter a valid email address'
  }),
  password: z.string().min(8, {
      message: 'Password must be at least 8 characters long'
  })

})
// .superRefine(({ password }, checkPassComplexity) => {
//   const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
//   const containsLowercase = (ch: string) => /[a-z]/.test(ch);
//   const containsSpecialChar = (ch: string) =>
//     /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
//   let countOfUpperCase = 0,
//     countOfLowerCase = 0,
//     countOfNumbers = 0,
//     countOfSpecialChar = 0;
//   for (let i = 0; i < password.length; i++) {
//     let ch = password.charAt(i);
//     if (!isNaN(+ch)) countOfNumbers++;
//     else if (containsUppercase(ch)) countOfUpperCase++;
//     else if (containsLowercase(ch)) countOfLowerCase++;
//     else if (containsSpecialChar(ch)) countOfSpecialChar++;
//   }
//   if (
//     countOfLowerCase < 1 ||
//     countOfUpperCase < 1 ||
//     countOfSpecialChar < 1 ||
//     countOfNumbers < 1
//   ) {
//     checkPassComplexity.addIssue({
//       code: "custom",
//       message: "password must have at least 1 uppercase, 1 lowercase, 1 number, and 1 special character",
//     });
//   }
// })

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
    <div className="flex-1 flex flex-col w-full sm:max-w-lg px-8 gap-2 place-content-center">
      <Tabs defaultValue="Signin" className="">
        <TabsList>
          <TabsTrigger value="Signin">Sign In</TabsTrigger>
          <TabsTrigger value="Signup">Sign Up</TabsTrigger>
        </TabsList>
      <TabsContent value="Signin">
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
        {/* <form
          className="animate-in flex flex-col w-full justify-center gap-2 text-foreground"
          action={signIn}
        >
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2 hover:bg-green-600">
            Sign In
          </button>



          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form> */}
      </TabsContent>
      <TabsContent value="Signup">
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
      {/* <form
          className="animate-in flex flex-col w-full justify-center gap-2 text-foreground"
          action={signUp}
        >
          <label className="text-md" htmlFor="username">
            Username
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="username"
            placeholder="FrankTheTanks69420"
            required
          />
          <label className="text-md" htmlFor="email">
            Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            placeholder="you@example.com"
            required
          />
          <label className="text-md" htmlFor="password">
            Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            placeholder="••••••••"
            required
          />
          <button className="flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 hover:bg-btn-background-hover"
          >
            Sign Up
          </button>



          {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}
        </form> */}
      </TabsContent>
      </Tabs>
      <div className='flex justify-center w-full'>
        <OAuthWithDiscord />
        <OAuthWithGithub />
      </div>
      {searchParams?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {searchParams.message}
            </p>
          )}

    </div>
  )
}
