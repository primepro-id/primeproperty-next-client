import { EditDeveloperFormCard } from "./_components/edit-developer-form-card";

type EditDeveloperPageProps = {
  params: Promise<{ developerId: string }>;
};

export default async function Page({ params }: EditDeveloperPageProps) {
  const { developerId } = await params;

  return <EditDeveloperFormCard developerId={developerId} />;
}
