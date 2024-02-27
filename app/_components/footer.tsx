import { DiGithubBadge } from "react-icons/di";
import { FaDiscord } from "react-icons/fa";
// import LinkComponent from "./link";
import Link from "next/link";

export default function Footer() {

  let toslink = "text-lg px-3 border rounded-md mr-3 bg-btn-background hover:bg-btn-background-hover"
  
  return (
    <footer className="w-full flex justify-center border-t border-b border-b-foreground/10 h-16 sticky bottom-0 bg-accent">
      <div className="w-full max-w-4xl flex items-center p-3 text-4xl">
        <a className="pr-3" href="https://github.com/killacan/sharediffusion" target="_blank" rel="noopener noreferrer"><DiGithubBadge /></a>
        <a className="pr-3" href="https://discord.gg/y7aMda893Y" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
        <Link className={toslink} href={"/privacypolicy"}>Privacy Policy</Link>
        <Link className={toslink} href={"/tos"}>Terms and Conditions</Link>
        <p className="text-sm">copyright Share Diffusion llc</p>
      </div>
    </footer>
  )
}