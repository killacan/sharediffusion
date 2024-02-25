'use client'

import { createPost, getSignedURL, createImg, checkPostName } from "../_components/serveractions"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../_components/ui/tabs"
import { Input } from "../_components/ui/input"
import FormButton from "../_components/ui/formButton"
import { Textarea } from "../_components/ui/textarea"
import { Checkbox } from "../_components/ui/checkbox"
import { createPostSchema, imgUploadSchema } from '../_components/schemas'
// import Image from "next/image"
import { Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import React, {useEffect, useState} from 'react';
import Dropzone from "react-dropzone";
import { cn } from "@/app/_components/utils";
import FileItem from "@/app/_components/fileItem";

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

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

const thumbsContainer = `
flex
flex-row
flex-wrap
mt-4
`;

  const thumbTailwind = `
    inline-flex
    rounded-md
    border
    border-gray-300
    mb-2
    mr-2
    w-24
    h-24
    p-1
    box-border
`;
  
  const thumbInner = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
  };
  
  const img = {
    display: 'block',
    width: 'auto',
    height: '100%'
  };
  

export default function PostAModel({
    searchParams,
  }: {
    searchParams: { message: string }
  }) {

    const [fileList, setFileList] = useState<UploadFile[]>([]);

    const [file, setFile] = useState<File | undefined>(undefined)
    const [postNameError, setPostNameError] = useState<string | undefined>(undefined)
    const [fileError, setFileError] = useState<string | undefined>(undefined)

    const form = useForm<z.infer<typeof createPostSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: '',
            magnet: '',
            description: '',
            version: '',
            version_desc: '',
            file: undefined,
        }
    })

    const photoForm = useForm<z.infer<typeof imgUploadSchema>>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            file: undefined,
        }
    })

    // const thumbs = fileList.map(file => (
    //     <div className="flex flex-col" key={file.name}>
    //         <div className={thumbTailwind} >
    //         <div style={thumbInner}>
    //             <img
    //             src={file.preview}
    //             style={img}
    //             // Revoke data uri after image is loaded
    //             onLoad={() => { 
    //                 if (file.preview) URL.revokeObjectURL(file.preview) 
    //             }}
    //             />
    //         </div>
    //         </div>
    //         <div className="flex items-center">
    //             <label htmlFor={`toggle-nsfw-${file.uid}`} className="mr-2">NSFW:</label>
    //             <input
    //                 id={`toggle-nsfw-${file.uid}`}
    //                 type="checkbox"
    //                 checked={isNSFW}
    //                 onChange={handleToggleNSFW}
    //                 className="form-checkbox h-5 w-5 text-gray-600"
    //             />
    //         </div>
    //         <button
    //             onClick={() => onDelete(file.uid)}
    //             className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
    //         >
    //             Delete
    //         </button>
    //     </div>
    //   ));

    const handleDelete = (uid: string) => {
        setFileList((prevFileList) => prevFileList.filter((file) => file.uid !== uid));
    }

    const handleToggleNSFW = (uid: string) => {
        console.log(uid, "uid")
        setFileList((prevFileList) => prevFileList.map((file) => {
            if (file.uid === uid) {
                return {
                    ...file,
                    nsfw: !file.nsfw
                }
            } else {
                return file
            }
        }));
        console.log(fileList, "fileList")
    }

    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        // if any of the files are larger than 10MB, remove them from the list
        // console.log(acceptedTypes)
        newFileList = newFileList.filter((file) => {
            if (file.size !== undefined && file.size > 10000000) {
                setFileError("No seriously, files must be under 10MB.")

                return false
            } else if (file.type !== undefined && !acceptedTypes.includes(file.type)) {
                setFileError("Only images are allowed")
                return false
            } else {
                setFileError(undefined)
                return true
            }

        })
        console.log(newFileList, "newFileList")
        setFileList(newFileList);
    };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
          src = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as FileType);
            reader.onload = () => resolve(reader.result as string);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
    };

    const generateFileName = (bytes = 32) => {
        const array = new Uint8Array(bytes);
        crypto.getRandomValues(array);
        return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    async function onSubmit(values: z.infer<typeof createPostSchema>) {
        
        // check to make sure the post name is unique
        const postNameCheck = await checkPostName(values.title)

        // if success returns false, then the post name is already taken
        if (!postNameCheck.success) {
            setPostNameError("This post title is already taken")
            return
        } else {
            setPostNameError(undefined)
        }

        if (fileList.length > 0) {
            let postId = await createPost(values, true)

            fileList.forEach(async (file) => {
                const fileContent = await file.originFileObj?.arrayBuffer();
                // check to make sure we have the file and it's not empty
                if (!file.originFileObj || !file.type || !file.size || !fileContent) {
                    console.log("no file or error with file")
                    return
                }
                // Get the signed URL for uploading the file
                const signedURLResult = await getSignedURL(file.type, file.size);
        
                if (signedURLResult.failure || !signedURLResult.success) {
                    console.log(signedURLResult.failure);
                } else {
                    const signedURL = signedURLResult.success.url;
                    const hashBuffer = await crypto.subtle.digest('SHA-1', fileContent);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    // Upload the file using the signed URL
                    try {
                        const name = generateFileName()
                        
                        const response = await fetch(signedURL, {
                            method: 'POST',
                            mode: 'cors',
                            body: file.originFileObj, // File object
                            headers: {
                                'Content-Type': file.type, // Mime type of the file
                                'authorization': signedURLResult.success.authorizationToken,
                                "X-Bz-File-Name": name,
                                "X-Bz-Content-Sha1": hashHex,
                            }
                        });
    
                        // this is what adds the img to the DB
                        createImg(postId, name, file.nsfw)
    
                        if (response.ok) {
                            console.log('File uploaded successfully!');
                        } else {
                            console.error('Failed to upload file:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                }
            })

        } else {
            createPost(values, false)
        }
    
        console.log(values);
    }

    async function handleImgSubmit() {
        console.log("submitting")
        if (fileList.length > 0) {

            fileList.forEach(async (file) => {
                const fileContent = await file.originFileObj?.arrayBuffer();
                // check to make sure we have the file and it's not empty
                if (!file.originFileObj || !file.type || !file.size || !fileContent) {
                    console.log("no file or error with file")
                    return
                }
                // Get the signed URL for uploading the file
                const signedURLResult = await getSignedURL(file.type, file.size);
        
                if (signedURLResult.failure || !signedURLResult.success) {
                    console.log(signedURLResult.failure);
                } else {
                    const signedURL = signedURLResult.success.url;
                    const hashBuffer = await crypto.subtle.digest('SHA-1', fileContent);
                    const hashArray = Array.from(new Uint8Array(hashBuffer));
                    const hashHex = hashArray
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join("");
                    // Upload the file using the signed URL
                    try {
                        const name = generateFileName()
                        
                        const response = await fetch(signedURL, {
                            method: 'POST',
                            mode: 'cors',
                            body: file.originFileObj, // File object
                            headers: {
                                'Content-Type': file.type, // Mime type of the file
                                'authorization': signedURLResult.success.authorizationToken,
                                "X-Bz-File-Name": name,
                                "X-Bz-Content-Sha1": hashHex,
                            }
                        });
    
                        // this is what adds the img to the DB
                        createImg(undefined, name, file.nsfw)
    
                        if (response.ok) {
                            console.log('File uploaded successfully!');
                        } else {
                            console.error('Failed to upload file:', response.statusText);
                        }
                    } catch (error) {
                        console.error('Error uploading file:', error);
                    }
                }
            })

        }
    }

    // function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    //     setFile(event.target.files?.[0])

    // }

    // console.log(fileList)
    // console.log(file)


    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => fileList.forEach(file => {
            if (file.preview) {
                URL.revokeObjectURL(file.preview);
            }
        });
    }, []);

    return (
        <div className="flex-1 flex flex-col w-full sm:max-w-lg px-8 py-8 gap-2 place-content-center">
            <h1 className="text-3xl font-bold">Create a Post</h1>
            {searchParams?.message && (
                <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {searchParams.message}
                </p>
            )}
            <Tabs defaultValue="model" className="">
                <TabsList>
                    <TabsTrigger value="model">Model</TabsTrigger>
                    <TabsTrigger value="photo">Photo</TabsTrigger>
                </TabsList>
                <TabsContent value="model" className='animate-in'>
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
                            {postNameError && <FormMessage >{postNameError}</FormMessage>}
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
                        <FormField
                        control={form.control}
                        name="file"
                        render={() => (
                            <Dropzone
                            accept={{
                                "image/*": [".jpg", ".jpeg", ".png"],
                            }}
                            onDropAccepted={(files) => {
                                const filteredFiles = files.filter((file) => {
                                    if (file.size !== undefined && file.size > 10000000) {
                                        setFileError("No seriously, files must be under 10MB.")
                                        return false;
                                    } else if (file.type !== undefined && !acceptedTypes.includes(file.type)) {
                                        setFileError("Only images are allowed")
                                        return false;
                                    } else {
                                        setFileError(undefined)
                                        return true;
                                    }
                                });
                                // Map files to UploadFile<any> objects with uid
                                const mappedFiles: UploadFile<any>[] = filteredFiles.map((file, index) => {
                                    return {
                                        ...file,
                                        name: file.name,  // Spread the 'name' property
                                        size: file.size,  // Spread the 'size' property
                                        type: file.type,  // Spread the 'type' property
                                        lastModified: file.lastModified, // Spread the 'lastModified' property
                                        uid: `${index}-${Date.now()}`, // Add the uid property
                                        preview: URL.createObjectURL(file), // Add the preview property
                                        nsfw: false, // Add the nsfw property
                                    }
                                });
                            
                                setFileList((prevFileList) => [...prevFileList, ...mappedFiles]);
                            }}
                            multiple={true}
                            maxSize={5000000}
                            >
                            {({ getRootProps, getInputProps }) => (
                                <div
                                {...getRootProps({
                                    className: cn(
                                    "p-3 mb-4 flex flex-col items-center justify-center w-full rounded-md cursor-pointer border border-[#e2e8f0]"
                                    ),
                                })}
                                >
                                <div className="flex items-center gap-x-3 mt-2 mb-2">
                                    <label
                                    htmlFor="Products"
                                    className={`text-sm text-[7E8DA0] cursor-pointer focus:outline-none focus:underline ${
                                        fileError && "text-red-500"
                                    }`}
                                    >
                                    Add your Images
                                    <input {...getInputProps()} />
                                    </label>
                                </div>
                                </div>
                            )}
                            </Dropzone>
                        )}
                        />
                        <aside className={thumbsContainer}>
                        {fileList.map((file) => (
                            <FileItem key={file.uid} file={file} onDelete={handleDelete} handleToggleNSFW={handleToggleNSFW} />
                        ))}
                        </aside>
                        <FormButton >Submit</FormButton>

                    </form>
                    </Form>
                </TabsContent>
                <TabsContent value="photo" className='animate-in'>
                <Form {...photoForm}>
                    <form onSubmit={photoForm.handleSubmit(handleImgSubmit)} className="space-y-8">
                        <FormLabel>Upload Photos!</FormLabel>
                            <FormField
                            control={photoForm.control}
                            name="file"
                            render={({ field }) => (
                                <FormItem>
                                <FormControl>
                                    <Upload
                                    // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onChange={onChange}
                                    onPreview={onPreview}
                                    accept="image/*"
                                >
                                    {fileList.length < 5 && <p className="text-white">+ Upload</p>}
                                </Upload>
                                </FormControl>
                                {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                            <FormDescription>
                                Files must be under 10MB
                            </FormDescription>
                            {fileError && <FormMessage >{fileError}</FormMessage>}
                            <button onClick={handleImgSubmit} >Submit</button>

                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </div>
      )
}