"use client";
import { Student, Team } from "@/utils/types";
import { useState } from "react";
import TeamSupervisor from "./team-supervisor";
import TeamMembers from "./teamMembers";
import Headingbar from "@/components/employeeComponents/Headingbar";
import { userInfo } from "os";

interface TeamManagementProps {
  userInfo: Student;
  studentsInfo: Student[];
  teamInfo: Team;
}
export default function TeamManagement({ userInfo, studentsInfo, teamInfo }: TeamManagementProps) {
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
  const [localTeamName, setLocalTeamName] = useState(teamInfo.team_name); // used to update the teamName when the user saves

  const [currentTeamInfo, setCurrentTeamInfo] = useState<Student>();
  const handleTeamName = (new_team_name: string) => {
    setLocalTeamName(new_team_name);
  };
  const disableButtons = userInfo.email !== teamInfo.team_lead_email ? true : false;
  return (
    <>
      <Headingbar text={localTeamName} />
      <div>
        <TeamMembers userInfo={userInfo} studentsInfo={studentsInfo} teamInfo={teamInfo} setTeamNameOnSave={handleTeamName} disableButtons={disableButtons} />
        <TeamSupervisor disableButtons={disableButtons} />
      </div>
    </>
  );
}
