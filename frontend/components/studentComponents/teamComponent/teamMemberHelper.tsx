import { Student, Team } from "@/utils/types";

export const validateStudents = (students: Partial<Student>[]): string | null => {
  "use client";

  for (const student of students) {
    if (!student.full_name || student.full_name.trim() === "") {
      return "Full name is required for all team members";
    }
    if (!student.email || student.email.trim() === "") {
      return "Email is required for all team members";
    }
    if (!student.major || student.major.trim() === "") {
      return "Major is required for all team members";
    }
    // Optional: Add email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(student.email)) {
      return "Please enter a valid email address for all team members";
    }
  }
  return null;
};
