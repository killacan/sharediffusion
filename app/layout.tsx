import { GeistSans } from 'geist/font/sans'
import './globals.css'
import Nav from './_components/nav'
import Footer from "./_components/footer"
import { SpeedInsights } from "@vercel/speed-insights/next"

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Share Diffusion',
  description: 'The best place to share your Stable Diffusion models.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <SpeedInsights/>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <Nav />
          {children}
          <Footer />
        </main>
      </body>
    </html>
  )
}
