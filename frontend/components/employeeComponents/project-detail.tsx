"use client"

import React from 'react'
import { useState, useEffect } from 'react'
import { Project, Project_Status, Employee } from '@/utils/types'
import { Hand, Info, Pencil, X, Check, ArrowUpRight, ChevronRight } from 'lucide-react';
import DatePicker from "react-datepicker"; // npm install react-datepicker documentation: https://reactdatepicker.com/#example-locale-without-global-variables
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import "./customDatePickerWidth.css";
import ReactMarkdown from "react-markdown";
import { Button } from '../ui/button';
import Link from 'next/link';
import {RoundSpinner} from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import date from 'date-and-time'; //npm i date-and-time
import timezone from 'date-and-time/plugin/timezone'; //// Import plugin for date-time for more tokens

import { getChangedData, onUpdateProject } from '@/app/student_applications/project_detail_helper'; 
import { ProjectStatusButton } from '../project-status-button';
import { Http2ServerRequest } from 'http2';
import { createClient } from '@/utils/supabase/client';
import { redirect } from 'next/navigation';

interface ProjectDetailProps{
  project: Project,
  creatorName: string | null,
  approvalName: string | null,
  dispatcherName: string | null,
}


export default function ProjectDetail({project, creatorName, approvalName, dispatcherName } : ProjectDetailProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [sponsorData, setSponsorData] = useState<Employee | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMessage, setMessage] = useState<string | null >(null);
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

  function formatDateTime(raw_date: string | null): string{ 
    if (raw_date === null) return "N/A";
    date.plugin(timezone); // apply the plugin
    const dateTime = new Date(raw_date);

    const pattern = date.compile('MMM D, YYYY hh:mm z')
    const localDateTime = date.formatTZ(dateTime, pattern);

    return localDateTime;
  }

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_,i) => (currentYear+i).toString());
  
  // modifies the current project object
  const onInputChange = (event : {target: {name: any, value: any}}) => {
    const {name, value} = event.target;
    setCurrentProjectInfo({
      ...currentProjectInfo, [name]:value
    });
  }

  async function handleSaveProject () {
    setIsSaving(true);

    // set timeout is async
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false)
    }, timeoutLength);
    // save logic
    try {
      const updatedData: Partial<Project> = getChangedData(originalProjectInfo, currentProjectInfo); 
      if (Object.keys(updatedData).length === 0) {
        setMessage("No changes detected to update the project.");
        setCurrentProjectInfo(originalProjectInfo)
        return;
      }
      await onUpdateProject(updatedData, project.project_id);

      setOriginalProjectInfo(currentProjectInfo);

    } catch (error) {
      alert(`Failed to update project ${error}`);
      setCurrentProjectInfo(originalProjectInfo);
    }finally {
    }

  }
  function handleCancelEdit() {
    setCurrentProjectInfo(originalProjectInfo);
    setIsEditing(false);
  }
  const handleProjectEdit = () => {
    setIsEditing(!isEditing);
  }

  function updateDate(date: Date | undefined) {
    onInputChange({
      target: {
        name: "application_deadline",
        value: date ? date.toISOString() : "",
      },
    })
  }
  
  const supabase = createClient();
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      if (!currentProjectInfo.sponsor_email) return;
      const { data, error } = await supabase
        .from("Employees")
        .select("full_name, title, department")
        .eq("email", currentProjectInfo.sponsor_email)
        .single(); // Expect one record

      if (error) {
        setError(error.message);
        setSponsorData(null);
      } else {
        setSponsorData(data as Employee); // Type assertion for safety
      }
    };

    fetchEmployeeDetails();
  }, [currentProjectInfo.sponsor_email, supabase]);

  function handleClearSponsor() {
    setSponsorData(null);
    currentProjectInfo.sponsor_email == null;
  }

  const handleAutofill = async () => {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
  
    if ( userError || !user) {
      redirect("/sign-in")
    }


    // Fetch employee details based on Employee_id
    const { data, error } = await supabase
    .from("Employees")
    .select("full_name, email, title, department, employee_id") // Include Employee_id for debugging
    .eq("employee_id", user.id) // Querying by Employee_id
    .single();

    if (error) {
      console.error("Supabase query error:", error.message);
      setError(error.message);
      return;
    }

    setSponsorData(data as unknown as Employee);
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
                  width: `${currentProjectInfo.title.length +1}ch`,
                }}
              />
            </div>
          ) : (
            <h1 className="text-2xl underline font-bold text-white py-2">
              {currentProjectInfo.title}
            </h1>
          )}

          <div className='flex items-center space-x-0.5'>
            <h2 className="text-xl font-bold text-white py-2">
              Project Description
            </h2>
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex text-sm text-gray-300 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none px-1"
              aria-label="More Information"
            >
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
          <ProjectStatusButton initial_status={originalProjectInfo.status} status={currentProjectInfo.status} setProjStatus={(status) => onInputChange({target: {name: "status", value: status}})} allowClick={isEditing}/>
        </div>
      </div>
      <Dialog
        open={isPopupOpen === true}
        onOpenChange={() => setIsPopupOpen(false)}
      >
        <DialogContent className="bg-[#1D1B23] text-white">
          <DialogHeader>
            <DialogTitle className="text-xl text-center">
              {project.title}
            </DialogTitle>
            <DialogTitle className="text-lg mb-2">Project Details</DialogTitle>
            <div>
              <p>Department: {project.department}</p>
              <p>
                Created by: {creatorName} on{" "}
                {formatDateTime(project.created_date)}
              </p>
              {approvalName && (
                <p>
                  Reviewed by: {approvalName} on{" "}
                  {formatDateTime(project.approved_date)}
                </p>
              )}
              {dispatcherName && (
                <p>
                  Dispatched by: {dispatcherName} on{" "}
                  {formatDateTime(project.dispatched_date)}
                </p>
              )}
              {project.activation_date && (
                <p>Project activated on: {project.activation_date}</p>
              )}
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

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
          <div className="relative bg-gray-300 p-4 rounded-xl text-sm max-h-48 h-48 overflow-y-auto">
            <ReactMarkdown className="markdown-content">
              {currentProjectInfo.description}
            </ReactMarkdown>
          </div>
        )}
      </div>
      
      {/* Budget, Deadline and Start Term */}
      {/* <div className="flex items-center gap-10 text-white p-4 rounded-md justify-center"> */}
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
              className={`p-1 pl-7 rounded-md text-black w-full outline-none ${!isEditing ? 'cursor-default' : ''}`}
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
              selected={
              currentProjectInfo.application_deadline
                ? new Date(currentProjectInfo.application_deadline)
                : null
              }
              onChange={(date) =>
              onInputChange({
                target: {
                name: "application_deadline",
                value: date ? date.toISOString() : "",
                },
              })
              }
              dateFormat="MMM d, yyyy hh:mm aa "
              timeFormat="p"
              placeholderText="Select a date"
              className={`bg-white text-black py-1 rounded-md outline-none w-full ${!isEditing ? 'cursor-default' : ''}`}
              showTimeSelect
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
            <select className={`text-black focus:outline-none rounded-md h-6 ${!isEditing ? 'cursor-default' : ''}`}
              disabled={!isEditing}>
              {["Jan","May", "Sept"].map((choice) => (
                <option key={choice} value={choice}>{choice}</option>
              ))}
            </select>
            <select className={`text-black focus:outline-none rounded-md h-6 ${!isEditing ? 'cursor-default' : ''}`}
            disabled={!isEditing}>
              {years.map((choice) => (
                <option key={choice} value={choice}>{choice}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sponsors */}
      <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-white py-2">Sponsor</h2>
        {isEditing && (
          <Button
            className={`px-3 py-1 rounded-md ${
              sponsorData ? "bg-[#F72E53]" : "bg-[#81C26C]"
            } text-white`}
            onClick={sponsorData ? handleClearSponsor : handleAutofill}
          >
            {sponsorData ? "Remove" : "Sponsor"}

          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-white">Name:</label>
          <input
            type="text"
            value={sponsorData?.full_name ?? ""}
            readOnly={!isEditing}
            className="p-1 rounded-md bg-white text-black outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white">Email:</label>
          <input
            type="email"
            value={currentProjectInfo.sponsor_email || sponsorData?.email || ""}
            readOnly={!isEditing}
            className="p-1 rounded-md bg-white text-black outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white">Department:</label>
          <input
            type="text"
            value={sponsorData?.department ?? ""}
            readOnly={!isEditing}
            className="p-1 rounded-md bg-white text-black outline-none"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-white">Title:</label>
          <input
            type="text"
            value={sponsorData?.title ?? ""}
            readOnly={!isEditing}
            className="p-1 rounded-md bg-white text-black outline-none"
          />
        </div>
      </div>
    </div>

      {/* Applications */}
      <div>
        <h2 className="text-xl font-bold text-white py-2">
          Applications
        </h2>
        <div className='space-x-2'>
          <Button asChild className='text-md space-x-1'>
            <Link href={`/Employee/Projects/${project.project_id}/Applicants`}> {/* change this */}
              <span>Application Link</span>
              <ArrowUpRight/>
            </Link>
          </Button>
          <Button asChild className='text-md space-x-1'>
            <Link href={`/Employee/Projects/${project.project_id}/Applicants`}>
              <span>View Applicants</span>
              <ChevronRight/>
            </Link>
          </Button>
        </div>
      </div>
      
      
      {/* error message */}
      {isMessage && <div className='text-red-400 text-center'>{isMessage}</div>}
      {isEditing && (
        <div className="flex justify-end space-x-2 mt-2">
          <Button
            variant="outline"
            onClick={handleCancelEdit}
            className="flex items-center"
          >
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
