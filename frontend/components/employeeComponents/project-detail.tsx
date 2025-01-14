"use client"

import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Project } from '@/utils/types'
import { Info } from 'lucide-react';
import ReactMarkdown from "react-markdown";
import { ArrowRightCircle } from 'lucide-react'



interface ProjectDetailProps{
  project: Project
}

export default function ProjectDetail({project} : ProjectDetailProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const handleOpenPopup = () => setIsPopupOpen(true);
  const handleClosePopup = () => setIsPopupOpen(false);

  return (
    <div className='relative'>
      <div className="flex items-center justify-between mb-4 py-2">
        <div className="flex items-center space-x-0.5">
          <h1 className="text-xl font-bold text-white px-2">Project Description</h1>
          <button
            onClick={handleOpenPopup}
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


      {isPopupOpen && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white rounded-lg p-6 w-80 shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">{project.title}</h2>
            <button
              onClick={handleClosePopup}
              className="text-red-500 hover:text-red-700"
              aria-label="Close"
            >
              ✕
            </button>
          </div>

          
          <div className="mt-4 text-sm">
            <h3 className="font-bold mb-2">Project Detail</h3>
            <p>Department: {project.department}</p>
            <p>Created by: {project.creator_email} on {project.created_date}</p> 
            <p>Reviewed by: uhh </p>
            <p>Dispatched by: uhhh</p>
            <p>Project activated on: {project.activation_date || "uhh"}</p>
          </div>
        </div>
      </div>
      )}

      <div className="bg-gray-300 p-4 rounded-xl text-sm max-h-48 overflow-y-auto">
        <ReactMarkdown className="markdown-content">
          {project.description}
        </ReactMarkdown>
      </div>

      
      
      {/* <Button asChild>
        <Link href={`/Employee/Projects/${project.project_id}/Applicants`}>View Applicants</Link>
      </Button> */}
     
    </div>
  )
}
