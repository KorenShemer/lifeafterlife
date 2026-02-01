// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { ConditionalLayout } from '@/shared/components/ConditionalLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Life After Life - Preserve Your Memories',
  description: 'A secure platform to store and share your digital memories with loved ones',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ConditionalLayout>{children}</ConditionalLayout>
        </Providers>
      </body>
    </html>
  )
}