import { z } from 'zod'
import sanitizeHtml from 'sanitize-html'
import supabase from '@/lib/supabase'
import { LRUCache } from 'lru-cache'

// Create a typed LRU cache for rate limiting based on IP and category
const rateLimiter = new LRUCache<string, number>({
  max: 5000,
  ttl: 1000 * 60 * 60 * 24, // 60 * 24 minutes (1 day)
});

// 1️⃣ Define a Zod schema for your input
const ThoughtSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Text can’t be empty' })
    .max(500, { message: 'Text is too long' }),
  category_id: z
    .string()
    .uuid({ message: 'Invalid category ID format' }),
})

export async function POST(req: Request): Promise<Response> {
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  let rawBody: unknown;
  
  try {
    rawBody = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  // 2️⃣ Validate with Zod
  const result = ThoughtSchema.safeParse(rawBody);
  if (!result.success) {
    const firstError = result.error.errors[0];
    return new Response(
      JSON.stringify({ error: firstError.message }),
      { status: 400 }
    );
  }

  const { text, category_id } = result.data;

  // 2️⃣ Rate limiter logic: Limit to one request every day per IP and category
  const rateLimitKey = `${ip}:${category_id}`;
  const now = Date.now();
  const lastRequestTime = rateLimiter.get(rateLimitKey);

  // If user has already posted in this category within the last 24 hours
  if (lastRequestTime && now - lastRequestTime < 60 * 60 * 24 * 1000) {
    return new Response(JSON.stringify({ error: 'Too many requests. You can only post one thought per category per day.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Set the rate limit timestamp for the combination of IP and category_id
  rateLimiter.set(rateLimitKey, now);

  // 3️⃣ Sanitize the text (strip all HTML tags/attributes)
  const cleanText = sanitizeHtml(text, {
    allowedTags: [],        // no HTML tags allowed
    allowedAttributes: {},  // no attributes
  });

  // 4️⃣ Insert into Supabase (parameterized under the hood)
  const { data, error } = await supabase
    .from('thoughts')
    .insert([{ text: cleanText, category_id }])
    .select('id');

  if (error) {
    console.error('Supabase POST error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return Response.json({ success: true, id: data[0].id });
}

export async function GET(): Promise<Response> {
  const { data, error } = await supabase
    .from('thoughts')
    .select('id, text, category_id')
    .order('inserted_at', { ascending: false });

  if (error) {
    console.error('Supabase GET error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }

  // Sanitize each text field to strip out any HTML
  const sanitized = (data ?? []).map((row) => ({
    id: row.id,
    category_id: row.category_id,
    text: sanitizeHtml(row.text, {
      allowedTags: [],       // no tags allowed
      allowedAttributes: {}, // no attributes allowed
    }),
  }));

  return Response.json(sanitized);
}
