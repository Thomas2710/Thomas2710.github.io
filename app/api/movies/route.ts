import supabase from "@/lib/supabase";

export async function GET(): Promise<Response> {
  const { data, error } = await supabase
    .from("movies")
    .select("id, title, year, genre, director, plot, poster, imdb_score, watched, rating")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase GET error (movies):", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }

  return new Response(JSON.stringify(data ?? []), { status: 200 });
}
