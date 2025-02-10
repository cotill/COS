"use client";
import { FormMessage, Message } from "@/components/form-message";

export default async function ApplicationSuccess(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;

  return (
    <div>
      <h1>Application Submitted Successfully</h1>
      {searchParams ? <pre className="bg-gray-100 p-4">{JSON.stringify(searchParams, null, 2)}</pre> : <p>No application data available.</p>}
    </div>
  );
}
