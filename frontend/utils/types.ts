export enum UserRole{
    EMPLOYEE = "employee",
    STUDENT = "student"
}
export interface Employee{
    email: string;
    password: string;
    full_name: string;
    level: number;
    Employee_id: string;
}
export interface Student{
    email: string;
    password: string;
    full_name: string;
    university: string;
    major: string;
    github?: string;
    team_id: string;
}

export enum EmployeeLevel {
    LEVEL_0 = 0,
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3, 
}

export interface AuthResult {
    isAuthenticated: boolean;
    userRole: UserRole| null;
    userInfo?: Employee | Student | null;
}

export enum EmployeePages {
    PROJECTS = "Projects",
    TRAINING = "Training",
    SPONSORED_PROJECTS = "Sponsored Projects",
    SETTINGS = "Employee Settings",
    CREATE_PROJECT = "Create Project",
}