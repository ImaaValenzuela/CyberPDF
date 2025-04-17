import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CyberPDF',
  description: 'CyberPDF es una herramienta futurista para unir y convertir documentos PDF con una interfaz cyberpunk. Desarrollado por ImaaValenzuela.',
  generator: 'ImaaValenzuela',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'CyberPDF',
    description: 'Uní y convertí PDFs en un entorno cyberpunk. Desarrollado por ImaaValenzuela.',
    url: 'https://cyberpdf.netlify.app/',
    siteName: 'CyberPDF',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CyberPDF',
      },
    ],
    locale: 'es_AR',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  )
}
