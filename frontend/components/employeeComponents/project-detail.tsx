"use client"

import React from 'react'
import { useState } from 'react'
import { Project, Project_Status } from '@/utils/types'
import { Hand, Info } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import DatePicker from "react-datepicker"; // npm install react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Import the CSS for the date picker
import { Calendar } from "lucide-react";
import { Button } from '../ui/button';
import Link from 'next/link';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import date from 'date-and-time'; //npm i date-and-time
import timezone from 'date-and-time/plugin/timezone'; //// Import plugin for date-time for more tokens

import { ProjectStatusOrder } from '@/app/student_applications/project_detail_helper'; 
import { ProjectStatusButton } from '../project-status-button';


interface ProjectDetailProps{
  project: Project,
  creatorName: string | null,
  approvalName: string | null,
  dispatcherName: string | null,
}

export default function ProjectDetail({project, creatorName, approvalName, dispatcherName } : ProjectDetailProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [projStatus, setProjStatus] = useState<Project_Status>(project.status);

  // const [deadline, setDeadline] = useState<Date | null>(null);
  const [projectInfo, setProjectInfo] = useState({
    ...project,
    sponsor_email: project.sponsor_email ?? "",
    project_budget: project.project_budget ?? 0,
    approved_date: project.approved_date ?? "",
    approval_email: project.approval_email ?? "",
    dispatched_date: project.dispatched_date ?? "",
    dispatcher_email: project.dispatched_date ?? "",
    activation_date: project.activation_date ?? "",
    link_active: project.link_active ?? false,
    applications_allowed: project.applications_allowed ?? false,
    application_deadline: project.application_deadline ?? "",
    awarded_application_id: project.awarded_application_id !== 0 ? project.awarded_application_id : null,
    application_link: project.application_link ?? "",
    modified_date: project.modified_date ?? "",
    university: project.university ?? null,
    
  });

  function formatDateTime(raw_date: string | null): string{ 
    if (raw_date === null) return "N/A";
    date.plugin(timezone); // apply the plugin
    const dateTime = new Date(raw_date);

    const pattern = date.compile('MMM D, YYYY hh:mm z')
    const localDateTime = date.formatTZ(dateTime, pattern);
    // console.log(localDateTime)

    return localDateTime;
  }
  
  const onInputChange = (event : {target: {name: any, value: any}}) => {
    const {name, value} = event.target;
    setProjectInfo({
      ...projectInfo, [name]:value
    });
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-4 py-2">
        <div className="flex items-center space-x-0.5">
          <h1 className="text-xl font-bold text-white px-2">
            Project Description
          </h1>
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex text-sm text-gray-300 hover:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none px-1"
            aria-label="More Information"
          >
            <Info className="w-5 h-5" />
          </button>
        </div>
        {/* Project Status button */}
        <ProjectStatusButton status={projStatus} setProjStatus={setProjStatus} />
      </div>
      <Dialog open={isPopupOpen === true} onOpenChange={()=> setIsPopupOpen(false)}>
        <DialogContent className="bg-[#1D1B23] text-white">
          <DialogHeader>
            <DialogTitle className='text-xl text-center'>{project.title}</DialogTitle>
              <DialogTitle className='text-lg mb-2'>Project Details</DialogTitle>
              <div>
                <p>Department: {project.department}</p>
                <p>Created by: {creatorName} on {formatDateTime(project.created_date)}</p> 
                {approvalName && 
                  <p>Reviewed by: {approvalName} on {formatDateTime(project.approved_date)}</p>
                }
                {dispatcherName &&
                  <p>Dispatched by: {dispatcherName} on {formatDateTime(project.dispatched_date)}</p>
                }
                {project.activation_date &&
                  <p>Project activated on: {project.activation_date}</p>
                }
              </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className="bg-gray-300 p-4 rounded-xl text-sm max-h-48 overflow-y-auto">
        <ReactMarkdown className="markdown-content">
          {project.description}
        </ReactMarkdown>
      </div>

      <div className="flex items-center gap-10 text-white p-4 rounded-md justify-center">
      {/* Budget */}
      <div className=" relative flex flex-row items-center">
        <label className="text-base mr-2">Budget:</label>
        <div className="flex items-center">
          <span className="text-white font-medium">$</span>
          <input
            type="number"
            placeholder="Enter budget"
            name="project_budget"
            value={projectInfo.project_budget}
            onChange={(event) => onInputChange({ target: { name: event.target.name, value: event.target.value.replace(/[^0-9]/g, '') } })}
            className="ml-2 p-1 rounded-md text-black"
          />
        </div>
      </div>

      {/* Application Deadline */}
      <div className="relative flex flex-row items-center">
        <label className="text-base mr-2">Application deadline:</label>
        <div className="relative flex items-center">
          <DatePicker
            name="application_deadline"
            selected={projectInfo.application_deadline ? new Date(projectInfo.application_deadline) : null}
            onChange={(date) => onInputChange({ target: { name: 'application_deadline', value: date ? date.toISOString() : '' } })}
            dateFormat="MMM d, yyyy"
            placeholderText="Select a date"
            className="bg-white text-black px-2 py-1 rounded-md"
          />
          <Calendar className="h-6 w-6 text-black absolute right-2 pointer-events-none" />
        </div>
      </div>
    </div>

      <Button asChild>
        <Link href={`/Employee/Projects/${project.project_id}/Applicants`}>View Applicants</Link>
      </Button>
    </div>
  );
}
