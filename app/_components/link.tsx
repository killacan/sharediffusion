import Link from "next/link";



export default function LinkComponent({ href, children }: { href: string, children: any }) {
  return (
    <Link className="py-2 px-3 flex no-underline bg-btn-background hover:bg-btn-background-hover" href={href}>
        {children}
    </Link>
  );
}