export interface SiteConfig {
  id: string
  whatsapp_number: string
  whatsapp_greeting: string
  instagram_url: string
  tiktok_url: string | null
  facebook_url: string | null
  trust_envios: string
  trust_medios_pago: string
  trust_garantia: string
  updated_at: string
}

export type SiteConfigInput = Omit<SiteConfig, 'id' | 'updated_at'>
