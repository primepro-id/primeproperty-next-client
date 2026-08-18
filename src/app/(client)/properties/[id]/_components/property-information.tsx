import {
  Property,
  PROPERTY_BUILDING_CONDITIONS,
  PROPERTY_FURNITURE_CAPACITY,
  PropertyPurchaseStatus,
} from "@/lib/types";

type KeyValueProps = {
  label: string;
  value: string;
};

const KeyValue = ({ label, value }: KeyValueProps) => {
  return (
    <div className="flex items-center gap-1">
      <p className="w-32 text-muted-foreground">{label}</p>
      <p>{value}</p>
    </div>
  );
};
type PropertyInformationProps = {
  property: Property;
};

export const PropertyInformation = ({ property }: PropertyInformationProps) => {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="uppercase font-sans">
        INFORMASI {property.building_type}{" "}
        {property.purchase_status === PropertyPurchaseStatus.ForSale
          ? "DIJUAL"
          : "DISEWA"}
      </h3>

      <div className="gap-2 flex flex-col  divide-y-2 capitalize">
        <KeyValue label="Tipe" value={property.building_type} />
        <KeyValue label="Sertifikat" value={property.building_certificate} />
        <KeyValue
          label="Kondisi"
          value={PROPERTY_BUILDING_CONDITIONS[property.building_condition]}
        />
        <KeyValue
          label="Luas Tanah"
          value={`${property.measurements.land_area} m²`}
        />
        <KeyValue
          label="Luas Bangunan"
          value={`${property.measurements.building_area} m²`}
        />

        {property.measurements.building_level > 0 && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Tinggi Bangunan</p>
            <p className="capitalize">
              {property.measurements.building_level} lantai
            </p>
          </div>
        )}
        {property.specifications.bedrooms > 0 && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Kamar Tidur</p>
            <p>{property.specifications.bedrooms}</p>
          </div>
        )}
        {property.specifications.bathrooms > 0 && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Kamar Mandi</p>
            <p>{property.specifications.bathrooms}</p>
          </div>
        )}
        {property.specifications.garage > 0 && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Garasi</p>
            <p>{property.specifications.garage} Mobil</p>
          </div>
        )}
        {property.specifications.carport > 0 && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Carport</p>
            <p>{property.specifications.carport} Mobil</p>
          </div>
        )}
        {property.specifications.electrical_power > 0 && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Daya Listrik</p>
            <p>
              {property.specifications.electrical_power.toLocaleString("id-ID")}{" "}
              Watt
            </p>
          </div>
        )}
        {property.building_furniture_capacity && (
          <div className="flex items-center gap-1">
            <p className="w-32 text-muted-foreground">Perabotan</p>
            <p className="capitalize">
              {
                PROPERTY_FURNITURE_CAPACITY[
                  property.building_furniture_capacity
                ]
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
