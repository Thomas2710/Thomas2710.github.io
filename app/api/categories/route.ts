// /app/api/categories/route.ts
import supabase from '@/lib/supabase';

export async function GET(): Promise<Response> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name');

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }


  return Response.json(data);
}
