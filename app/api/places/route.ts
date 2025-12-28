import supabase from '@/lib/supabase';

export type PlaceWithVisits = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  place_visits: {
    id: string;
    start_date: string;
    end_date: string;
    place_visit_people: {
      name: string;
    }[];
  }[];
};

export async function GET(): Promise<Response> {
  const { data, error } = await supabase
    .from('places')
    .select(`
      id, name, lat, lng,
      place_visits (
        id, start_date, end_date,
        place_visit_people ( name )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Supabase GET error (places with visits):', error);
    return new Response(JSON.stringify([]), { status: 500 });
  }
  console.log('API fetch data:', data, 'error:', error);


  return new Response(JSON.stringify(data ?? []), { status: 200 });
}
