import { Message } from "@/components/form-message";

export default async function ApplicationSuccess(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  // return <div>{searchParams ? <pre className="text-gray-100 p-4">{JSON.stringify(searchParams, null, 2)}</pre> : <p>No application data available.</p>}</div>;
  return (
    <div>
      <div className="max-w-md text-sm items-center justify-center mt-20 mx-auto text-center">
        {"success" in searchParams && <div className="bg-green-100 text-green-700 border-l-4 border-green-500 px-4 py-2 rounded">{searchParams.success}</div>}
        {"error" in searchParams && <div className="bg-red-100 text-red-700 border-l-4 border-red-500 px-4 py-2 rounded">{searchParams.error}</div>}
        {"message" in searchParams && <div className="bg-gray-100 text-gray-700 border-l-4 border-gray-500 px-4 py-2 rounded">{searchParams.message}</div>}
      </div>
    </div>
  );
}
