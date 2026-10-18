import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMyHouseholdId(supabase: SupabaseClient) {
  const { data: link } = await supabase
    .from("household_users")
    .select("household_id")
    .limit(1)
    .maybeSingle();
  if (link) return link.household_id as string;

  // First time here: create a household (the database adds you as a member)
  const { data } = await supabase.from("households").insert({}).select("id").single();
  return (data?.id as string | undefined) ?? null;
}