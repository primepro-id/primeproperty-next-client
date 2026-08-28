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
  building_furniture_capacity: PropertyFurnitureCapacity | null;
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

export const BUILDING_TYPES = [
  "rumah",
  "apartemen",
  "ruko",
  "tanah",
  "gudang",
  "gedung",
  "hotel",
  "kios",
  "pabrik",
  "ruang usaha",
  "rumah kantor",
  "space kantor",
  "space mall",
  "toko",
  "villa",
];

export const BUILDING_CERTIFICATES = [
  "shm",
  "hgb",
  "hak pakai",
  "hak sewa",
  "hgu",
  "adat",
  "girik",
  "ppjb",
  "strata",
  "lainnya",
];

export const FACILITIES: PropertyFacilities[] = [
  {
    value: "wifi",
    indonesian_label: "wifi",
  },
  {
    value: "school",
    indonesian_label: "Sekolah",
  },
  {
    value: "university",
    indonesian_label: "Universitas",
  },
  {
    value: "AC",
    indonesian_label: "AC",
  },
  {
    value: "Akses Parkir",
    indonesian_label: "Akses Parkir",
  },
  {
    value: "Backyard",
    indonesian_label: "Backyard",
  },
  {
    value: "CCTV",
    indonesian_label: "CCTV",
  },
  {
    value: "Jalur Telepon",
    indonesian_label: "Jalur Telepon",
  },
  {
    value: "Jogging Track",
    indonesian_label: "Jogging Track",
  },
  {
    value: "Keamanan 24 Jam",
    indonesian_label: "Keamanan 24 Jam",
  },
  {
    value: "Kolam Ikan",
    indonesian_label: "Kolam Ikan",
  },
  {
    value: "Kolam Renang",
    indonesian_label: "Kolam Renang",
  },
  {
    value: "One Gate System",
    indonesian_label: "One Gate System",
  },
  {
    value: "Taman",
    indonesian_label: "Taman",
  },
  {
    value: "Taman Bermain",
    indonesian_label: "Taman Bermain",
  },
  {
    value: "Tempat Cuci",
    indonesian_label: "Tempat Cuci",
  },
  {
    value: "Tempat Ibadah",
    indonesian_label: "Tempat Ibadah",
  },
  {
    value: "Tempat Jemuran",
    indonesian_label: "Tempat Jemuran",
  },
  {
    value: "Tempat Laundry",
    indonesian_label: "Tempat Laundry",
  },
  {
    value: "Teras",
    indonesian_label: "Teras",
  },
];

export const PROPERTY_IMAGE_TAGS = [
  {
    english_label: "Living Room",
    indonesian_label: "Ruang Tamu",
  },
  {
    english_label: "Dining Room",
    indonesian_label: "Ruang Makan",
  },
  {
    english_label: "Bedroom",
    indonesian_label: "Kamar Tidur",
  },
  {
    english_label: "Bathroom",
    indonesian_label: "Kamar Mandi",
  },
  {
    english_label: "Front View",
    indonesian_label: "Tampak Depan",
  },
  {
    english_label: "Back View",
    indonesian_label: "Halaman Belakang",
  },
  {
    english_label: "Garden",
    indonesian_label: "Taman",
  },
  {
    english_label: "Swimming Pool",
    indonesian_label: "Kolam Renang",
  },
  {
    english_label: "Garage/Carport",
    indonesian_label: "Garasi/Carport",
  },
  {
    english_label: "Others",
    indonesian_label: "Ruang Lainnya",
  },
];
