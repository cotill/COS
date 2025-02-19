"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Application, Project, Student } from "@/utils/types";
import { useRouter } from "next/router";

interface TeamMember {
  name: string;
  major: string;
  resume: File | null;
}

interface TeamMembersProp {}
const minTeamSize = 3;
const maxTeamSize = 10;
const ttgWebsite = "https://www.tartigrade.ca/";
export default function TeamMembers({}: TeamMembersProp) {
  const [members, setMembers] = useState<Student[]>([
    {
      email: "john@example.com",
      password: "password123",
      full_name: "John Doe",
      university: "University A",
      major: "CS",
      github: "https://github.com/johndoe",
      team_id: "team1",
      ttg_email: null,
      changed_password: false,
    },
    {
      email: "jane@example.com",
      password: "password123",
      full_name: "Jane Smith",
      university: "University B",
      major: "SE",
      github: "https://github.com/janesmith",
      team_id: "team1",
      ttg_email: null,
      changed_password: false,
    },
    {
      email: "mike@example.com",
      password: "password123",
      full_name: "Mike Ross",
      university: "University C",
      major: "IT",
      github: "https://github.com/mikeross",
      team_id: "team1",
      ttg_email: null,
      changed_password: false,
    },
  ]);

  const [supervisor, setSupervisor] = useState("");
  const [team, setTeam] = useState<Team[]>([
    {
      team_id: "21623653532sdhsdh",
      team_name: "Team Alpha",
      team_lead_email: "lead@example.com",
      nda_file: "nda.pdf",
      completed_onboarding: "2023-01-01",
      project_id: "project123",
      supervisor_name: "Dr. Smith",
      supervisor_email: "dr.smith@example.com",
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [teamDescription, setTeamDescription] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (file && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
      setTimeout(() => {
        setError(null);
      }, 3000);

      updateMember(index, "resume", null);
    } else {
      setError(null);
      updateMember(index, "resume", file);
    }
  };

  useEffect(() => {
    if (members.length < minTeamSize) {
      const newMembers = [...members];
      for (let i = members.length; i < minTeamSize; i++) {
        newMembers.push({ name: "", major: "", resume: null });
      }
      setMembers(newMembers);
    }
  }, []);

  const addMember = () => {
    if (members.length < maxTeamSize) {
      setMembers([...members, { name: "", major: "", resume: null }]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > minTeamSize) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    } else {
      setError(`Team must have at least ${minTeamSize} members`);
    }
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string | File | null) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  return (
    <>
      <div className="mb-8 text-center text-white">
        <Image src="/ttg-logo.png" alt="Tartigrade Limited" width={300} height={60} className="mx-auto mb-4" />
      </div>
      <Card className="mx-auto max-w-4xl [_&]: text-white">
        <CardContent>
          <form className="space-y-6">
            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                <Button type="button" variant="outline" size="sm" onClick={addMember} disabled={members.length >= maxTeamSize}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>

              {members.map((member, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{index === 0 ? "Team Manager" : `Team Member ${index}`}</h4>
                        {index !== 0 && members.length > minTeamSize && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Full Name</Label>
                          <Input id={`name-${index}`} value={member.name} onChange={(e) => updateMember(index, "name", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>Major</Label>
                          <Input id={`major-${index}`} value={member.major} onChange={(e) => updateMember(index, "major", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`resume-${index}`}>Resume</Label>
                          <Input
                            id={`resume-${index}`}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, index)}
                            className=" text-white file:border-0 file:bg-white file:text-black file:hover:bg-gray-100"
                            required
                          />
                          {member.resume && <p className="text-sm text-muted-foreground">{member.resume.name}</p>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Team Description */}
            <div className="space-y-2">
              <h4 className="text-white">Tell us about your team</h4>
              <Textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                placeholder="We are a group of students..."
                className="min-h-[7.5rem] border-gray-700 bg-[#1F2937] text-white"
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300 hover:border border-white">
              Submit Application
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
