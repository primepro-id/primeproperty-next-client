import { LeadsTable } from "./_components/leads-table";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold">LEADS</h1>

      <LeadsTable />
    </div>
  );
}
