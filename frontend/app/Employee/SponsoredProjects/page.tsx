import Headingbar from "@/components/employeeComponents/Headingbar";
import { SponsoredList } from '@/components/employeeComponents/SponsoredList';

export default async function sponsoredprojectspage(){
    return (
      <>
      <Headingbar
        text='Sponsored Projects'
      />
      <SponsoredList/>
      </>
      //   <div className="text-purple-300">
      //     This is the sponsored projects page
      // </div>
    );
}