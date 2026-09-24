import { createClient } from '@/lib/supabase/server'
import type { Perfume } from '@/features/catalog/types'
import { AdminPerfumesClient } from '@/features/admin/components/AdminPerfumesClient'

export const dynamic = 'force-dynamic'

export default async function AdminPerfumesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('perfumes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching perfumes for admin:', error)
  }

  const perfumes: Perfume[] = data || []

  return <AdminPerfumesClient initialPerfumes={perfumes} />
}
