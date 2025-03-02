import TeamManagement from "@/components/studentComponents/teamComponent/team-management";
import UnauthorizedPage from "@/components/unAuthorized";
import { createClient } from "@/utils/supabase/server";
import { Student, Team } from "@/utils/types";

export default async function Teampage() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return <UnauthorizedPage />;
  }

  // Todo: check if the user is a student
  const { data, error: userError } = await supabase.from("Students").select("*").eq("student_id", user.id).single();
  if (!data || userError != null) {
    console.log(`Error retrieving student ${user.user_metadata.full_name} info from Student table. Here is more detail: ${userError?.message}`);
    return;
  }
  const userInfo = data as Student;

  const { data: teamData, error: teamError } = await supabase.from("Teams").select("*").eq("team_id", userInfo.team_id).single();

  if (!teamData || teamError) {
    console.log(`Error retrieving team info for student ${user.user_metadata.full_name}. Here is more detail: ${teamError?.message}`);
    return;
  }
  const teamInfo = teamData as Team;

  return (
    <>
      <TeamManagement userInfo={userInfo} teamInfo={teamInfo} />
    </>
  );
}
