import { Properties } from "../../../_components/properties";
import { parseFilterParams } from "../../../_lib/parse-filter-params";

type PropertiesFilterPageContentProps = {
  params: Promise<{ params: string[] }>;
};

export const PropertiesFilterPageContent = async ({
  params,
}: PropertiesFilterPageContentProps) => {
  const pageParams = await params;

  return (
    <Properties
      searchParams={parseFilterParams(pageParams.params)}
      path={`/properties/filter/${pageParams.params.join("/")}`}
    />
  );
};
