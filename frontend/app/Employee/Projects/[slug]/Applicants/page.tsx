import ApplicationList from "@/components/employeeComponents/application-list";

export default async function ApplicantsPage({params,} : {params : Promise<{slug : string}>}) {
  const projectId = (await params).slug;
  return (
    <div className="p-6">
      Applicants page
      <p>Application id{projectId}</p>
      <ApplicationList projectId={projectId} />
    </div>
  )
}
