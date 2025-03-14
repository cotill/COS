import ApplicationForm from "@/components/studentComponents/application-form";
import { createClient } from "@/utils/supabase/server";
import { Application, Member, Project } from "@/utils/types";
import { encodedRedirect } from "@/utils/utils";

export default async function ApplicationPage({ params }: { params: Promise<{ slug: string }> }) {
  const application_link = (await params).slug;
  const supabase = await createClient();
  const { data, error } = await supabase.from("Projects").select("*").eq("application_link", application_link).single();

  if (error || !data) {
    return <p className="text-white text-center">Couldn't find project. Please contact project sponsor{data}</p>;
  }
  const projectInfo = data as Project;
  const deadline = projectInfo.application_deadline ? new Date(projectInfo.application_deadline) : null;
  const todayDate = new Date();
  if (deadline === null || todayDate > deadline) {
    return <p className="text-white text-center mt-10">Applications are closed for {projectInfo.title} - Project deadline has passed</p>;
  }
  if (projectInfo.awarded_application_id !== null){
    return <p className="text-white text-center mt-10">Applications are closed - {projectInfo.title} has been awarded</p>;
  }
  const sponsor = projectInfo.sponsor_email ? await supabase.from("Employees").select("full_name").eq("email", projectInfo.sponsor_email).single() : null;
  if (!sponsor || sponsor.error || !sponsor.data || projectInfo.sponsor_email === null) {
    projectInfo.sponsor_email = "Please refer to project form";
  }
  //I want to create a new project that is Project and the sponsor name if it exists
  const extendedProject = { ...projectInfo, sponsor_name: sponsor?.data?.full_name as string | null };
  return (
    <>
      {/* <p className="text-white">application id: {application_link}</p> */}
      <ApplicationForm extendedProject={extendedProject} handleSubmitApplication={handleSubmitApplication} />
    </>
  );
}

const handleSubmitApplication = async (application: Partial<Application>) => {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.from("Applications").insert({ ...application });
  if (error) {
    return encodedRedirect("error", "/application-success", "Error submitting application. Please try again later or contact sponsor.");
  } else {
    return encodedRedirect("success", "/application-success", "Your application has been submitted successfully!");
  }
};
