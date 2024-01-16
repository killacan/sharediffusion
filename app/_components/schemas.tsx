import * as z from 'zod'

export const upadeProfileSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters long'
    }),
    email: z.string().email({
        message: 'Please enter a valid email address'
    }),
    description: z.string(),
    profile_image: z.string(),

})

export const formSchema = z.object({
    title: z.string().min(2, {
        message: 'Title must be at least 2 characters long'
    }),
    magnet: z.string(),
    description: z.string(),

})

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