'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import type { SiteConfig } from '../types'
import { getSiteConfigClient } from '../services/config'
import { LYL_WHATSAPP_NUMBER } from '@/features/catalog/utils/whatsapp'

interface SiteConfigContextType {
  config: SiteConfig | null
  whatsappNumber: string
  whatsappGreeting: string
  instagramUrl: string | null
}

const DEFAULT_GREETING = 'Hola LyL Select! 👋 Estuve viendo su catálogo web y me gustaría consultar.'

const SiteConfigContext = createContext<SiteConfigContextType>({
  config: null,
  whatsappNumber: LYL_WHATSAPP_NUMBER,
  whatsappGreeting: DEFAULT_GREETING,
  instagramUrl: null,
})

export function SiteConfigProvider({
  initialConfig,
  children,
}: {
  initialConfig: SiteConfig | null
  children: React.ReactNode
}) {
  const [config, setConfig] = useState<SiteConfig | null>(initialConfig)

  useEffect(() => {
    if (initialConfig) {
      setConfig(initialConfig)
    } else {
      getSiteConfigClient().then((data) => {
        if (data) setConfig(data)
      })
    }
  }, [initialConfig])

  const whatsappNumber = config?.whatsapp_number || LYL_WHATSAPP_NUMBER
  const whatsappGreeting = config?.whatsapp_greeting || DEFAULT_GREETING
  const instagramUrl = config?.instagram_url || null

  return (
    <SiteConfigContext.Provider
      value={{
        config,
        whatsappNumber,
        whatsappGreeting,
        instagramUrl,
      }}
    >
      {children}
    </SiteConfigContext.Provider>
  )
}

export function useSiteConfig() {
  return useContext(SiteConfigContext)
}
