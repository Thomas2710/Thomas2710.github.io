import supabase from "@/lib/supabase";

export async function GET(): Promise<Response> {
  const { data, error } = await supabase
    .from("books")
    .select("id, title, author, year, genre, pages, plot, isbn, publisher, language, cover,  read, rating")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase GET error (books):", error);
    return new Response(JSON.stringify([]), { status: 500 });
  }

  return new Response(JSON.stringify(data ?? []), { status: 200 });
}

