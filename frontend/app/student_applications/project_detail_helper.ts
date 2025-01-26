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
            if (value !== null) {
                (changedData as any)[key as keyof Project] = value;
                console.log(`Key: ${key} was modified to value: ${value}`)
            }
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