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
import { userInfo } from "os";

interface TeamMembersProp {
  userInfo: Student;
  studentsInfo: Student[];
  teamInfo: Team;
  setTeamNameOnSave: (new_team_name: string) => void; // used to update the teamName when the user saves
  disableButtons: boolean;
}
const minTeamSize = 3;
const maxTeamSize = 10;

export default function TeamMembers({ userInfo, studentsInfo, teamInfo, setTeamNameOnSave, disableButtons }: TeamMembersProp) {
  const [student, setStudent] = useState<Partial<Student>[]>(studentsInfo);

  // const [team, setTeam] = useState<Team>({
  //   team_id: "21623653532sdhsdh",
  //   team_name: "Team Alpha",
  //   team_lead_email: "jane@example.com",
  //   nda_file: "nda.pdf",
  //   completed_onboarding: "2023-01-01",
  //   project_id: "project123",
  //   supervisor_name: "Dr. Smith",
  //   supervisor_email: "dr.smith@example.com",
  // });
  const [error, setError] = useState<string | null>(null);

  const [currentStudentsInfo, setCurrentStudentsInfo] = useState<Student>(); // for changes made to students info

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
      setTimeout(() => {
        setError(null);
      }, 3000);
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
  function updateTeam(field: string, value: string): void {}

  return (
    <>
      <div className="mt-4">
        {showManageTeamBtn ? (
          <h2 className="text-xl font-semibold">{teamInfo.team_name}</h2>
        ) : (
          <Input
            className="max-w-40 text-wrap"
            style={{ width: `${(teamInfo.team_name || "").length + 2}ch` }}
            id={`team_name`}
            value={teamInfo.team_name}
            onChange={(e) => updateTeam("team_name", e.target.value)}
            required
          />
        )}
        <p className="text-gray-300 text-lg">University: {student[0].university}</p>
      </div>
      <Card className="mx-auto max-w-full [_&]: text-white my-4 pt-4">
        <CardContent>
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                {showManageTeamBtn ? (
                  <Button type="button" variant="outline" size="sm" onClick={handleTeamBtn} disabled={disableButtons}>
                    Manage Team
                  </Button>
                ) : (
                  <CancelSaveBtn onSave={handleSaveTeam} onCancel={handleCancelTeam} onToggleBtnDisplay={handleTeamBtn} />
                )}
              </div>
              {/* <div className="max-h-96 space-y-4 overflow-y-auto pr-4"> */}

              {student.map((stu, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        {showManageTeamBtn ? (
                          <h4 className="font-medium flex flex-1 items-center">
                            {stu.full_name} {teamInfo.team_lead_email === stu.email && <Crown className="ml-2 text-yellow-500" size={18} />}
                          </h4>
                        ) : (
                          <Input
                            className="max-w-40 text-wrap"
                            id={`full_name-${index}`}
                            value={stu.full_name}
                            onChange={(e) => updateMember(index, "full_name", e.target.value)}
                            required
                            style={{ width: `${(stu.full_name || "").length + 2}ch` }}
                          />
                        )}
                        {teamInfo.team_lead_email !== stu.email && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Email</Label>
                          <Input id={`email-${index}`} value={stu.email} onChange={(e) => updateMember(index, "email", e.target.value)} required disabled={showManageTeamBtn} />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>Major</Label>
                          <Input id={`major-${index}`} value={stu.email} onChange={(e) => updateMember(index, "major", e.target.value)} required disabled={showManageTeamBtn} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>TTG Email</Label>
                          <Input id={`major-${index}`} value={stu.ttg_email || ""} onChange={(e) => updateMember(index, "ttg_email", e.target.value)} required disabled={showManageTeamBtn} />
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
            {!showManageTeamBtn && (
              <div className="flex items-center justify-between w-full">
                <div className="w-1/3"></div>

                <div className="w-1/3">
                  <CancelSaveBtn onSave={handleSaveTeam} onCancel={handleCancelTeam} onToggleBtnDisplay={handleTeamBtn} />
                </div>
                <div className="flex justify-end w-1/3">
                  <Button type="button" variant="outline" size="sm" onClick={addMember} disabled={student.length >= maxTeamSize}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Member
                  </Button>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
}
