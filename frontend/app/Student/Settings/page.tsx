import Headingbar from "@/components/employeeComponents/Headingbar";
import StudentInfo from "@/components/studentComponents/student-information"
import StudentChanges from "@/components/studentComponents/student-pw-gh-change";
import {createClient} from '@/utils/supabase/server';
import { redirect } from "next/navigation";

export default async function settingspage(){
  const supabase = await createClient();
  
  // get session stuff
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if ( userError || !user) {
    redirect("/sign-in")
  }

  // from session stuff, get user id
  const userId = user.id; 
  return (
    <>
      <Headingbar
        text='Student Settings'
      />
      <StudentInfo userId={userId}/>
      <StudentChanges userId={userId}/>
    </>
  );
}