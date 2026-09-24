-- Migration: create site_config table and RLS policies
CREATE TABLE IF NOT EXISTS public.site_config (
  id TEXT PRIMARY KEY DEFAULT 'singleton',
  whatsapp_number TEXT NOT NULL DEFAULT '5493854353077',
  whatsapp_greeting TEXT NOT NULL DEFAULT 'Hola LyL Select!',
  instagram_url TEXT NOT NULL DEFAULT '',
  tiktok_url TEXT,
  facebook_url TEXT,
  trust_envios TEXT NOT NULL DEFAULT '',
  trust_medios_pago TEXT NOT NULL DEFAULT '',
  trust_garantia TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_config'
      AND policyname = 'Allow authenticated users full access'
  ) THEN
    CREATE POLICY "Allow authenticated users full access"
      ON public.site_config FOR ALL TO authenticated
      USING (true) WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'site_config'
      AND policyname = 'Allow public read'
  ) THEN
    CREATE POLICY "Allow public read"
      ON public.site_config FOR SELECT TO anon
      USING (true);
  END IF;
END $$;

INSERT INTO public.site_config (id)
VALUES ('singleton')
ON CONFLICT (id) DO NOTHING;
