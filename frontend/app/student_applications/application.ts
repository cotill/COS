"use client";
// Handles api calls related to the project - application
import { createClient } from "@/utils/supabase/client";
import {
  Application,
  Application_Status,
  Member,
  Project_Status,
} from "@/utils/types";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "@/utils/types";

const supabase = createClient();

/**
 *
 * @param projectId The project id to fetch applications for
 * @returns An array of applications or null if there are no applications
 */
export const fetchApplications = async (
  projectId: number
): Promise<Application[] | null> => {
  const { data, error } = await supabase
    .from("Applications")
    .select("*")
    .eq('"project_id"', projectId);
  if (error) throw new Error(`Error fetching applications: ${error.message}`);
  return data;
};

/**
 * This function updates the status of an application.
 * If the application is been APPROVED, then, the function will also update the approval_date column
 * @param applicationId The application id to update
 * @param status The new status of the application
 * @param team_name The name of the team. This is used for error messages
 */
export const updateApplicationStatus = async (
  applicationId: number,
  status: string,
  team_name: string | undefined
) => {
  let updateData: { status: string; approval_date?: string } = { status };

  if (status === Application_Status.APPROVED) {
    updateData.approval_date = new Date().toISOString(); // set approval_date to current date and time
  }

  const { error } = await supabase
    .from("Applications")
    .update(updateData)
    .eq("application_id", applicationId);
  if (error)
    throw new Error(
      `Error updating ${team_name} application status! Error was: ${error.message}`
    );
};

/**
 * This function is a bulk rejection
 * It will reject all applications for a project except the application id provided.
 */
export const rejectOtherApplications = async (
  application_id: number,
  project_id: number
) => {
  const { error } = await supabase
    .from("Applications")
    .update({ status: Application_Status.REJECTED })
    .eq("project_id", project_id)
    .neq("application_id", application_id);
  if (error)
    throw new Error(`Error rejecting other applications: ${error.message}`);
};

const createTeam = async (
  team_id: string,
  project_id: number,
  team_name: string,
  team_lead_email: string
) => {
  const { error } = await supabase
    .from("Teams")
    .insert({ team_id, project_id, team_name, team_lead_email });
  if (error)
    throw new Error(
      `Error creating team for team_name ${team_name}: ${error.message}`
    );
};

/**
 *
 * @param teamMembers The members of the team to create accounts for
 * @param projectId The project id of the team
 * @param uni The university of the team
 * @returns void but the function will create student accounts for the team members. If there is an error creating an account, the function will throw an error with all the error messages
 */
export async function createStudentAccounts(
  teamMembers: Member[],
  projectId: number,
  uni: string,
  team_name: string
) {
  let errorMessages: string[] = [];
  const teamId = uuidv4();
  // find team lead
  const team_lead =
    teamMembers.find((member) => member.role === "Team Manager") ||
    teamMembers[0];
  const team_lead_email = team_lead.email;

  // next create the team
  await createTeam(teamId, projectId, team_name, team_lead_email);

  // Helper function to create a student account
  async function createStudent(member: Member) {
    const payload = {
      email: member.email,
      user_metadata: {
        team_id: teamId,
        user_role: UserRole.STUDENT,
        university: uni,
        full_name: member.full_name,
        major: member.major,
      },
    };

    try {
      const response = await fetch("/student_applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(`Error creating user ${member.email}: ${result.error}`);
      }
    } catch (err) {
      throw new Error(
        `Error creating user ${member.email}: ${(err as Error).message}`
      );
    }
  }

  await Promise.all(
    teamMembers.map(async (member) => {
      try {
        console.log(member);
        await createStudent(member);
      } catch (err: any) {
        errorMessages.push(err?.message);
      }
    })
  );

  if (errorMessages.length > 0) {
    throw new Error(errorMessages.join("\n"));
  }
}

/**
 *
 * @param application_id The application id to delete
 */
export async function deleteApplication(application_id: number) {
  const { data, error } = await supabase
    .from("Applications")
    .delete()
    .eq("application_id", application_id)
    .select();
  if (error) throw new Error(`Error deleting application: ${error?.message}`);

  const deletedApplicationData = data[0] as Application;
  deleteResume(deletedApplicationData);
}

/**
 * Delete all applications except for the application which has been approved.
 * The resumes for each application will then be deleted asynchronous in parallel
 * @param project_id the project_id for the applications to be deleted
 */
export const deleteAllApps = async (project_id: number) => {
  const { data: deletedApps, error } = await supabase
    .from("Applications")
    .delete()
    .eq("project_id", project_id)
    .neq("status", Application_Status.APPROVED)
    .select();
  if (error) throw new Error(`delete application error: ${error?.message}`);

  const appsToDelete = deletedApps as Application[]; // cast to Application[]
  const deleteResumePromises: Promise<void>[] = appsToDelete.map((app) =>
    deleteResume(app)
  ); // map the deleteResume function to each application

  try {
    // promise all performs the operations in parallel -> ALl or Nothing - if 1 fail all fails
    await Promise.all(deleteResumePromises);
  } catch (error: any) {
    throw new Error(`${error?.message}`);
  }
};

/**
 * Deletes the resumes of the deleted application
 * @param deletedApplicationData An object represent the deleted application.
 */
//delete application resumes
const deleteResume = async (deletedApplicationData: Application) => {
  let resume_urls: string[] = [];
  deletedApplicationData.members.map((member) => {
    resume_urls.push(member.resume);
  });

  //check if there were any resumes urls
  if (resume_urls.length === 0) return;

  // delete resumes
  const { data: deleteResume_data, error: deletedResume_error } =
    await supabase.storage.from("applicants_resumes").remove(resume_urls);
  if (deleteResume_data === null || deletedResume_error)
    throw new Error(
      `Error deleting applicant's resume: ${deletedResume_error.message}`
    );
};

/**
 *
 * @param employeeLevel The level of the employee
 * @param requiredLevel The level required to perform the action
 * @returns
 */
export function confirmEmployeeAuthorization(
  employeeLevel: number,
  requiredLevel: number
): boolean {
  if (employeeLevel < requiredLevel) {
    return false;
  }
  return true;
}

export const updateProjectStatus = async (
  project_id: number,
  status: string,
  application_id: number
) => {
  const supabase = createClient();
  let error;
  if (status === Project_Status.AWARDED) {
    // close the project to prevent further applications
    const { data, error: err } = await supabase
      .from("Projects")
      .update({
        status: status,
        applications_allowed: false,
        awarded_application_id: application_id,
      })
      .eq('"project_id"', project_id)
      .select();
    error = err;
  } else {
    const { data, error: err } = await supabase
      .from("Projects")
      .update({ status })
      .eq('"project_id"', project_id)
      .select();
    error = err;
  }
  if (error)
    throw new Error(
      `Error updating project with project id ${project_id} application status! please contact system admin`
    );
};
