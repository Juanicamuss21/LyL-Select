import { createClient } from '@/lib/supabase/server'
import type { Vaper } from '@/features/catalog/types'
import { VaperForm } from '@/features/admin/components/VaperForm'

interface PageProps {
  searchParams: Promise<{ duplicar?: string }>
}

export default async function AdminNuevoVaperPage({ searchParams }: PageProps) {
  const { duplicar } = await searchParams
  let initialVaper: Vaper | null = null

  if (duplicar) {
    const supabase = await createClient()
    const { data } = await supabase.from('vapers').select('*').eq('id', duplicar).single()
    if (data) {
      initialVaper = data as Vaper
    }
  }

  return (
    <VaperForm
      initialVaper={initialVaper}
      isDuplicate={Boolean(duplicar)}
    />
  )
}
