// this page is going to be for grabbing an individual post and displaying it.

export default function Post({ params: { id } }: { params: { id: string } }) {

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <h1 className="text-3xl font-bold">Post</h1>
                <p>Post</p>
            </div>
        </div>
    )
}