import { createStudent } from "@/app/student_applications/application";
import { Member, Student, Team, UserRole } from "@/utils/types";
import { User } from "lucide-react";

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

export const handleCreateStudentAccounts = async (newStudents: Partial<Student>[], teamId: string, uni: string): Promise<{ type: string; text: string }> => {
  // map the students to a member because createStudent is the same function that is used for converting an application into a studnet
  const newMembers: Member[] = newStudents.map((student) => ({
    full_name: student.full_name!,
    email: student.email!,
    major: student.major!,
    role: UserRole.STUDENT,
    resume: null,
  }));

  try {
    await Promise.all(newMembers.map((member) => createStudent(member, teamId, uni)));
    // if successful, update local data with new data
    let message: JSX.Element[] = [<p className="text-green-600">Changes saved successfully.</p>];
    if (newStudents.length > 0) {
      message.push(<p className="mt-2">Account created for new members! Login details are</p>);
      newStudents.forEach((student, index) => {
        message.push(
          <p key={index} className="text-white">
            For ${student.full_name}:<br />
            Email: <u>${student.email}</u> Password: <u>teamPasswordIsLong</u>
          </p>
        );
      });
    }
    return { type: "success", text: "New student accounts created successfully." };
  } catch (error) {
    return { type: "error", text: "An error occurred while creating new student accounts." };
  }
  // setTimeout(() => setNotification(null), timeLength);
};
