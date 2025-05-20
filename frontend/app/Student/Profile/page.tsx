import Headingbar from '@/components/employeeComponents/Headingbar';
import UnauthorizedPage from '@/components/unAuthorized';
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function StudentProfilePage() {
  const supabase = await createClient();

  // Get authenticated user
  const { data: userInfo, error: authError } = await supabase.auth.getUser();
  if (!userInfo.user || authError) {
    redirect('/sign-in');
  }

  // Fetch complete student data
  const { data: studentData, error: studentError } = await supabase
    .from('Students')
    .select(`
      *,
      Teams:team_id (
        *,
        Projects:project_id (*)
      )
    `)
    .eq('student_id', userInfo.user.id)
    .single();

  if (!studentData || studentError) {
    console.error('Student Data Fetch Error:', studentError);
    return <UnauthorizedPage />;
  }

const { full_name, email, github, Phone, university, major, ttg_email, changed_password } = studentData;
  const { team_name, nda_file, completed_onboarding, supervisor_name, supervisor_email, Projects } = studentData.Teams;
  const {
    title,
    github: projectGithub,
    description,
    google_link,
    status,
    department,
    start_term,
    created_date,
    approved_date,
    last_modified_date,
    last_modified_user,
    application_deadline,
    dispatcher_email,
    awarded_application_id,
    activation_date,
    completion_date
  } = Projects;


  return (
    <div className='p-8 min-h-screen text-white'>
      <Headingbar text='Student Profile' />

        <div className='bg-gray-700 p-6 rounded-xl shadow-lg mt-6'>
          <h2 className='text-2xl font-bold mb-4 underline'>Profile Information</h2>
          <div className='space-y-2 text-base'>
            <p><strong>Name:</strong> {full_name}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>TTG Email:</strong> {ttg_email || 'Not Provided'}</p>
            <p><strong>University:</strong> {university}</p>
            <p><strong>Major:</strong> {major}</p>
            <p><strong>GitHub:</strong> {github || 'Not Provided'}</p>
            <p><strong>Phone:</strong> {Phone || 'Not Provided'}</p>
            <p><strong>Password Changed:</strong> {changed_password ? 'Yes' : 'No'}</p>
          </div>
        </div>

        <div className='bg-gray-700 p-6 rounded-xl shadow-lg mt-6'>
          <h2 className='text-2xl font-bold mb-4 underline'>Team Information</h2>
          <p><strong>Team Name:</strong> {team_name}</p>
          <p><strong>NDA:</strong> {nda_file ? '✅ Uploaded' : '❌ Not Uploaded'}</p>
          <p><strong>Onboarding Completed:</strong> {completed_onboarding ? '✅ Yes' : '❌ No'}</p>
          <p><strong>Supervisor Name:</strong> {supervisor_name || 'Not Assigned'}</p>
          <p><strong>Supervisor Email:</strong> {supervisor_email || 'Not Assigned'}</p>
        </div>

    </div>
  );
}
