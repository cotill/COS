"use client";

import React from "react";
import { useState, useEffect, Suspense } from "react";
import { Project, Project_Status, Employee, Universities } from "@/utils/types";
import { Info, Pencil, X, Check, ArrowUpRight, ChevronRight } from "lucide-react";
import DatePicker from "react-datepicker"; // npm install react-datepicker documentation: https://reactdatepicker.com/#example-locale-without-global-variables
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import "./customDatePickerWidth.css";
import ReactMarkdown from "react-markdown";
import { Button } from "../ui/button";
import Link from "next/link";
import { RoundSpinner } from "@/components/ui/spinner";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import { getChangedData, onUpdateProject, updateApplicationLink, canUserEditProject } from "@/app/student_applications/project_detail_helper";
import { ProjectStatusButton } from "../project-status-button";
import { createClient } from "@/utils/supabase/client";
import { FaGithub, FaGoogleDrive } from "react-icons/fa";
import { TeamDetailsDialog } from "./team-detail";
import "./project-details.css";
import CreatePdf from "@/app/student_applications/createPdf";
import dynamic from "next/dynamic";
interface ProjectDetailProps {
  employeeInfo: Employee;
  project: Project;
  initialSponsorInfo: Employee | null;
}
// lazy laod employee, therefore, it could imported when needed
const ProjectLogInfo = dynamic(() => import("@/components/employeeComponents/project-info-dialog"), {});

export default function ProjectDetail({ employeeInfo, project, initialSponsorInfo }: ProjectDetailProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sponsorData, setSponsorData] = useState<Employee | null>(initialSponsorInfo);
  const [error, setError] = useState<string | null>(null);
  const [isMessage, setMessage] = useState<string | null>(null);
  const [awardedTeam, setAwardedTeam] = useState(null);
  const timeoutLength = 1000;

  useEffect(() => {
    if (isMessage) {
      const timer = setTimeout(() => {
        setMessage(null);
      }, timeoutLength);
      return () => clearTimeout(timer);
    }
  }, [isMessage]);

  // need to store the original data so that we can revert back
  const [originalProjectInfo, setOriginalProjectInfo] = useState<Project>(project);

  // anything that is/ could be null or undefined is replaced
  const [currentProjectInfo, setCurrentProjectInfo] = useState<Project>(project);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 3 }, (_, i) => (currentYear + i).toString());

  // modifies the current project object
  const onInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setCurrentProjectInfo({
      ...currentProjectInfo,
      [name]: value,
    });
  };

  async function handleSaveProject() {
    setIsSaving(true);

    // set timeout is async
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false);
    }, timeoutLength);
    // save logic
    try {
      const updatedData: Partial<Project> = getChangedData(originalProjectInfo, currentProjectInfo, employeeInfo.email, employeeInfo.level);
      if (Object.keys(updatedData).length === 0) {
        setMessage("No changes detected to update the project.");
        setCurrentProjectInfo(originalProjectInfo);
        return;
      }
      // update last modified by to the time and the current user
      const dateNow = new Date().toISOString();
      updatedData.last_modified_date = dateNow; // include the date the data was last modified
      currentProjectInfo.last_modified_date = dateNow;
      currentProjectInfo.last_modified_user = employeeInfo.email;
      updatedData.last_modified_user = employeeInfo.email;

      // if the current status is APPROVED, set approve detail
      if (originalProjectInfo.status !== currentProjectInfo.status) {
        if (currentProjectInfo.status === Project_Status.APPROVED) {
          updatedData.approval_email = employeeInfo.email;
          updatedData.approved_date = dateNow;
        }
        if (currentProjectInfo.status === Project_Status.DISPATCHED) {
          updatedData.dispatcher_email = employeeInfo.email;
          updatedData.dispatched_date = updatedData.dispatched_date;
        }
      }

      await onUpdateProject(updatedData, project.project_id);
      setOriginalProjectInfo({
        ...originalProjectInfo,
        ...updatedData,
        application_link: updatedData.application_link !== undefined ? updatedData.application_link : originalProjectInfo.application_link,
      });
    } catch (error) {
      alert(`${error}`);
      setCurrentProjectInfo(originalProjectInfo);
    } finally {
    }
  }
  function handleCancelEdit() {
    setCurrentProjectInfo(originalProjectInfo);
    setIsEditing(false);
  }
  const handleProjectEdit = () => {
    // check if the user can  edit
    if (canUserEditProject(employeeInfo.email, employeeInfo.level, project.creator_email)) {
      setIsEditing(true);
    } else {
      alert("You're are not authorized to edit this project! \nOnly the user that created the project, or user's lvl 2+ can edit this project");
    }
  };

  const supabase = createClient();

  const handleClearSponsor = async () => {
    if (employeeInfo.level < 2) {
      alert("You do not have permission to remove the sponsor.");
      return;
    } else {
      setSponsorData(null);
      onInputChange({
        target: { name: "sponsor_email", value: null },
      });
    }
  };

  const handleAutofill = async () => {
    if (employeeInfo.level == 3) {
      setSponsorData(employeeInfo);
      onInputChange({
        target: {
          name: "sponsor_email",
          value: employeeInfo.email,
        },
      });
      return;
    } else {
      alert("You do not have permission to sponsor a project.");
      return;
    }
  };

  const onViewDetails = async () => {
    if (!currentProjectInfo.awarded_application_id) return;

    // Fetch the awarded application from Supabase
    const { data, error } = await supabase
      .from("Applications")
      .select("*") // Fetch all application fields
      .eq("application_id", currentProjectInfo.awarded_application_id)
      .single();

    if (error) {
      console.error("Error fetching team details:", error);
      return;
    }

    setAwardedTeam(data); // Store the fetched team data
  };

  const handleDownloadPdf = async () => {
    // Get the current session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      console.error("User not authenticated");
      return;
    }

    try {
      const response = await fetch(`/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${session.access_token}`, // Pass the token
        },
        body: JSON.stringify({
          project_id: currentProjectInfo.project_id,
        }),
      });
      console.log(response);
      if (!response.ok) {
        console.error("Failed to fetch PDF");
        return;
      }

      const result = await response.json();
      console.log(result); // Process the result (PDF content or success message)
    } catch (error) {
      console.error("Error fetching PDF:", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3 py-2">
        <div className="flex flex-col space-y-2">
          {isEditing ? (
            <div>
              <input
                name="title"
                value={currentProjectInfo.title}
                onChange={onInputChange}
                className="w-full max-h-14 text-2xl font-bold p-2 rounded-md text-black focus:outline-none bg-gray-300 "
                placeholder="Enter project title"
                readOnly={!isEditing}
                style={{
                  width: `${currentProjectInfo.title.length + 1}ch`,
                }}
              />
            </div>
          ) : (
            <h1 className="text-2xl underline font-bold text-white py-2">{currentProjectInfo.title}</h1>
          )}

          <div className="flex items-center space-x-0.5">
            <h2 className="text-xl font-bold text-white py-2">Project Description</h2>
            <button onClick={() => setIsPopupOpen(true)} className="flex text-sm text-gray-300 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none px-1" aria-label="More Information">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
        {/* Project edit button */}
        <div className="flex items-center gap-6 justify-center">
          <Button
            className={`flex flex-row rounded-full w-24 gap-3 font-medium h-9 focus:outline-none 
          hover:bg-opacity-10 hover:bg-white transition-colors duration-100 ease-in-out
          ${isEditing ? "hidden" : ""}`}
            onClick={handleProjectEdit}
          >
            <span>Edit</span>
            <Pencil size={18} />
          </Button>

          {/* Project status button */}
          <ProjectStatusButton
            initial_status={originalProjectInfo.status}
            status={currentProjectInfo.status}
            setProjStatus={(status) => onInputChange({ target: { name: "status", value: status } })}
            allowClick={isEditing}
          />
        </div>
      </div>
      {isPopupOpen && (
        <Suspense fallback={<p className="text-white text-center">Loading...</p>}>
          <Dialog open={isPopupOpen === true} onOpenChange={() => setIsPopupOpen(false)}>
            <ProjectLogInfo currentProject={originalProjectInfo} />
          </Dialog>
        </Suspense>
      )}

      <div>
        {isEditing ? (
          <div>
            <textarea
              name="description"
              value={currentProjectInfo.description}
              onChange={onInputChange}
              className="w-full h-48  text-sm max-h-48 p-2 rounded-md text-black focus:outline-none bg-gray-300 "
              placeholder="Enter project description"
              readOnly={!isEditing}
            />
          </div>
        ) : (
          <div className="relative bg-gray-300 p-4 rounded-xl text-sm max-h-48 h-48 overflow-y-auto text-black">
            <ReactMarkdown className="markdown-content">{currentProjectInfo.description}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Budget, Deadline and Start Term */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white my-4">
        {/* Budget */}
        <div className="space-y-2 w-full">
          <label htmlFor="budget">Budget</label>
          <div className="relative">
            <span className="absolute left-3 top-1 text-black">$</span>
            <input
              type="number"
              min="0"
              placeholder="Enter budget"
              name="project_budget"
              value={currentProjectInfo.project_budget}
              onChange={(event) =>
                onInputChange({
                  target: {
                    name: event.target.name,
                    value: event.target.value.replace(/[^0-9]/g, ""),
                  },
                })
              }
              readOnly={!isEditing}
              className={`p-1 pl-7 rounded-md text-black w-full outline-none ${!isEditing ? "cursor-default" : ""}`}
            />
          </div>
        </div>

        {/* Application Deadline */}
        {/* <div className="relative flex flex-col items-center space-y-2"> */}
        <div className="space-y-2 w-full">
          <label className="text-base">Application deadline</label>
          <div className="customDatePickerWidth">
            <DatePicker
              name="application_deadline"
              selected={currentProjectInfo.application_deadline ? new Date(currentProjectInfo.application_deadline) : null}
              onChange={(date) => {
                if (date){
                  date.setUTCHours(23 + 7, 59, 0, 0) // saves 11:59pm MST in UTC
                  onInputChange({
                    target: {
                      name: "application_deadline",
                      value: date ? date.toISOString() : "",
                    },
                  })
                }
              }}
              dateFormat="MMM d, yyyy"
              timeFormat="p"
              placeholderText="Select a date"
              className={`bg-white text-black py-1 rounded-md outline-none w-full ${!isEditing ? "cursor-default" : ""}`}
              minDate={new Date()}
              toggleCalendarOnIconClick
              showIcon
              locale="mst-us"
              readOnly={!isEditing}
            />
          </div>
        </div>

        {/* Start Term */}
        <div className=" relative flex flex-col">
          <label className="text-base capitalize">start team</label>
          <div className="flex items-center space-x-2">
            <select className={`text-black focus:outline-none rounded-md h-6 ${!isEditing ? "cursor-default" : ""}`} disabled={!isEditing}>
              {["Jan", "May", "Sept"].map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
            <select className={`text-black focus:outline-none rounded-md h-6 ${!isEditing ? "cursor-default" : ""}`} disabled={!isEditing}>
              {years.map((choice) => (
                <option key={choice} value={choice}>
                  {choice}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sponsors */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold text-white pt-4">Sponsor</h2>
          {isEditing && (
            <Button
              className={`px-3 py-1 rounded-full ${sponsorData ? "bg-[#F72E53] hover:bg-[#e8516d]" : "bg-[#81C26C] hover:bg-[#7cb36a]"} text-black`}
              onClick={sponsorData ? handleClearSponsor : handleAutofill}
            >
              {sponsorData ? "Remove" : "Sponsor Project"}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div className="flex flex-col">
            <label className="text-white">Name:</label>
            <input type="text" value={sponsorData?.full_name ?? ""} readOnly className="p-1 rounded-md bg-white text-black outline-none" />
          </div>

          <div className="flex flex-col">
            <label className="text-white">Email:</label>
            <input type="text" value={sponsorData?.email || ""} readOnly className="p-1 rounded-md bg-white text-black outline-none" />
          </div>

          <div className="flex flex-col">
            <label className="text-white">Department:</label>
            <input type="text" value={sponsorData?.department ?? ""} readOnly className="p-1 rounded-md bg-white text-black outline-none" />
          </div>

          <div className="flex flex-col">
            <label className="text-white">Title:</label>
            <input type="text" value={sponsorData?.title ?? ""} readOnly className="p-1 rounded-md bg-white text-black outline-none" />
          </div>
        </div>
      </div>

      {/* Dispatch Information */}
      <div>
        <div className="flex justify-between items-center mb-2 ">
          <h2 className="text-xl font-bold text-white pt-4">Dispatch Information </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div className="flex flex-col">
            <label className="text-white flex items-center gap-2">
              {" "}
              <FaGoogleDrive />
              Google Drive Link:
            </label>
            <input
              type="text"
              placeholder="Enter Google Drive Link"
              value={currentProjectInfo.google_link ?? ""}
              onChange={(event) =>
                onInputChange({
                  target: {
                    name: "google_link",
                    value: event.target.value,
                  },
                })
              }
              readOnly={!isEditing}
              className={`p-1 rounded-md text-black w-full outline-none ${!isEditing ? "cursor-default" : ""}`}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white flex items-center gap-2">
              {" "}
              <FaGithub />
              GitHub Link:
            </label>
            <input
              type="text"
              placeholder="Enter GitHub Link"
              value={currentProjectInfo.github ?? ""}
              onChange={(event) =>
                onInputChange({
                  target: {
                    name: "github",
                    value: event.target.value,
                  },
                })
              }
              readOnly={!isEditing}
              className="p-1 rounded-md bg-white text-black outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-white">University:</label>
            <select
              value={currentProjectInfo.university ?? ""}
              onChange={(event) =>
                onInputChange({
                  target: {
                    name: "university",
                    value: Object.values(Universities).includes(event.target.value as Universities) ? (event.target.value as Universities) : null,
                  },
                })
              }
              disabled={!isEditing}
              className="p-2 rounded-md bg-white text-black outline-none"
            >
              <option value="" disabled>
                Select a university
              </option>
              <option value="null">None</option>
              {Object.values(Universities).map((uni) => (
                <option value={uni} key={uni}>
                  {uni}
                </option>
              ))}
            </select>
          </div>
          {![Project_Status.NEW, Project_Status.DRAFT, Project_Status.REVIEW, Project_Status.REJECTED].includes(originalProjectInfo.status) && (
            <div className="flex flex-col">
              <label className="text-white">Download for Dispatch</label>
              <CreatePdf />
              {/* <Button onClick={handleDownloadPdf}> Download as PDF </Button> */}
            </div>
          )}
        </div>
      </div>

      {/* Applications, Team Awarded and Application Status*/}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
        {/* applications */}
        <div>
          <h2 className="text-xl font-bold text-white py-2">Applications</h2>
          <div className="space-x-2">
            <Button asChild className="text-md space-x-1" disabled={!originalProjectInfo.application_link}>
              <Link href={`/ApplicationForm/${originalProjectInfo.application_link}/`}>
                {" "}
                <span>Application Link</span>
                <ArrowUpRight />
              </Link>
            </Button>
            <Button asChild className="text-md space-x-1">
              <Link href={`/Employee/Projects/${project.project_id}/Applicants`}>
                <span>View Applicants</span>
                <ChevronRight />
              </Link>
            </Button>
          </div>
        </div>

        {/* Team Awarded */}
        {currentProjectInfo.awarded_application_id && (
          <div>
            <h2 className="text-xl font-bold text-white py-2">Team Awarded</h2>
            <Dialog open={!!awardedTeam} onOpenChange={() => setAwardedTeam(null)}>
              <DialogTrigger asChild>
                <Button onClick={onViewDetails}>
                  View Team Details
                  <ChevronRight />
                </Button>
              </DialogTrigger>

              <TeamDetailsDialog team={awardedTeam} onClose={() => setAwardedTeam(null)} onApprove={undefined} onReject={undefined} onPending={undefined} />
            </Dialog>
          </div>
        )}
        {/* Application Status */}
        <div className="flex gap-2 items-start [&_label]:text-white [&_h2]:text-white">
          <h2 className="text-xl font-normal">Application Status:</h2>
          <div className="flex flex-col gap-2 text-base [&_label]:font-medium [&_input]:w-5 [&_input]:h-5">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                className={`${isEditing ? "enabledinput" : "disabledinput"}`}
                id="project_link_open"
                name="link_active"
                checked={currentProjectInfo.link_active === true}
                onChange={() => {
                  isEditing &&
                    onInputChange({
                      target: {
                        name: "link_active",
                        value: true,
                      },
                    });
                }}
              />
              <label htmlFor="project_link_open">Open</label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                className={`${isEditing ? "enabledinput" : "disabledinput"}`}
                id="project_link_closed"
                name="link_active"
                checked={currentProjectInfo.link_active === false}
                onChange={() => {
                  isEditing &&
                    onInputChange({
                      target: {
                        name: "link_active",
                        value: false,
                      },
                    });
                }}
              />
              <label htmlFor="project_link_closed">Closed</label>
            </div>
          </div>
        </div>
      </div>

      {/* error message */}
      {isMessage && <div className="text-red-400 text-center">{isMessage}</div>}
      {isEditing && (
        <div className="flex justify-end space-x-2 mt-2">
          <Button variant="outline" onClick={handleCancelEdit} className="flex items-center">
            <X className="mr-1 h-4 w-4" /> Cancel
          </Button>
          <Button onClick={handleSaveProject} className="flex items-center">
            {isSaving ? (
              <>
                <RoundSpinner size="xs" color="white" />
                <span className="ml-1">Saving...</span>
              </>
            ) : (
              <>
                <Check className="mr-1 h-4 w-4" /> Save
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
