import { createStudent } from "@/app/student_applications/application";
import { Member, Student, UserRole } from "@/utils/types";
import { createClient } from "@/utils/supabase/client"; // Adjust the import path as needed

const supabase = createClient();

export const loadTeamData = async (teamId: string): Promise<Student[] | []> => {
  const { data: studentsData, error } = await supabase.from("Students").select("*").eq("team_id", teamId);

  if (error) {
    console.error("Failed to load team data:", error);
    return [];
  }
  const studentsInfo = studentsData as Student[];

  return studentsInfo || [];
};
export const validateStudents = (students: Partial<Student>[]): string | null => {
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

export const handleCreateStudentAccounts = async (newStudents: Partial<Student>[], teamId: string, uni: string): Promise<{ type: string; text: JSX.Element[] }> => {
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
    return { type: "success", text: message };
  } else if (failedEmails.length === newMembers.length) {
    message.unshift(<p className="text-red-600 font-bold">Failed to create student account(s). Please contact the sponsor.</p>);
    return { type: "error", text: message };
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
    return { type: "partial-success", text: message };
  }
};

/**
 * Help function to find students that were modified but not newly created or deleted

 */
export const modifiedStudents = (originalStudentsInfo: Partial<Student>[], students: Partial<Student>[], newStudents: Partial<Student>[], deleteStudents: Partial<Student>[]) => {
  const allModifiedStudent = students.filter((student) => {
    // Skip new students and students marked for deletion
    const isNewStudent = newStudents.some((s) => s.student_id === student.student_id);
    const isDeleted = deleteStudents.some((s) => s.student_id === student.student_id);

    if (isNewStudent || isDeleted) return false;

    // Find the original student to compare
    const originalStudent = originalStudentsInfo.find((s) => s.student_id === student.student_id);
    if (!originalStudent) return false;

    // Check if any fields have changed
    return student.full_name !== originalStudent.full_name || student.major !== originalStudent.major || student.ttg_email !== originalStudent.ttg_email;
  });
  return allModifiedStudent;
};

/**
 *
 * @param students
 * @returns
 */

export const updateStudentInformation = async (students: Partial<Student>[]) => {
  const results = await Promise.allSettled(
    students.map(async (student) => {
      // Only update if we have a student_id
      if (!student.student_id) return { status: "rejected", reason: "No student ID provided" };

      // Update the student information in the database
      const { data, error } = await supabase
        .from("Students")
        .update({
          full_name: student.full_name,
          major: student.major,
          ttg_email: student.ttg_email,
        })
        .eq("student_id", student.student_id);

      if (error) throw error;
      return { status: "fulfilled", value: data };
    })
  );

  return results;
};
export const handleUpdateStudentInformation = async (students: Partial<Student>[]): Promise<{ type: string; text: JSX.Element[] }> => {
  let success_count = 0;
  let failedUpdates: string[] = [];
  let message: JSX.Element[] = [];

  const results = await updateStudentInformation(students);

  results.forEach((result) => {
    if (result.status === "fulfilled") {
      success_count++;
    }
  });

  if (success_count === students.length) {
    message = [<p className="text-green-600 font-bold">All student information updated successfully.</p>];
    // successUpdates.forEach((student, index) => {
    //   message.push(
    //     <p key={index} className="text-white">
    //       For {student.full_name}:<br />
    //       Email: <u>{student.email}</u> Major: <u>{student.major}</u>
    //     </p>
    //   );
    // });
    return { type: "success", text: message };
  } else if (success_count === 0) {
    message.unshift(<p className="text-red-600 font-bold">Failed to update student information. Please contact the sponsor.</p>);
    return { type: "error", text: message };
  } else {
    message.unshift(
      <p className="text-orange-500 font-bold">
        <span className="text-green-600">Some information was updated successfully</span> but there were errors.
      </p>
    );
    // successUpdates.forEach((student, index) => {
    //   message.push(
    //     <p key={index} className="text-white">
    //       For {student.full_name}:<br />
    //       Email: <u>{student.email}</u> Major: <u>{student.major}</u>
    //     </p>
    //   );
    // });
    return { type: "partial-success", text: message };
  }
};
