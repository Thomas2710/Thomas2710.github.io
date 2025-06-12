import supabase from '@/lib/supabase';
import { LRUCache } from 'lru-cache';

// Define the shape of the incoming request body
interface ThoughtInput {
  text: string;
  category_id: string;
}

// Create a typed LRU cache for rate limiting based on IP
const rateLimiter = new LRUCache<string, number>({
  max: 5000,
  ttl: 1000 * 60 * 1, // 1 minute
});

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const lastRequestTime = rateLimiter.get(ip);

  // Limit to one request every 500 seconds per IP
  if (lastRequestTime && now - lastRequestTime < 500 * 1000) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), { status: 429 });
  }

  rateLimiter.set(ip, now);

  let input: ThoughtInput;
  try {
    input = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { text, category_id } = input;

  if (!text || !category_id) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
  }

  const { error } = await supabase
    .from('thoughts')
    .insert([{ text, category_id }]);

  if (error) {
    console.error('Supabase POST error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return Response.json({ success: true });
}

export async function GET(): Promise<Response> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('id, text, category_id')
    .order('inserted_at', { ascending: false });

  if (error) {
    console.error('Supabase GET error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return Response.json(data);
}


