import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Vaper } from '@/features/catalog/types'
import { VaperForm } from '@/features/admin/components/VaperForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function AdminEditarVaperPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.from('vapers').select('*').eq('id', id).single()

  if (error || !data) {
    notFound()
  }

  const vaper = data as Vaper

  return <VaperForm initialVaper={vaper} isDuplicate={false} />
}
