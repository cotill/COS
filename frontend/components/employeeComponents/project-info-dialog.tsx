"use client";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect, useCallback } from "react";
import { Project } from "@/utils/types";
import { createClient } from "@/utils/supabase/client";

interface ProjectInfoDialogProps {
  currentProject: Project;
}
import date from "date-and-time"; //npm i date-and-time
import timezone from "date-and-time/plugin/timezone"; //// Import plugin for date-time for more tokens

function formatDateTime(raw_date: string | null): string {
  if (raw_date === null) return "N/A";
  date.plugin(timezone); // apply the plugin
  const dateTime = new Date(raw_date);

  const pattern = date.compile("MMM D, YYYY hh:mm z");
  const localDateTime = date.formatTZ(dateTime, pattern);

  return localDateTime;
}

function ProjectInfoDialog({ currentProject }: ProjectInfoDialogProps) {
  const [projectLog, setProjectLog] = useState<{
    creatorName: string | null;
    approver: string | null;
    modifier: string | null;
    dispatcher: string | null;
    rejector: string | null;
    activator: string | null;
    concluder: string | null;
  }>({
    creatorName: null,
    approver: null,
    modifier: null,
    dispatcher: null,
    rejector: null,
    activator: null,
    concluder: null,
  });

  const supabase = createClient();

  const updateProjectLog = ({ name, value }: { name: string; value: string | null }) => {
    setProjectLog({ ...projectLog, [name]: value });
  };

  const getEmployeeNameByEmail = useCallback(async (query_email: string): Promise<string> => {
    const { data, error } = await supabase
      .from("Employees")
      .select("*")
      .eq("email", query_email)
      .single();
    const name: string | null | undefined = data?.full_name;
    if (name === null || name === undefined || error || name.length === 0) {
      return "N/A";
    }
    return name;
  }, []);

  useEffect(() => {
    const fetchProjectLogs = async () => {
      const promises = [
        currentProject.creator_email
          ? getEmployeeNameByEmail(currentProject.creator_email)
          : Promise.resolve(null),
        currentProject.approval_email
          ? getEmployeeNameByEmail(currentProject.approval_email)
          : Promise.resolve(null),
        currentProject.last_modified_user
          ? getEmployeeNameByEmail(currentProject.last_modified_user)
          : Promise.resolve(null),
        currentProject.dispatcher_email
          ? getEmployeeNameByEmail(currentProject.dispatcher_email)
          : Promise.resolve(null),
        currentProject.rejector_email
          ? getEmployeeNameByEmail(currentProject.rejector_email)
          : Promise.resolve(null),
        currentProject.activation_email
          ? getEmployeeNameByEmail(currentProject.activation_email)
          : Promise.resolve(null),
        currentProject.completion_email
          ? getEmployeeNameByEmail(currentProject.completion_email)
          : Promise.resolve(null),
      ];

      const [creatorName, approver, modifier, dispatcher, rejector, activator, concluder] = await Promise.all(promises);

      setProjectLog({ creatorName, approver, modifier, dispatcher, rejector, activator, concluder });
    };

    fetchProjectLogs();
  }, [
    currentProject.creator_email,
    currentProject.approval_email,
    currentProject.last_modified_user,
    currentProject.dispatcher_email,
    currentProject.activation_email,
    currentProject.completion_email,
  ]);

  return (
    <>
      <DialogContent className="bg-[#1D1B23] text-white" aria-describedby="projectInfoDialog">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">{currentProject.title}</DialogTitle>
          <DialogTitle className="text-lg mb-2">Project Details</DialogTitle>
          <div>
            <p>Department: {currentProject.department}</p>
            <p>
              Created by: {projectLog.creatorName} on {formatDateTime(currentProject.created_date)}
            </p>
            {projectLog.approver && (
              <p>
                Approved by: {projectLog.approver} on {formatDateTime(currentProject.approved_date)}
              </p>
            )}
            {projectLog.dispatcher && (
              <p>
                Dispatched by: {projectLog.dispatcher} on{" "}
                {formatDateTime(currentProject.dispatched_date)}
              </p>
            )}
            {currentProject.activation_date && (
              <p>Project activated on: {currentProject.activation_date}</p>
            )}
            {projectLog.modifier && (
              <p>
                Last modified by: {projectLog.modifier} on{" "}
                {formatDateTime(currentProject.last_modified_date)}
              </p>
            )}
            {projectLog.rejector && (
              <p>
                Rejected by: {projectLog.rejector} on {formatDateTime(currentProject.rejector_date)}
              </p>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </>
  );
}

export default ProjectInfoDialog;
