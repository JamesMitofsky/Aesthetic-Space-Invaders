import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'

const supabaseUrl = 'https://pkcvabkupeyjyxwfdvfk.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrY3ZhYmt1cGV5anl4d2ZkdmZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTUyMTk1NjEsImV4cCI6MjAxMDc5NTU2MX0.YlS-TdDN_QSMnIQWVm436pwf07Ajss2uIajBKn5A3Ek'
const supabase = createClient<Database>(supabaseUrl, supabaseKey)

export default supabase
