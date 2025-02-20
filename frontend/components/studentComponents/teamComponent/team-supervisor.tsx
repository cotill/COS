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

interface TeamMember {
  name: string;
  major: string;
  resume: File | null;
}

interface TeamSupervisorProp {}

export default function TeamSupervisor({}: TeamSupervisorProp) {
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
  const [supervisor, setSupervisor] = useState({ supervisor_name: team.supervisor_name, supervisor_email: team.supervisor_email });

  const updateSupervisor = (index: number, field: keyof TeamMember, value: string | File | null) => {
    // const newMembers = [...student];
    // newMembers[index] = { ...newMembers[index], [field]: value };
    // setStudent(newMembers);
  };

  return (
    <>
      <Card className="mx-auto max-w-full [_&]: text-white my-4 pt-4">
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                <Button type="button" variant="outline" size="sm" onClick={() => updateSupervisor(0, "name", "")}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-2">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`supervisor_name`}>Full Name</Label>
                        <Input id={`supervisor_name`} value={supervisor.supervisor_name || ""} required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`supervisor_email`}>Email</Label>
                        <Input id={`supervisor_email`} value={supervisor.supervisor_email || ""} required />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}
            <CancelSaveBtn />
          </form>
        </CardContent>
      </Card>
    </>
  );
}
