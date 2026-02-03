import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nwdljqeqoqmmsdoclzvy.supabase.co';
const supabaseKey = 'sb_publishable_LoV7y8WSFXYkwZYVPReT7w_3W9YrZf0';

export const supabase = createClient(supabaseUrl, supabaseKey);