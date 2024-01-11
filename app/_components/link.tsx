import Link from "next/link";



export default function LinkComponent({ href, children }: { href: string, children: any }) {
  return (
    <Link className="px-3 border rounded-full mr-3 bg-btn-background " href={href}>
        {children}
    </Link>
  );
}