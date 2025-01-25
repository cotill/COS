import { Project, Project_Status } from '@/utils/types'

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

export const saveProjectAction = async(formData: FormData) => {
    const budget = formData.get("budget")?.toString();
    const deadline = formData.get("deadline")?.toString();
    console.log(`budget is: ${budget} and deadline: ${deadline}`)
}