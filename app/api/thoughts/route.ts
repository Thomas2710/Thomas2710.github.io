
import { z } from 'zod'
import sanitizeHtml from 'sanitize-html'
import supabase from '@/lib/supabase'
import { LRUCache } from 'lru-cache'

// … your rateLimiter setup …

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
  // … rate-limiting logic …

  let rawBody: unknown
  try {
    rawBody = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 })
  }

  // 2️⃣ Validate with Zod
  const result = ThoughtSchema.safeParse(rawBody)
  if (!result.success) {
    const firstError = result.error.errors[0]
    return new Response(
      JSON.stringify({ error: firstError.message }),
      { status: 400 }
    )
  }
  const { text, category_id } = result.data

  // 3️⃣ Sanitize the text (strip all HTML tags/attributes)
  const cleanText = sanitizeHtml(text, {
    allowedTags: [],        // no HTML tags allowed
    allowedAttributes: {},  // no attributes
  })

  // 4️⃣ Insert into Supabase (parameterized under the hood)
  const { error } = await supabase
    .from('thoughts')
    .insert([{ text: cleanText, category_id }])

  if (error) {
    console.error('Supabase POST error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return Response.json({ success: true })
}
