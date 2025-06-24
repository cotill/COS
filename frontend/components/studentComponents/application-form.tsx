"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, MinusCircle, Loader } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Application, Application_Status, Member, Project } from "@/utils/types";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/utils/supabase/client";

export interface TeamMember extends Omit<Member, "resume"> {
  resume: File | null;
}

interface ApplicationFormProp {
  extendedProject: Project & { sponsor_name: string | null };
  handleSubmitApplication: (application: Partial<Application>) => Promise<void>;
}
const minTeamSize = 2;
const maxTeamSize = 10;
const ttgWebsite = "https://www.tartigrade.ca/";
const MAX_CHAR_LIMIT = 250;

function constructFileName(project_id: number, id: number, fullname: string, resumeName: string): string {
  // Construct the filename using the generated applicationId
  return `${project_id}_${id}_${fullname}_${resumeName}`;
}
export default function ApplicationForm({ extendedProject, handleSubmitApplication }: ApplicationFormProp) {
  const [teamName, setTeamName] = useState("");
  const [course, setCourse] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([
    {
      full_name: "",
      email: "",
      major: "",
      resume: null,
      role: null,
    },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [teamDescription, setTeamDescription] = useState({
    value: "",
    charCount: 0,
  });

  //manage button
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0] || null;
    if (file && !["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type)) {
      setError("Invalid file type. Please upload a PDF, DOC, or DOCX file.");
      setTimeout(() => {
        setError(null);
      }, 3000);

      updateMember(index, "resume", null);
    } else {
      setError(null);
      updateMember(index, "resume", file);
    }
  };

  useEffect(() => {
    if (members.length < minTeamSize) {
      const newMembers = [...members];
      for (let i = members.length; i < minTeamSize; i++) {
        newMembers.push({
          full_name: "",
          email: "",
          major: "",
          resume: null,
          role: null,
        });
      }
      setMembers(newMembers);
    }
  }, []);

  const addMember = () => {
    if (members.length < maxTeamSize) {
      setMembers([
        ...members,
        {
          full_name: "",
          email: "",
          major: "",
          resume: null,
          role: null,
        },
      ]);
    }
  };

  const removeMember = (index: number) => {
    if (members.length > minTeamSize) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    } else {
      setError(`Team must have at least ${minTeamSize} members`);
    }
  };

  const updateMember = async (index: number, field: keyof TeamMember, value: string | File | null) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let val = e.target.value;
    if (val.length > MAX_CHAR_LIMIT) {
      val = val.substring(0, MAX_CHAR_LIMIT);
    }
    setTeamDescription({ value: val, charCount: val.length });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true); // Set submitting state to true

    if (members.length < minTeamSize) {
      setError(`Team must have at least ${minTeamSize} members`);
      return;
    }
    if (!course) {
      setError("Please enter your course");
      return;
    }

    const id = Math.floor(100 + Math.random() * 900); // Generate a number between 100 and 999

    const application: Partial<Application> = {
      project_id: extendedProject.project_id,
      team_name: teamName,
      size: members.length,
      university: extendedProject.university || null,
      members: members.map((member, index) => ({
        full_name: member.full_name,
        email: member.email,
        role: index === 0 ? "Team Manager" : "Team Member",
        major: member.major,
        resume: constructFileName(extendedProject.project_id, id, member.full_name, member.resume?.name || ""), // save the file name
      })),
      about_us: teamDescription.value,
      course: course,
    };
    await uploadResumes(id);

    await handleSubmitApplication(application);
    setIsSubmitting(false); // Reset submitting state regardless of outcome
  };

  const uploadResumes = async (id: number) => {
    const supabase = createClient();

    const uploadResumePromises = members.map(async (mem) => {
      if (!mem.resume) return; // if theres no resume, skip
      const filename = constructFileName(extendedProject.project_id, id, mem.full_name, mem.resume?.name || "");
      const { data, error } = await supabase.storage.from("applicants_resumes").upload(filename, mem.resume);
      if (error) {
        alert(`Error uploading ${mem.full_name} resume. Please contact TTG sponsor`);
        console.log("resume upload error: ", error.message);
      }
    });

    await Promise.all(uploadResumePromises); //upload all in parallel
  };
  const getDate = () => {
    return extendedProject.application_deadline ? new Date(extendedProject.application_deadline).toLocaleDateString("en-US") : "No deadline specified";
  };
  return (
    <>
      <div className="mb-8 text-center text-white">
        <Image src="/ttg-logo.png" alt="Tartigrade Limited" width={300} height={60} className="mx-auto mb-4" />
      </div>
      <Card className="mx-auto max-w-4xl [_&]: text-white">
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-lg bg-muted mt-4 p-4 bg-[#1F2937]">
              <h2 className="font-bold text-2xl">{extendedProject.title}</h2>
              <h3 className="my-2 font-semibold">Project Details</h3>
              <div className="max-h-48 overflow-y-auto scrollbar border border-gray-300 p-2 rounded-sm">
                <ReactMarkdown>{extendedProject.description}</ReactMarkdown>
              </div>
              <div className="mt-2 grid  sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Website:</span> {ttgWebsite}
                </div>
                <div>
                  <span className="font-medium">Department:</span> {extendedProject.department}
                </div>
                {extendedProject.application_deadline && (
                  <div>
                    <span className="font-medium">Application Deadline:</span> {getDate()}
                  </div>
                )}
                <div>
                  <span className="font-medium">Team Size:</span> {minTeamSize} - {maxTeamSize} members
                </div>
                <div>
                  <span className="font-medium">University:</span> {extendedProject.university}
                </div>
                <div>
                  <span className="font-medium">Sponsor:</span> {extendedProject.sponsor_name} <span className="underline">({extendedProject.sponsor_email})</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Team Name</Label>
              <Input id="teamName" value={teamName} onChange={(e) => setTeamName(e.target.value)} required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamName">Course</Label>
              <Input id="course" value={course} onChange={(e) => setCourse(e.target.value)} required />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Team Members</h3>
                <Button type="button" variant="outline" size="sm" onClick={addMember} disabled={members.length >= maxTeamSize}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Member
                </Button>
              </div>

              {members.map((member, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="grid gap-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{index === 0 ? "Team Manager" : `Team Member ${index}`}</h4>
                        {index !== 0 && members.length > minTeamSize && (
                          <Button type="button" variant="ghost" size="sm" onClick={() => removeMember(index)}>
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${index}`}>Full Name</Label>
                          <Input id={`name-${index}`} value={member.full_name} onChange={(e) => updateMember(index, "full_name", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>Email</Label>
                          <Input id={`email-${index}`} value={member.email} onChange={(e) => updateMember(index, "email", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`major-${index}`}>Major</Label>
                          <Input id={`major-${index}`} value={member.major} onChange={(e) => updateMember(index, "major", e.target.value)} required />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`resume-${index}`}>Resume</Label>
                          <Input
                            id={`resume-${index}`}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, index)}
                            className=" text-white file:border-0 file:bg-white file:text-black file:hover:bg-gray-100"
                          />
                          {member.resume && <p className="text-sm text-muted-foreground">{member.resume.name}</p>}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            {/* Team Description */}
            <div className="space-y-2">
              <h4 className="text-white">Tell us about your team</h4>
              <Textarea
                id="teamDescription"
                value={teamDescription.value}
                onChange={handleDescriptionChange}
                placeholder="We are a group of students..."
                className="min-h-[7.5rem] border-gray-700 bg-[#1F2937] text-white"
                required
              />
              <p className={`text-sm ${teamDescription.charCount === MAX_CHAR_LIMIT ? "text-red-500" : "text-white"}`}>
                {teamDescription.charCount}/{MAX_CHAR_LIMIT} characters
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle className="text-red-600">Error</AlertTitle>
                <AlertDescription className="text-red-600">{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full bg-white text-black hover:bg-gray-300 hover:border border-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader className="w-3 h-3 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>Submit Application</>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
