"use client";
import { createClient } from "@/utils/supabase/client";
import { Project, Project_Status } from "@/utils/types";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient();
export const ProjectStatusOrder: Project_Status[] = [
  Project_Status.DRAFT,
  Project_Status.REVIEW,
  Project_Status.REJECTED,
  Project_Status.APPROVED,
  Project_Status.DISPATCHED,
  Project_Status.AWARDED,
  Project_Status.ACTIVE,
  Project_Status.COMPLETED,
  Project_Status.CANCELLED,
];

/**
 * Compare the original Project info to the current and stores
 * @param originalProjectInfo Original Project Info that was retrieved from the database or the data after save button was pressed
 * @param currentProjectInfo  The modified Project info
 * @returns A partial Project object
 */
export const getChangedData = (originalProjectInfo: Project, currentProjectInfo: Project, user_email: string, user_level: number): Partial<Project> => {
  const changedData: Partial<Project> = {};
  Object.keys(originalProjectInfo).forEach((key) => {
    if (originalProjectInfo[key as keyof Project] !== currentProjectInfo[key as keyof Project]) {
      if (currentProjectInfo[key as keyof Project] === Project_Status.APPROVED) {
        // if the current status is approved the check
        checkApproverInfo(originalProjectInfo.creator_email, user_email, user_level);

        // check that the current status is less than original
        const applicationLinkAction: "create" | "delete" | "keep" = updateApplicationLink(originalProjectInfo.status, originalProjectInfo.application_link, currentProjectInfo.status);
        if (applicationLinkAction === "create") {
          changedData.application_link = uuidv4();
          console.log(`application_link was created -value: ${changedData.application_link}`);
        } else if (applicationLinkAction === "delete") {
          changedData.application_link = null;
          console.log(`application_link was 'deleted'-value: ${changedData.application_link}`);
        }
      }
      const value = currentProjectInfo[key as keyof Project];
      (changedData as any)[key as keyof Project] = value;
      console.log(`Key: ${key} was modified to value: ${value}`);
    }
  });

  return changedData;
};

export const onUpdateProject = async (updatedProject: Partial<Project>, project_id: number) => {
  console.log(`updataData modified user is ... ${updatedProject.last_modified_user}`);
  const { data, error } = await supabase
    .from("Projects")
    .update({ ...updatedProject })
    .eq("project_id", project_id);
  if (error) {
    throw new Error(`Error updating project info: ${error?.message}`);
  }
};

/**
 * This method compares the original status to the current status, and based on the business logic
 * either generates a create, delete, or keep the existing link.
 * @param originalStatus the original status of the project prior to user changes
 * @param currentStatus the new status the user is attempting to change the project to
 * @returns create, delete, or keep the link.
 */
export const updateApplicationLink = (originalStatus: Project_Status, originalApplicationLink: string | null, currentStatus: Project_Status): "create" | "delete" | "keep" => {
  const originalStatusIndex = ProjectStatusOrder.indexOf(originalStatus);
  const currentStatusIndex = ProjectStatusOrder.indexOf(currentStatus);
  console.log(`The original status is: ${originalStatusIndex} and ${currentStatusIndex}`);
  // if original status is less than current status,and the current status is approved generate a new link
  if (currentStatus == Project_Status.APPROVED && originalStatusIndex < currentStatusIndex) {
    return "create";
  }

  // If current status is APPROVED and the original status is greater than APPROVED, don't generate a new link
  // basically if the user is trying to move the status back to approved, don't create a new link
  if (currentStatus === Project_Status.APPROVED && originalStatusIndex > currentStatusIndex) {
    if (originalApplicationLink !== null) {
      return "keep";
    }
    // if there's not existing link, create one
    return "create";
  }

  // If the current status is less than the original status, delete the link
  // if the original status is approved(or higher) and the user moves it back to delete, review, draft or new. Then delete the original link
  if (originalStatus >= Project_Status.APPROVED && currentStatusIndex < originalStatusIndex) {
    return "delete";
  }

  // Default to existing if none of the above conditions are met
  return "keep";
};

/**
 *
 * Only people that can edit the project is the creator, and users level 2+
 */
export const canUserEditProject = (user_email: string, user_level: number, creator_email: string): boolean => {
  if (user_email === creator_email) return true;
  if (user_level >= 2) return true;
  return false;
};

/**
 *
 * the user level is too low to approve, or the the level is not a problem but the user is try to approve their own project
 */
const checkApproverInfo = (creator_email: string, user_email: string, user_level: number) => {
  if (user_level < 2 || user_email === creator_email) return false;
  return true;
};
