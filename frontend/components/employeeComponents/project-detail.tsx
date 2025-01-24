"use client"

import React from 'react'
import { useState } from 'react'
import { Project, Project_Status } from '@/utils/types'
import { Info } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import DatePicker from "react-datepicker"; // npm install react-datepicker AND date-fns
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [projStatus, setProjStatus] = useState<Project_Status>(project.status);
  const [teamSizeMin, setTeamSizeMin] = useState(3);
  const [teamSizeMax, setTeamSizeMax] = useState(5);

  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  function formatDateTime(raw_date: string | null): string{ 
    if (raw_date === null) return "N/A";
    date.plugin(timezone); // apply the plugin
    const dateTime = new Date(raw_date);

    const pattern = date.compile('MMM D, YYYY hh:mm z')
    const localDateTime = date.formatTZ(dateTime, pattern);
    console.log(localDateTime)

    return localDateTime;
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
        <ProjectStatusButton status={projStatus} onChangeStatus={setProjStatus} />
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
        {/* Team Size */}
        <div className=" relative flex flex-col">
          <label className="text-base mb-2">Team size:</label>
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Min"
                value={teamSizeMin}
                onChange={(e) => setTeamSizeMin(Number(e.target.value.replace(/[^0-9]/g, '')))}
                className="w-16 p-1 rounded-md text-black"
              />
            </div>
            <span className="text-white font-medium">-</span>
            <div className="flex flex-col">
              <input
                type="text"
                placeholder="Max"
                value={teamSizeMax}
                onChange={(e) => setTeamSizeMax(Number(e.target.value.replace(/[^0-9]/g, '')))} 
                className="w-16 p-1 rounded-md text-black"
              />
            </div>
          </div>
        </div>
      {/* Budget */}
      <div className=" relative flex flex-col">
        <label className="text-base mb-2">Budget:</label>
        <div className="flex items-center">
          <span className="text-white font-medium">$</span>
          <input
            type="number"
            placeholder="Enter budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
            className="ml-2 p-1 rounded-md text-black"
          />
        </div>
      </div>

      {/* Application Deadline */}
      <div className="relative flex flex-col">
        <label className="text-base mb-2">Application deadline:</label>
        <div className="relative flex items-center">
          <DatePicker
            selected={deadline}
            onChange={(date) => setDeadline(date)}
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
