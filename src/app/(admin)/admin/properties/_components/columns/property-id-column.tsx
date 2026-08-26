type PropertyIdColumnProps = {
  propertyId: number;
};

export function PropertyIdColumn({ propertyId }: PropertyIdColumnProps) {
  return <span className="font-medium">{propertyId}</span>;
}
