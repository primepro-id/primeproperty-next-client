import { EditPropertyFormCard } from "./_components/edit-property-form-card";

type EditPropertyPageProps = {
  params: Promise<{ propertyId: string }>;
};

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  const { propertyId } = await params;
  return <EditPropertyFormCard propertyId={propertyId} />;
}
