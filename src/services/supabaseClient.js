import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ckbybgnyymzdsoxbgnkd.supabase.co'
const supabaseAnonKey = 'sb_publishable_QBOeWcwy4CULH4e6UY79cw_SxZPkpSV'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
