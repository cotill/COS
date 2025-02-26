import { createStudent } from "@/app/student_applications/application";
import { Member, Student, UserRole } from "@/utils/types";

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

export const handleCreateStudentAccounts = async (
  newStudents: Partial<Student>[],
  teamId: string,
  uni: string
): Promise<{ type: string; text: JSX.Element[]; failedEmails: string[]; successStudents: Partial<Student>[] }> => {
  // console.log(`Create student! Passed email: ${newStudents[0].email} student(temp) id: ${newStudents[0].student_id}`);

  const newMembers: Member[] = newStudents.map((student) => ({
    full_name: student.full_name!,
    email: student.email!,
    major: student.major!,
    role: UserRole.STUDENT,
    resume: null,
  }));

  let successStudents: Partial<Student>[] = [];
  let failedEmails: string[] = [];
  let message: JSX.Element[] = [];

  const results = await Promise.allSettled(newMembers.map((member) => createStudent(member, teamId, uni, true)));

  results.forEach((result, index) => {
    const student = newStudents[index];
    if (result.status === "fulfilled") {
      const createUser = result.value;
      // update the student Id with the created user id
      successStudents.push({ ...student, student_id: createUser.data.user.id });
    } else {
      failedEmails.push(student.email!);
      message.push(<p key={index}>{String(result.reason)}</p>);
    }
  });

  if (successStudents.length === newMembers.length) {
    message = [<p className="text-green-600  font-bold">All accounts created successfully.</p>];
    newStudents.forEach((student, index) => {
      message.push(
        <p key={index} className="text-white">
          For {student.full_name}:<br />
          Email: <u>{student.email}</u> Password: <u>teamPasswordIsLong</u>
        </p>
      );
    });
    return { type: "success", text: message, failedEmails, successStudents };
  } else if (failedEmails.length === newMembers.length) {
    message.unshift(<p className="text-red-600 font-bold">Failed to create student account(s). Please contact the sponsor.</p>);
    return { type: "error", text: message, failedEmails, successStudents };
  } else {
    message.unshift(
      <p className="text-orange-500  font-bold">
        <span className="text-green-600">Some accounts were created successfully</span> but there were errors.
      </p>
    );
    successStudents.forEach((student, index) => {
      message.push(
        <p key={index} className="text-white">
          For {student.full_name}:<br />
          Email: <u>{student.email}</u> Password: <u>teamPasswordIsLong</u>
        </p>
      );
    });
    return { type: "partial-success", text: message, failedEmails, successStudents };
  }
};
