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
  const { data, error: studError } = await supabase.from("Students").select("*").eq("student_id", user.id).single();
  if (!data || studError != null) {
    // alert("Error retrieving your info, please contact TTG sponsor");
    console.log(`Error retrieving student ${user.user_metadata.full_name} info from Student table. Here is more detail: ${studError?.message}`);
    return;
  }
  const studentInfo = data as Student;
  // Todo: get the student info and the student team info
  const { data: teamData, error: teamError } = await supabase.from("Teams").select("*").eq("team_id", studentInfo.team_id).single();

  if (!teamData || teamError) {
    // alert("Error retrieving your info, please contact TTG sponsor");
    console.log(`Error retrieving team info for student ${user.user_metadata.full_name}. Here is more detail: ${teamError?.message}`);
    return;
  }
  const teamInfo = teamData as Team;
  return (
    <>
      <TeamManagement studentInfo={studentInfo} teamInfo={teamInfo} />
    </>
  );
}
