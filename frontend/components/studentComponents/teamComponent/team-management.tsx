"use client";
import { Student, Team } from "@/utils/types";
import { useEffect, useState } from "react";
import TeamSupervisor from "./team-supervisor";
import TeamMembers from "./teamMembers";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { createClient } from "@/utils/supabase/client";

interface TeamManagementProps {
  userInfo: Student;
  teamInfo: Team;
}

const supabase = createClient();

const handleUpdateTeam = async (team: Partial<Team>): Promise<{ status: string; reason?: string; value?: any }> => {
  if (!team.team_id) return { status: "rejected", reason: "No team ID provided" };
  if (!team.team_name || !team.team_name.trim()) return { status: "rejected", reason: "Team name cannot be empty" };

  // Update team name in the database
  const { data, error } = await supabase
    .from("Teams")
    .update({ supervisor_name: team.supervisor_name, supervisor_email: team.supervisor_email, team_name: team.team_name })
    .eq("team_id", team.team_id);

  if (error) throw error;
  return { status: "fulfilled", value: data };
};

export default function TeamManagement({ userInfo, teamInfo }: TeamManagementProps) {
  // const [student, setStudent] = useState<Partial<Student>[]>([
  //   {
  //     student_id: "012029",
  //     email: "john@example.com",
  //     password: "password123",
  //     full_name: "John Doe",
  //     university: "University A",
  //     major: "CS",
  //     github: "https://github.com/johndoe",
  //     team_id: "21623653532sdhsdh",
  //     ttg_email: null,
  //     changed_password: false,
  //   },
  //   {
  //     student_id: "dsjds73",
  //     email: "jane@example.com",
  //     password: "password123",
  //     full_name: "Jane Smith",
  //     university: "University B",
  //     major: "SE",
  //     github: "https://github.com/janesmith",
  //     team_id: "21623653532sdhsdh",
  //     ttg_email: "JaneSmike@ttg.com",
  //     changed_password: false,
  //   },
  //   {
  //     student_id: "dsh32623",
  //     email: "mike@example.com",
  //     password: "password123",
  //     full_name: "Mike Ross",
  //     university: "University C",
  //     major: "IT",
  //     github: "https://github.com/mikeross",
  //     team_id: "21623653532sdhsdh",
  //     ttg_email: null,
  //     changed_password: false,
  //   },
  // ]);

  // const [team, setTeam] = useState<Team>({
  //   team_id: "21623653532sdhsdh",
  //   team_name: "Team Alpha",
  //   team_lead_email: "mike@example.com",
  //   nda_file: "nda.pdf",
  //   completed_onboarding: "2023-01-01",
  //   project_id: "project123",
  //   supervisor_name: "Dr. Smith",
  //   supervisor_email: "dr.smith@example.com",
  // });
  const [teamName, setTeamName] = useState<string>(teamInfo.team_name); // used to update the teamName when the user saves

  const [currentTeamInfo, setCurrentTeamInfo] = useState<Partial<Team>>(teamInfo);

  const fetchTeam = async () => {
    const { data: teamData, error: teamError } = await supabase.from("Teams").select("*").eq("team_id", userInfo.team_id).single();
    if (!teamData || teamError) {
      console.log(`Error retrieving team info for student ${userInfo.full_name}. Here is more detail: ${teamError?.message}`);
      setCurrentTeamInfo({});
      setTeamName("");
    } else {
      const teamInfo = teamData as Partial<Team>;
      setTeamName(teamInfo.team_name ?? "");
      setCurrentTeamInfo(teamInfo);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleTeamName = async (new_team_name: string): Promise<{ type: "success" | "error"; text: JSX.Element[] }> => {
    console.log("teamMgm file, Team name was changed");

    let message: JSX.Element[] = [];
    try {
      const result = await handleUpdateTeam({ ...currentTeamInfo, team_name: new_team_name });
      if (result.status === "fulfilled") {
        message = [<p className="text-green-600 font-bold">Team name updated successfully.</p>];
        return { type: "success", text: message };
      } else {
        message = [<p className="text-red-600 font-bold">{String(result.reason)}</p>];
        return { type: "error", text: message };
      }
    } catch (error) {
      console.error("Error updating team name:", error);
      message = [<p className="text-red-600 font-bold">Failed to update team name. Please try again.</p>];
      return { type: "error", text: message };
    } finally {
      await fetchTeam();
    }
  };
  const disableButtons = userInfo.email !== (currentTeamInfo?.team_lead_email ?? "") ? true : false;
  return (
    <>
      <Headingbar text={teamName} />
      <div>
        <TeamMembers userInfo={userInfo} originalTeamInfo={currentTeamInfo} teamName={teamName} setTeamNameOnSave={handleTeamName} disableButtons={disableButtons} />
        <TeamSupervisor disableButtons={disableButtons} originalTeamInfo={currentTeamInfo} fetchTeam={fetchTeam} handleUpdateTeam={handleUpdateTeam} />
      </div>
    </>
  );
}
