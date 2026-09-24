import { createClient } from '@/lib/supabase/server'
import type { Vaper } from '@/features/catalog/types'
import { AdminVapersClient } from '@/features/admin/components/AdminVapersClient'

export const dynamic = 'force-dynamic'

export default async function AdminVapersPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('vapers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching vapers for admin:', error)
  }

  const vapers: Vaper[] = data || []

  return <AdminVapersClient initialVapers={vapers} />
}
