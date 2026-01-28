'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redireciona imediatamente para a API de redirecionamento
    router.push('/api/redirect')
  }, [router])

  // Retorna uma página vazia (usuário será redirecionado antes de ver qualquer coisa)
  return null
}
