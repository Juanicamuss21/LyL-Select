import { createClient } from '@/lib/supabase/server'
import type { Perfume } from '@/features/catalog/types'
import { PerfumeWizard } from '@/features/admin/components/PerfumeWizard'

interface PageProps {
  searchParams: Promise<{ duplicar?: string }>
}

export default async function AdminNuevoPerfumePage({ searchParams }: PageProps) {
  const { duplicar } = await searchParams
  let initialPerfume: Perfume | null = null

  if (duplicar) {
    const supabase = await createClient()
    const { data } = await supabase.from('perfumes').select('*').eq('id', duplicar).single()
    if (data) {
      initialPerfume = data as Perfume
    }
  }

  return (
    <PerfumeWizard
      initialPerfume={initialPerfume}
      isDuplicate={Boolean(duplicar)}
    />
  )
}
