

export default function AuthButton({ children, handleFunction }: { children: any, handleFunction: any }) {

    
    return (
        <button
            onClick={handleFunction}
            className="flex items-center justify-center border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 w-1/2 hover:bg-btn-background-hover"
        >
            {children}
        </button>
    )
     
}