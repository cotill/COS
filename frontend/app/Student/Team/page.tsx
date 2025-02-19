import Headingbar from "@/components/employeeComponents/Headingbar";
import TeamManagement from "@/components/studentComponents/team-management";

export default function teampage(){

  return (
    <>
      <Headingbar
        text='Student Team'
      />
      <div>
        <TeamManagement />
      </div>
    </>
  );
}