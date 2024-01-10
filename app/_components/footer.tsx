import { DiGithubBadge } from "react-icons/di";
import { FaDiscord } from "react-icons/fa";
import LinkComponent from "./link";
import { Link } from "lucide-react";

export default function Footer() {

    return (
    <footer className="w-full flex justify-center border-t border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex items-center p-3 text-3xl">
        <a className="px-3" href="https://github.com/killacan/sharediffusion" target="_blank" rel="noopener noreferrer"><DiGithubBadge /></a>
        <a className="px-3" href="https://discord.gg/y7aMda893Y" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
        <LinkComponent href={"/privacypolicy"}>Privacy Policy</LinkComponent>
        <LinkComponent href={"/tos"}>Terms and Conditions</LinkComponent>
      </div>
    </footer>
  )
}