"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Crown } from "lucide-react";
import { Student, Team } from "@/utils/types";
import CancelSaveBtn from "./cancel-save-btn";
import { handleCreateStudentAccounts, validateStudents } from "./teamMemberHelper";
import dynamic from "next/dynamic";
import { ConfirmationDialog, ConfirmationDialogProp } from "@/components/confirmationPopup";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { createStudent } from "@/app/student_applications/application";

interface TeamMembersProp {
  userInfo: Student;
  originalStudentsInfo: Student[];
  originalTeamInfo: Team;
  setTeamNameOnSave: (new_team_name: string) => void; // used to update the teamName when the user saves
  teamName: string; //pass down the current team name
  disableButtons: boolean;
}
const minTeamSize = 3;
const maxTeamSize = 10;
const timeLength = 2000;

const CustomNotification = dynamic(() => import("../custom-notification"), { ssr: false });
export default function TeamMembers({ userInfo, originalStudentsInfo, originalTeamInfo, setTeamNameOnSave, teamName, disableButtons }: TeamMembersProp) {
  const [students, setStudents] = useState<Partial<Student>[]>(originalStudentsInfo);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const [notification, setNotification] = useState<{ type: "error" | "warning" | "success"; text: string | JSX.Element[] } | null>(null);

  const [newStudents, setNewStudents] = useState<Partial<Student>[]>([]); // tracks new students
  const [deleteStudents, setDeleteStudents] = useState<Partial<Student>[]>([]); // tracks deleted students
  const [localTeamName, setLocalTeamName] = useState<string>(teamName);
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogProps, setAlertDialogProps] = useState<ConfirmationDialogProp | null>(null);

  const addMember = () => {
    if (students.length < maxTeamSize) {
      const newStudent: Partial<Student> = {
        full_name: "",
        major: "",
        email: "",
        student_id: `temp-${Date.now()}`, // Temporary unique ID
        team_id: originalTeamInfo.team_id,
        university: "",
        github: "",
        changed_password: false,
        ttg_email: null,
      };
      setStudents([...students, newStudent]);
      setNewStudents((prevNewStudents) => [...prevNewStudents, newStudent]);
    }
  };

  const removeMember = (index: number) => {
    if (students.length - 1 === 1) {
      // they are deleting everyone except the team lead
      setNotification({ type: "warning", text: "You are have deleted everyone on the team except yourself" });
      setTimeout(() => {
        setNotification(null);
      }, timeLength);
    }
    // removed student
    const student_to_remove = students[index];

    //Todo: add to removeStudents array
    setDeleteStudents((prevStuents) => [...prevStuents, student_to_remove]);

    // remove from students
    setStudents((prevStudents) => prevStudents.filter((stu, i) => stu.student_id !== student_to_remove.student_id));

    //Todo: if the student was a newly created student, remove from newStudents
    setNewStudents((prevStudent) => prevStudent.filter((stu, i) => student_to_remove.student_id !== stu.student_id));
  };

  const updateMember = (index: number, field: keyof Student, value: string | null) => {
    const tempStudents = [...students];
    tempStudents[index] = { ...tempStudents[index], [field]: value }; // update the data
    setStudents(tempStudents); // set the students array to the tempStudent

    const studentUpdated = tempStudents[index]; // get the updated student
    const updatedNewStudents = newStudents.map((stu) => (stu.student_id === studentUpdated.student_id ? studentUpdated : stu)); // check if the updated student was a newly created student. If so assign the updated data

    if (JSON.stringify(updatedNewStudents) !== JSON.stringify(newStudents)) {
      // if the two arrays don't match update the students array with the new dataset
      setNewStudents(updatedNewStudents);
    }
  };

  const [showManageTeamBtn, setShowManageTeamBtn] = useState(true);

  const handleTeamBtn = () => {
    setShowManageTeamBtn((prev) => !prev);
  };

  const has_studentDetailsChanges = () => {
    return JSON.stringify(originalStudentsInfo) !== JSON.stringify(students) || newStudents.length > 0 || deleteStudents.length > 0;
  };

  const handleCreateNewStudents = async () => {
    setAlertDialogProps({
      title: "Create New Student(s)",
      description: "Create new students will create accounts for the new students. Do you want to proceed?",
      confirmationLabel: "Confirm",
      onConfirm: async () => {
        setAlertDialogOpen(false);
        const res = await handleCreateStudentAccounts(newStudents, originalTeamInfo.team_id, userInfo.university);
        // const res = { type: "error", text: "your mom" };
        if (res.type === "success") {
          // reset the DeleteStudents and newStudents array
          setDeleteStudents([]);
          setNewStudents([]);
          // set the notification
          setNotification({ type: "success", text: res.text });
          setTimeout(() => setNotification(null), 10000); // set timeout to 10 seconds
        } else {
          // else there was a failure, revert back to
          setNotification({ type: "error", text: "An error occurred while saving changes." });
          handleCancelTeam();
          setTimeout(() => setNotification(null), 5000);
        }
      },
      onCancel: () => {
        setAlertDialogOpen(false);
      },
    });
    setAlertDialogOpen(true);
  };

  const handleSaveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    if (!has_studentDetailsChanges() && teamName === localTeamName) {
      setNotification({ type: "error", text: "No changes were made." });
      setTimeout(() => {
        setIsSaving(false);
        setNotification(null);
        handleTeamBtn();
      }, 1000);
      return;
    }

    // setTimeout(() => {
    //   setIsSaving(false);
    //   handleTeamBtn();
    // }, timeLength);

    // todo: check if the teamName changes, if so we need to update the headingBar on save

    //else changes were made so save changes and update data.

    if (teamName !== localTeamName) {
      //Team name changed
      setTeamNameOnSave(localTeamName); // update the heading bar
    }

    // handle changes to the students
    if (newStudents.length > 0) {
      console.log(`New members are: ${JSON.stringify(newStudents)}`);

      await handleCreateNewStudents();
    }
    if (deleteStudents.length > 0) {
      // handle delete students
      console.log(`delete students array is: ${JSON.stringify(deleteStudents)}`);
    }
    console.log(`Students are: ${JSON.stringify(students)}`);
    setIsSaving(false);
    handleTeamBtn(); // toggle the manage Team button is now display instead of the cancel save buttons displaying
  };
  const handleCancelTeam = () => {
    // reset everything back to original state
    setStudents([...originalStudentsInfo]);
    setDeleteStudents([]);
    setNewStudents([]);
    setLocalTeamName(teamName); // reset team name
  };

  return (
    <form onSubmit={handleSaveTeam}>
      <div className="mt-4">
        {showManageTeamBtn ? (
          <h2 className="text-xl font-semibold">{localTeamName}</h2>
        ) : (
          <Input
            className="max-w-md text-wrap px-2"
            style={{ width: `${localTeamName ? localTeamName.length + 2 : 10}ch` }}
            id={`team_name`}
            value={localTeamName}
            onChange={(e) => {
              setLocalTeamName(e.target.value);
            }}
            required
          />
        )}
        <p className="text-gray-300 text-lg">University: {userInfo.university}</p>
      </div>
      <Card className="mx-auto max-w-full [_&]: text-white my-4 pt-4">
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                {showManageTeamBtn ? (
                  <Button type="button" variant="outline" size="sm" onClick={handleTeamBtn} disabled={disableButtons}>
                    Manage Team
                  </Button>
                ) : (
                  <CancelSaveBtn onCancel={handleCancelTeam} onToggleBtnDisplay={handleTeamBtn} isSaving={isSaving} />
                )}
              </div>
              {/* <div className="max-h-96 space-y-4 overflow-y-auto pr-4"> */}

              {students.map((stu, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        {showManageTeamBtn ? (
                          <h4 className="font-medium flex flex-1 items-center">
                            {stu.full_name}
                            {originalTeamInfo.team_lead_email === stu.email && <Crown className="ml-2 text-yellow-500" size={18} />}
                          </h4>
                        ) : (
                          <div className="flex items-center">
                            <Input
                              className="max-w-40 text-wrap px-2"
                              id={`full_name-${index}`}
                              value={stu.full_name}
                              onChange={(e) => updateMember(index, "full_name", e.target.value)}
                              required
                              style={{ width: `${stu.full_name ? stu.full_name.length + 2 : 10}ch` }}
                              placeholder="Full Name"
                            />
                            {originalTeamInfo.team_lead_email === stu.email && <Crown className="ml-2 text-yellow-500" size={18} />}
                          </div>
                        )}
                        {showManageTeamBtn === false && originalTeamInfo.team_lead_email !== stu.email && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Email</Label>
                          <Input
                            id={`email-${index}`}
                            value={stu.email}
                            onChange={(e) => updateMember(index, "email", e.target.value)}
                            required
                            disabled={!newStudents.some((student) => student.student_id === stu.student_id)} // if the student is not a newly created student,disable this input field
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>Major</Label>
                          <Input id={`major-${index}`} value={stu.major} onChange={(e) => updateMember(index, "major", e.target.value)} required disabled={showManageTeamBtn} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>TTG Email</Label>
                          <Input
                            id={`ttg_email-${index}`}
                            value={stu.ttg_email || ""}
                            onChange={(e) => updateMember(index, "ttg_email", e.target.value)}
                            disabled={
                              showManageTeamBtn ||
                              (students.some((student) => student.ttg_email === stu.ttg_email && stu.ttg_email !== null) && !newStudents.some((student) => student.student_id === stu.student_id))
                            } // disable if showManageTeamBtn is true or if the original student data contains a ttg email and if the student is not a new student
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {!showManageTeamBtn && (
              <div className="flex items-center justify-between w-full">
                <div className="w-1/3"></div>

                <div className="w-1/3">
                  <CancelSaveBtn onCancel={handleCancelTeam} onToggleBtnDisplay={handleTeamBtn} isSaving={isSaving} />
                </div>
                <div className="flex justify-end w-1/3">
                  <Button type="button" variant="outline" size="sm" onClick={addMember} disabled={students.length >= maxTeamSize}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </div>
            )}
            {notification && <CustomNotification notification={notification} />}
          </div>
        </CardContent>
      </Card>
      {/* Alert Dialog will display when the user clicks the save button and will ask them to confirm if they want to confirm their deletion or creation of student accounts */}
      <AlertDialog open={alertDialogOpen} onOpenChange={() => setAlertDialogOpen(false)}>
        {alertDialogProps && <ConfirmationDialog {...alertDialogProps} />}
      </AlertDialog>
    </form>
  );
}
