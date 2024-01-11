import { DiGithubBadge } from "react-icons/di";
import { FaDiscord } from "react-icons/fa";
// import LinkComponent from "./link";
import Link from "next/link";

export default function Footer() {

  let toslink = "text-lg px-3 border rounded-full mr-3 hover:bg-slate-600"
  
  return (
    <footer className="w-full flex justify-center border-t border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex items-center p-3 text-4xl">
        <a className="px-3" href="https://github.com/killacan/sharediffusion" target="_blank" rel="noopener noreferrer"><DiGithubBadge /></a>
        <a className="px-3" href="https://discord.gg/y7aMda893Y" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
        <Link className={toslink} href={"/privacypolicy"}>Privacy Policy</Link>
        <Link className={toslink} href={"/tos"}>Terms and Conditions</Link>
      </div>
    </footer>
  )
}