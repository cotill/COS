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
import { createClient } from "@/utils/supabase/client";
import useNotifcations from "@/hooks/notification/useNotifications";
import dynamic from "next/dynamic";

const CustomNotification = dynamic(() => import("../custom-notification"), { ssr: false });

interface TeamSupervisorProp {
  disableButtons: boolean;
  originalTeamInfo: Partial<Team>;
  fetchTeam: () => Promise<void>;
  handleUpdateTeam: (team: Partial<Team>) => Promise<{ status: string; reason?: string; value?: any }>;
}

export default function TeamSupervisor({ disableButtons, originalTeamInfo, fetchTeam, handleUpdateTeam }: TeamSupervisorProp) {
  const [initialTeam, setInitialTeam] = useState<Partial<Team>>(originalTeamInfo);
  const [team, setTeam] = useState<Partial<Team>>(originalTeamInfo);
  // const [supervisor, setSupervisor] = useState({ supervisor_name: team.supervisor_name, supervisor_email: team.supervisor_email });
  const { notifications, addNotification, removeNotification } = useNotifcations();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const updateSupervisor = async (field: keyof Team, value: string) => {
    // const newMembers = [...student];
    // newMembers[index] = { ...newMembers[index], [field]: value };
    // setStudent(newMembers);
    setTeam((prev) => ({ ...prev, [field]: value }));
  };

  const [showEditBtn, setShowEditBtn] = useState(true);
  const handleEditBtn = () => {
    setShowEditBtn((prev) => !prev);
  };

  const handleSaveSupervisor = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    if (JSON.stringify(initialTeam) === JSON.stringify(team)) {
      addNotification("error", "No changes were made.");
      setIsSaving(false);
      handleEditBtn();
      return;
    } else {
      let message: JSX.Element[] = [];
      try {
        const result = await handleUpdateTeam(team);
        if (result.status === "fulfilled") {
          message = [<p className="text-green-600 font-bold">Team Supervisor updated successfully.</p>];
          addNotification("success", message);
        } else {
          message = [<p className="text-red-600 font-bold">{String(result.reason)}</p>];
          addNotification("error", message);
        }
      } catch (error) {
        console.error("Error updating team name:", error);
        message = [<p className="text-red-600 font-bold">Failed to update team supervisor . Please try again.</p>];
        addNotification("error", message);
      } finally {
        await fetchTeam();
      }
    }
    setIsSaving(false);
    handleEditBtn();
  };
  const handleCancelSupervisor = () => {};
  return (
    <>
      <Card className="mx-auto max-w-full [_&]: text-white my-4 pt-4">
        <CardContent>
          <form className="space-y-6" onSubmit={handleSaveSupervisor}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Supervisor</h3>
                {showEditBtn && (
                  <Button className="w-20" type="button" variant="outline" size="sm" onClick={handleEditBtn} disabled={disableButtons}>
                    Edit
                  </Button>
                )}
              </div>

              <Card>
                <CardContent className="pt-6">
                  <div className="grid gap-2">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor={`supervisor_name`}>Full Name</Label>
                        <Input id={`supervisor_name`} value={team.supervisor_name || ""} required disabled={showEditBtn} onChange={(e) => updateSupervisor("supervisor_name", e.target.value)} />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`supervisor_email`}>Email</Label>
                        <Input id={`supervisor_email`} value={team.supervisor_email || ""} required disabled={showEditBtn} onChange={(e) => updateSupervisor("supervisor_email", e.target.value)} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {!showEditBtn && <CancelSaveBtn onCancel={handleCancelSupervisor} onToggleBtnDisplay={handleEditBtn} isSaving={isSaving} />}
            {notifications.length > 0 && (
              <>
                {notifications.map((notification) => (
                  <CustomNotification key={notification.id} notification={notification} close={() => removeNotification(notification.id)} />
                ))}
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </>
  );
}
