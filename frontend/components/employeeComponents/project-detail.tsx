"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
interface ProjectDetailProps{
  project: {
    id: string;
    name: string;
    description: string;
  }
}

export default function ProjectDetail({project} : ProjectDetailProps) {
  return (
    <div>
        <Button asChild>
            <Link href={`/Employee/Projects/${project.id}/Applicants`}>View Applicants</Link>
        </Button>
    </div>
  )
}
