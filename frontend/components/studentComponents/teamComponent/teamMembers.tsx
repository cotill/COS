"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Crown } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Student, Team } from "@/utils/types";
import CancelSaveBtn from "./cancel-save-btn";

interface TeamMembersProp {
  studentInfo: Student;
  teamInfo: Team;
  setTeamNameOnSave: (new_team_name: string) => void; // used to update the teamName when the user saves
}
const minTeamSize = 3;
const maxTeamSize = 10;

export default function TeamMembers({ studentInfo, teamInfo, setTeamNameOnSave }: TeamMembersProp) {
  const [student, setStudent] = useState<Partial<Student>[]>([
    {
      student_id: "012029",
      email: "john@example.com",
      password: "password123",
      full_name: "John Doe",
      university: "University A",
      major: "CS",
      github: "https://github.com/johndoe",
      team_id: "21623653532sdhsdh",
      ttg_email: null,
      changed_password: false,
    },
    {
      student_id: "dsjds73",
      email: "jane@example.com",
      password: "password123",
      full_name: "Jane Smith",
      university: "University B",
      major: "SE",
      github: "https://github.com/janesmith",
      team_id: "21623653532sdhsdh",
      ttg_email: "JaneSmike@ttg.com",
      changed_password: false,
    },
    {
      student_id: "dsh32623",
      email: "mike@example.com",
      password: "password123",
      full_name: "Mike Ross",
      university: "University C",
      major: "IT",
      github: "https://github.com/mikeross",
      team_id: "21623653532sdhsdh",
      ttg_email: null,
      changed_password: false,
    },
  ]);

  const [team, setTeam] = useState<Team>({
    team_id: "21623653532sdhsdh",
    team_name: "Team Alpha",
    team_lead_email: "mike@example.com",
    nda_file: "nda.pdf",
    completed_onboarding: "2023-01-01",
    project_id: "project123",
    supervisor_name: "Dr. Smith",
    supervisor_email: "dr.smith@example.com",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (student.length < minTeamSize) {
      const newMembers = [...student];
      for (let i = student.length; i < minTeamSize; i++) {
        newMembers.push({ full_name: "", major: "", ttg_email: "", email: "" });
      }
      setStudent(newMembers);
    }
  }, []);

  const addMember = () => {
    if (student.length < maxTeamSize) {
      setStudent([...student, { full_name: "", major: "", ttg_email: "", email: "" }]);
    }
  };

  const removeMember = (index: number) => {
    if (student.length > minTeamSize) {
      const newMembers = [...student];
      newMembers.splice(index, 1);
      setStudent(newMembers);
    } else {
      setError(`Team must have at least ${minTeamSize} student`);
    }
  };

  const updateMember = (index: number, field: keyof Student, value: string | File | null) => {
    const newMembers = [...student];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setStudent(newMembers);
  };

  const [showManageTeamBtn, setShowManageTeamBtn] = useState(true);

  const handleTeamBtn = () => {
    setShowManageTeamBtn((prev) => !prev);
  };
  const handleSaveTeam = () => {
    console.log("save function called");
    setTeamNameOnSave("New Fake Name");
  };
  const handleCancelTeam = () => {};
  const saveManageTeamBtn = (): boolean => {
    // use to check if the manage team and edit should be diable.
    // the buttons are disabled if the user is not the current team lead.
    return false;
  };
  return (
    <>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">{team.team_name}</h2>
        <p className="text-sm text-gray-500">University: {student[0].university}</p>
      </div>
      <Card className="mx-auto max-w-full [_&]: text-white my-4 pt-4">
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                {showManageTeamBtn ? (
                  <Button type="button" variant="outline" size="sm" onClick={handleTeamBtn} disabled={saveManageTeamBtn()}>
                    Manage Team
                  </Button>
                ) : (
                  <CancelSaveBtn onSave={handleSaveTeam} onCancel={handleCancelTeam} onToggleBtnDisplay={handleTeamBtn} />
                )}
              </div>

              {student.map((stu, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium flex flex-1 items-center">
                          {stu.full_name} {team.team_lead_email === stu.email && <Crown className="ml-2 text-yellow-500" size={18} />}
                        </h4>
                        {index !== 0 && student.length > minTeamSize && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Email</Label>
                          <Input id={`name-${index}`} value={stu.email} onChange={(e) => updateMember(index, "full_name", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>Major</Label>
                          <Input id={`major-${index}`} value={stu.email} onChange={(e) => updateMember(index, "major", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>TTG Email</Label>
                          <Input id={`major-${index}`} value={stu.ttg_email || ""} onChange={(e) => updateMember(index, "ttg_email", e.target.value)} required />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}
            {!showManageTeamBtn && <CancelSaveBtn onSave={handleSaveTeam} onCancel={handleCancelTeam} onToggleBtnDisplay={handleTeamBtn} />}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
