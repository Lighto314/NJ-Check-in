import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bzedbjyueqpsgmudssan.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZWRianl1ZXFwc2dtdWRzc2FuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0MjI2ODcsImV4cCI6MjA2Njk5ODY4N30.kQa3jo8sHvFGeNyV-OI9JrcMjcmW7hnNAqr7eWNfRtY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 