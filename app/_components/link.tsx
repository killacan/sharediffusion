import Link from "next/link";



export default function LinkComponent({ href, children }: { href: string, children: any }) {
  return (
    <Link className="px-3 border rounded-md mx-2" href={href}>
        {children}
    </Link>
  );
}