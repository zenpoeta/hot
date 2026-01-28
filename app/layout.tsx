import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Redirecionamento de Bots',
  description: 'Sistema de redirecionamento balanceado para bots do Telegram',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
