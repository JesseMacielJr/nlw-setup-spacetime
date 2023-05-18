import './globals.css'
import {
  Roboto_Flex as Roboto,
  Bai_Jamjuree as BaiJamjuree,
} from 'next/font/google'
import React from 'react'

// O next/font evita o Layout shit
// Layout shift: quando o site começa com as fontes padrões até as importadas serem carregadas

const roboto = Roboto({ subsets: ['latin'], variable: '--font-roboto' })
const baijamjuree = BaiJamjuree({
  subsets: ['latin'],
  weight: '700',
  variable: '--font-bai-jamjuree',
})

export const metadata = {
  title: 'NLW Spacetime',
  description:
    'Uma cápsula do tempo construida com React, Next.js, TailwindCSS, Prisma, SQLite e Typescript',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${baijamjuree.variable} bg-gray-900 font-sans text-gray-100`}
      >
        {children}
      </body>
    </html>
  )
}
