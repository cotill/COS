"use client"

import React from 'react'
import { useState } from 'react'
import { Project } from '@/utils/types'
import { Info } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import { ArrowRightCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import date from 'date-and-time'; //npm i date-and-time
import timezone from 'date-and-time/plugin/timezone'; //// Import plugin for date-time for more tokens



interface ProjectDetailProps{
  project: Project,
  creatorName: string | null,
  approvalName: string | null,
  dispatcherName: string | null,
}

export default function ProjectDetail({project, creatorName, approvalName, dispatcherName } : ProjectDetailProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
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

        <button className="bg-white text-black px-4 py-1 rounded-full flex items-center space-x-2">
          <span>{project.status}</span>
          <span className="mx-2">|</span>
          <ArrowRightCircle size={20} />
          {/* button will be white... idk how to make it change based on what the status is */}
        </button>
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

      {/* <Button asChild>
        <Link href={`/Employee/Projects/${project.project_id}/Applicants`}>View Applicants</Link>
      </Button> */}
    </div>
  );
}
