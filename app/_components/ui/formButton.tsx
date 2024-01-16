
export default function FormButton({ children }: { children: any }) {

    
    return (
        <button
            className="flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 w-full hover:bg-btn-background-hover"
        >
            {children}
        </button>
    )
     
}