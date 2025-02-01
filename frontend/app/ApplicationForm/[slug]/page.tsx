export default async function ApplicationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const application_id = (await params).slug;
  return <p className="text-white">application id: {application_id}</p>;
}
