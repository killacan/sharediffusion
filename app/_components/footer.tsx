import { DiGithubBadge } from "react-icons/di";
import { FaDiscord } from "react-icons/fa";

export default function Footer() {

    return (
    <footer className="w-full flex justify-center border-t border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
        <a href="https://github.com/killacan/sharediffusion" target="_blank" rel="noopener noreferrer"><DiGithubBadge /></a>
        <a href="https://discord.gg/y7aMda893Y" target="_blank" rel="noopener noreferrer"><FaDiscord /></a>
      </div>
    </footer>
  )
}