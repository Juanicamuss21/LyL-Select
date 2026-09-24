import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Perfume } from '@/features/catalog/types'
import { PerfumeWizard } from '@/features/admin/components/PerfumeWizard'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditarPerfumePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.from('perfumes').select('*').eq('id', id).single()

  if (error || !data) {
    notFound()
  }

  const perfume = data as Perfume

  return <PerfumeWizard initialPerfume={perfume} isDuplicate={false} />
}
