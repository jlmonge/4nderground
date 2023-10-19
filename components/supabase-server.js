import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Returns a function
const createClient = () => createServerComponentClient({ cookies })
export default createClient;