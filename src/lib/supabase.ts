import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ephjatoxmdeklvmefgaw.supabase.co";
// Publishable key - public by design; Row Level Security protects the data.
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_GBYpxvzYz6W5FsnWtYgVjQ_6VkvHmhN";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
