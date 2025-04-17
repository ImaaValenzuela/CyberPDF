import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CyberPDF',
  description: 'Created by ImaaValenzuela',
  generator: 'ImaaValenzuela',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
