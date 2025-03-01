"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MinusCircle, Crown } from "lucide-react";
import { Student, Team } from "@/utils/types";
import { handleCreateStudentAccounts, modifiedStudents, loadTeamData, handleUpdateStudentInformation } from "./teamMemberHelper";
import dynamic from "next/dynamic";
import { ConfirmationDialog, ConfirmationDialogProp } from "@/components/confirmationPopup";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { handleDeleteStudentAccounts } from "@/app/Student/Team/teamAction";
import useNotifications from "@/hooks/notification/useNotifications"; // import the notification hook
import { RoundSpinner } from "@/components/ui/spinner";

const CustomNotification = dynamic(() => import("../../../hooks/notification/custom-notification"), { ssr: false });
const CancelSaveBtn = dynamic(() => import("./cancel-save-btn"), { ssr: false });

interface TeamMembersProp {
  userInfo: Student;
  originalTeamInfo: Partial<Team>;
  setTeamNameOnSave: (new_team_name: string) => Promise<{ type: "success" | "error"; text: JSX.Element[] }>; // used to update the teamName when the user saves
  teamName: string; //pass down the current team name
  disableButtons: boolean;
}
const minTeamSize = 3;
const maxTeamSize = 10;

export default function TeamMembers({ userInfo, originalTeamInfo, setTeamNameOnSave, teamName, disableButtons }: TeamMembersProp) {
  //loading state
  const [initialLoading, setInitialLoading] = useState<boolean>(true);

  //Data states
  const [students, setStudents] = useState<Partial<Student>[]>([]);
  const [initialStudents, setInitialStudents] = useState<Partial<Student>[]>([]); // Stores the original data
  const [newStudents, setNewStudents] = useState<Partial<Student>[]>([]); // tracks new students
  const [deleteStudents, setDeleteStudents] = useState<Partial<Student>[]>([]); // tracks deleted students
  const [localTeamName, setLocalTeamName] = useState<string>(teamName);

  // UI states
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentOperation, setCurrentOperation] = useState<"none" | "save" | "delete" | "create">("none"); //state to track which operation is in progress (save, delete, create)

  //Dialog states
  const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false);
  const [alertDialogProps, setAlertDialogProps] = useState<ConfirmationDialogProp | null>(null);

  /* Computed properties */
  // Disable delete buttons if new students have been added
  const deleteButtonDisabled = newStudents.length > 0;
  // Disable add student button if any students have been marked for deletion
  const addButtonDisabled = deleteStudents.length > 0 || students.length >= maxTeamSize;

  // notification hook
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useNotifications();

  // Initial data loading
  const fetchStudents = async () => {
    try {
      const updatedStudents = await loadTeamData(originalTeamInfo.team_id!);
      setStudents(updatedStudents);
      setInitialStudents(updatedStudents); //Store a copy of the original data
    } catch (error) {
      console.error("Error fetching team data:", error);
      addNotification("error", "Failed to load team data");
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setInitialLoading(true);
      await fetchStudents();
      setInitialLoading(false);
    };

    loadInitialData();
  }, []);

  const hasChanges = () => {
    return JSON.stringify(initialStudents) !== JSON.stringify(students) || newStudents.length > 0 || deleteStudents.length > 0 || teamName !== localTeamName;
  };

  // State reset functions
  const resetAllStates = async () => {
    await fetchStudents();
    setDeleteStudents([]);
    setNewStudents([]);
    setLocalTeamName(teamName);
    setIsEditing(false);
    setIsSaving(false);
    setCurrentOperation("none");
  };

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
      addNotification("warning", "You will have deleted everyone on the team except yourself");
    }
    // removed student
    const studentToRemove = students[index];

    // Check if student is newly created
    const isNewStudent: boolean = newStudents.some((stu) => stu.student_id === studentToRemove.student_id);

    // Only add to deleteStudents if it's not a new student
    if (!isNewStudent) {
      setDeleteStudents((prev) => [...prev, studentToRemove]);
    }

    //if the student was a newly created student, remove from newStudents
    setNewStudents((prevStudent) => prevStudent.filter((stu, i) => studentToRemove.student_id !== stu.student_id));

    // remove from students array
    setStudents((prevStudents) => prevStudents.filter((stu, i) => stu.student_id !== studentToRemove.student_id));
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

  /**
   * Handles when the save button is clicked
   * @param e
   * @returns
   */
  const startSaveProcess = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasChanges() && teamName === localTeamName) {
      addNotification("error", "No changes were made.");
      return;
    }
    setIsSaving(true);
    setCurrentOperation("save");

    // process operations in sequence
    await processTeamNameChange();
    await processStudentUpdates();

    // Handle new and deleted students last as they require confirmations
    if (newStudents.length > 0) {
      openCreateStudentsDialog();
    } else if (deleteStudents.length > 0) {
      openDeleteStudentsDialog();
    } else {
      // If no confirmations needed, complete the save process
      completeSaveProcess();
    }
  };

  const processTeamNameChange = async () => {
    if (teamName === localTeamName) return;
    //Team name changed
    const result = await setTeamNameOnSave(localTeamName); // update the heading bar
    addNotification(result.type, result.text);
  };

  const processStudentUpdates = async () => {
    const allModifiedStudents = modifiedStudents(initialStudents, students, newStudents, deleteStudents);
    // console.log("All modified students is ", allModifiedStudents);

    if (allModifiedStudents.length === 0) return;

    // If we have modified students, update them in the database
    try {
      const updateResults = await handleUpdateStudentInformation(allModifiedStudents);

      if (updateResults.type === "error") {
        await resetAllStates();
      }
      addNotification(updateResults.type as "error" | "warning" | "success" | "partial-success", updateResults.text);
    } catch (error) {
      console.error("Error updating students:", error);
      addNotification("error", "An error occurred while updating student information.");
      await resetAllStates();
    }
  };

  /**
   * After save is clicked, if the user is attempting to add a new student, open a confirmation popup
   */
  const openCreateStudentsDialog = () => {
    setCurrentOperation("create");
    setAlertDialogProps({
      title: "Create New Student(s)",
      description: "Create new students will create accounts for the new students. Do you want to proceed?",
      confirmationLabel: "Confirm",
      onConfirm: processCreateStudents,
      onCancel: () => {
        setAlertDialogOpen(false);
        completeSaveProcess();
      },
    });
    setAlertDialogOpen(true);
  };

  /**
   * After save is clicked if the user is attempting to delete a student, open confirmations
   */
  const openDeleteStudentsDialog = () => {
    setCurrentOperation("delete");
    setAlertDialogProps({
      title: "Delete Student(s)",
      description: "Deleting will remove the student(s) from the team and delete their account(s). Do you want to proceed?",
      confirmationLabel: "Delete",
      onConfirm: processDeleteStudents,
      onCancel: () => {
        setAlertDialogOpen(false);
        completeSaveProcess();
      },
    });
    setAlertDialogOpen(true);
  };
  /**
   * After the user confirms they want to create the new accounts
   */
  const processCreateStudents = async () => {
    setAlertDialogOpen(false);
    const res = await handleCreateStudentAccounts(newStudents, originalTeamInfo.team_id!, userInfo.university);
    // const res = { type: "error", text: "your mom" };
    if (res.type === "success") {
      // reset the  newStudents array
      setNewStudents([]);

      // set the notification
      addNotification("success", res.text);
    } else if (res.type === "partial-success") {
      addNotification(res.type, res.text);
      setNewStudents([]); // reset
    } else {
      // All accounts failed to be created revert back to
      addNotification("error", res.text);
      await resetAllStates();
    }
    await fetchStudents();

    //if there is delete operations pending, show the dialog next
    if (deleteStudents.length > 0) {
      openDeleteStudentsDialog();
    } else {
      completeSaveProcess();
    }
  };

  /**
   * After the user confirms they want to delete accounts
   */
  const processDeleteStudents = async () => {
    setAlertDialogOpen(false);
    // console.log(`delete Students array length is ${deleteStudents.length}`);
    const res = await handleDeleteStudentAccounts(deleteStudents);
    let message: JSX.Element[] = [];
    let successCount = 0;
    let errorCount = 0;
    // console.log(`Result from handleDeleteStudentsAccounts was of length ${res.length}`);
    res.forEach((result, index) => {
      if (result.status === "fulfilled") {
        message.push(<div key={index}>Student {deleteStudents[index].full_name} deletion successful</div>);
        successCount++;
      } else {
        message.push(
          <div key={index}>
            Student {deleteStudents[index].full_name} deletion failed: {(result.reason as Error).message}
          </div>
        );
        errorCount++;
      }
    });
    let notificationType: "success" | "error" | "partial-success";

    if (successCount === res.length) {
      notificationType = "success";
      setDeleteStudents([]);
    } else if (errorCount === res.length) {
      notificationType = "error";
      await resetAllStates();
    } else {
      notificationType = "partial-success";
      // Keep only the students whose deletion failed in the deleteStudents array
      const failedDeletions = deleteStudents.filter((_, index) => res[index].status !== "fulfilled");

      setDeleteStudents(failedDeletions); // Add the failed deletions back to the students array
    }

    // set the notification
    addNotification(notificationType, message);
    await fetchStudents();

    completeSaveProcess();
  };
  const completeSaveProcess = () => {
    setCurrentOperation("none");
    setIsSaving(false);
    setIsEditing(false);
  };

  if (initialLoading) {
    return (
      <div className="w-full justify-items-center my-2">
        <RoundSpinner size="md" color="white" />
      </div>
    );
  }
  return (
    <form onSubmit={startSaveProcess}>
      <div className="mt-4">
        {!isEditing ? (
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
                {!isEditing ? (
                  <Button type="button" variant="outline" size="sm" onClick={() => setIsEditing(true)} disabled={disableButtons}>
                    Manage Team
                  </Button>
                ) : (
                  <CancelSaveBtn onCancel={resetAllStates} onToggleBtnDisplay={() => setIsEditing(false)} isSaving={isSaving} />
                )}
              </div>
              {/* <div className="max-h-96 space-y-4 overflow-y-auto pr-4"> */}

              {students.map((stu, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        {!isEditing ? (
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
                        {isEditing && originalTeamInfo.team_lead_email !== stu.email && (
                          // disable the button is new student is clicked and the student is not a newStudent in the process of being created
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMember(index)}
                            disabled={deleteButtonDisabled && !newStudents.some((student) => student.student_id === stu.student_id)}
                          >
                            <MinusCircle className={`h-4 w-4 ${deleteButtonDisabled && !newStudents.some((student) => student.student_id === stu.student_id) ? "text-gray-500" : ""}`} />
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
                          <Input id={`major-${index}`} value={stu.major} onChange={(e) => updateMember(index, "major", e.target.value)} required disabled={!isEditing} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>TTG Email</Label>
                          <Input id={`ttg_email-${index}`} value={stu.ttg_email || ""} onChange={(e) => updateMember(index, "ttg_email", e.target.value)} disabled={true} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {isEditing && (
              <div className="flex items-center justify-between w-full">
                <div className="w-1/3"></div>

                <div className="w-1/3">
                  <CancelSaveBtn onCancel={resetAllStates} onToggleBtnDisplay={() => setIsEditing(false)} isSaving={isSaving} />
                </div>
                <div className="flex justify-end w-1/3">
                  <Button type="button" variant="outline" size="sm" onClick={addMember} disabled={addButtonDisabled}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </div>
            )}
            {notifications.length > 0 && (
              <>
                {notifications.map((notification) => (
                  <CustomNotification key={notification.id} notification={notification} close={() => removeNotification(notification.id)} />
                ))}
              </>
            )}
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
