

export default function PostAModel() {

    const createPost = async (formData: FormData) => {
        'use server'
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="animate-in flex-1 flex flex-col gap-3 opacity-0 max-w-4xl px-3">
                <h1 className="text-4xl font-bold">Post A Model</h1>
                <form
                    action={createPost}
                    className="animate-in flex flex-col w-full justify-center gap-2 text-foreground"
                >
                    <label className="text-md" htmlFor="title">
                        Title
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        name="title"
                        placeholder="Title"
                        required
                    />
                    <label className="text-md" htmlFor="magnet">
                        Magnet Link
                    </label>
                    <input
                        className="rounded-md px-4 py-2 bg-inherit border mb-6"
                        type="magnet"
                        name="magnet"
                        placeholder="Magnet Link"
                        required
                    />
                </form>
            </div>
        </div>
    )
}