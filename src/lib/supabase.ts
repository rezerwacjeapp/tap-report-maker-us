import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ephjatoxmdeklvmefgaw.supabase.co";
// Klucz publiczny (publishable) - jawny z założenia, dostęp do danych chroni RLS.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_GBYpxvzYz6W5FsnWtYgVjQ_6VkvHmhN";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
