export type Property = {
  id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  site_path: string;
  title: string;
  description: string;
  province: string;
  regency: string;
  street: string;
  gmap_iframe: string | null;
  price: number;
  images: PropertyImage[];
  purchase_status: PropertyPurchaseStatus;
  sold_status: PropertySoldStatus;
  measurements: PropertyMeasurements;
  building_type: string;
  building_condition: PropertyBuildingCondition;
  building_furniture_capacity: PropertyFurnitureCapacity;
  building_certificate: string;
  specifications: PropertySpecifications;
  facilities: PropertyFacilities[];
  is_deleted: boolean;
  sold_channel: PropertySoldChannel | null;
  configurations: PropertyConfigurations;
  currency: string;
  rent_time: PropertyRentTime | null;
  price_down_payment: number | null;
  description_seo: string | null;
};

export type PropertyImage = {
  path: string;
  is_cover: boolean;
  english_label: string;
  indonesian_label: string;
};

export enum PropertyPurchaseStatus {
  ForSale = "ForSale",
  ForRent = "ForRent",
  ForSaleOrRent = "ForSaleOrRent",
}

export enum PropertySoldStatus {
  Available = "Available",
  Sold = "Sold",
}

export type PropertyMeasurements = {
  building_area: number;
  building_level: number;
  land_area: number;
};

export enum PropertyBuildingCondition {
  New = "New",
  Good = "Good",
  Renovated = "Renovated",
  RenovationRequired = "RenovationRequired",
  Old = "Old",
}

export const PROPERTY_BUILDING_CONDITIONS = {
  [PropertyBuildingCondition.New]: "Baru",
  [PropertyBuildingCondition.Good]: "Bagus",
  [PropertyBuildingCondition.Renovated]: "Sudah Direnovasi",
  [PropertyBuildingCondition.RenovationRequired]: "Butuh Renovasi",
  [PropertyBuildingCondition.Old]: "Tua",
};

export enum PropertyFurnitureCapacity {
  Furnished = "Furnished",
  SemiFurnished = "SemiFurnished",
  Unfurnished = "Unfurnished",
}

export const PROPERTY_FURNITURE_CAPACITY = {
  [PropertyFurnitureCapacity.Furnished]: "Furnished",
  [PropertyFurnitureCapacity.SemiFurnished]: "Semi Furnished",
  [PropertyFurnitureCapacity.Unfurnished]: "Unfurnished",
};

export type PropertySpecifications = {
  bathrooms: number;
  bedrooms: number;
  carport: number;
  electrical_power: number;
  garage: number;
};

export type PropertyFacilities = {
  indonesian_label: string;
  value: string;
};

export enum PropertySoldChannel {
  Web = "Web",
  R123 = "R123",
  Socmed = "Socmed",
  Banner = "Banner",
  Others = "Others",
}

export type PropertyConfigurations = {
  is_popular?: boolean;
  is_njop_price?: boolean;
};

export enum PropertyCurrency {
  Idr = "Idr",
  Usd = "Usd",
}

export enum PropertyRentTime {
  Monthly = "Monthly",
  Yearly = "Yearly",
}

export type PropertyNavigation = {
  site_path: string;
  purchase_status: PropertyPurchaseStatus;
  building_type: string;
  province: string;
  regency: string;
  street: string;
};
