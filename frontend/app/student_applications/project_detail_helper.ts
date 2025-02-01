'use client'
import { createClient } from "@/utils/supabase/client";
import { Project, Project_Status } from '@/utils/types'

const supabase = createClient();
export const ProjectStatusOrder : Project_Status[] = [
    Project_Status.DRAFT,
    Project_Status.REVIEW,
    Project_Status.REJECTED,
    Project_Status.APPROVED,
    Project_Status.DISPATCHED,
    Project_Status.AWARDED,
    Project_Status.ACTIVE,
    Project_Status.COMPLETED,
    Project_Status.CANCELLED
]

/**
 * Compare the original Project info to the current and stores
 * @param originalProjectInfo Original Project Info that was retrieved from the database or the data after save button was pressed
 * @param currentProjectInfo  The modified Project info 
 * @returns A partial Project object 
 */
export const getChangedData = (originalProjectInfo: Project, currentProjectInfo : Project): Partial<Project> => {
    const changedData: Partial<Project> = {};
    Object.keys(originalProjectInfo).forEach(key => {
        if (originalProjectInfo[key as keyof Project] !== currentProjectInfo[key as keyof Project]) {
            const value = currentProjectInfo[key as keyof Project];
            (changedData as any)[key as keyof Project] = value;
            console.log(`Key: ${key} was modified to value: ${value}`)
        }
    });

    return changedData;
}


export const onUpdateProject = async(updatedProject: Partial<Project>, project_id: number) => {
    const {data, error} = await supabase.from("Projects").update({...updatedProject}).eq("project_id", project_id);
    if(error){
        throw new Error(`Error updating project info: ${error?.message}`)
    }
}

/**
 * This method compares the original status to the current status, and based on the business logic 
 * either generates a create, delete, or keep the existing link.
 * @param originalStatus the original status of the project prior to user changes
 * @param currentStatus the new status the user is attempting to change the project to
 * @returns create, delete, or keep the link.
 */
export const updateApplicationLink = (originalStatus: Project_Status, currentStatus: Project_Status): "create" | "delete" | "keep" => {
    const originalStatusIndex = ProjectStatusOrder.indexOf(originalStatus);
    const currentStatusIndex = ProjectStatusOrder.indexOf(currentStatus);
    console.log(`The original status is: ${originalStatusIndex} and ${currentStatusIndex}`);
    // if original status is less than current status,and the current status is approved generate a new link
    if (originalStatusIndex < currentStatusIndex && currentStatus == Project_Status.APPROVED) {
        return "create";
    }

    // If current status is APPROVED and the original status is greater than APPROVED, don't generate a new link
    // basically if the user is trying to move the status back to approved, don't create a new link
    if (currentStatus === Project_Status.APPROVED && originalStatusIndex > currentStatusIndex) {
        return "keep";
    }

    // If the current status is less than the original status, delete the link
    // if the original status is approved(or higher) and the user moves it back to delete, review, draft or new. Then delete the original link
    if (currentStatus >= Project_Status.APPROVED  && currentStatusIndex < originalStatusIndex) {
        return "delete";
    }

    // Default to existing if none of the above conditions are met
    return "keep";
}