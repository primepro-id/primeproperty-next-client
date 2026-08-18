import {
  LuWifi,
  LuSchool,
  LuTrees,
  LuPhone,
  LuCctv,
  LuClock,
  LuChurch,
  LuCircleParking, // Fixed from LuCircleParking
} from "react-icons/lu";
import {
  TbAirConditioning,
  TbHanger,
  TbMoodKid,
  TbPlayFootball,
} from "react-icons/tb";
import { FaFish, FaPersonSwimming, FaPersonRunning } from "react-icons/fa6";
import { MdOutlineLocalLaundryService } from "react-icons/md";
import { GiSecurityGate } from "react-icons/gi";

export enum Facility {
  WIFI = "wifi",
  School = "school",
  University = "university",
  Taman = "Taman",
  TamanBermain = "Taman Bermain",
  Teras = "Teras",
  JalurTelepon = "Jalur Telepon",
  AC = "AC",
  KolamRenang = "Kolam Renang",
  KolamIkan = "Kolam Ikan",
  CCTV = "CCTV",
  Backyard = "Backyard",
  Keamanan24 = "Keamanan 24 Jam",
  TempatCuci = "Tempat Cuci",
  TempatJemuran = "Tempat Jemuran",
  TempatLaundry = "Tempat Laundry",
  TempatIbadah = "Tempat Ibadah",
  JoggingTrack = "Jogging Track",
  AksesParkir = "Akses Parkir",
  OneGateSystem = "One Gate System",
}

export const FACILITY_ICON = {
  [Facility.WIFI]: <LuWifi />,
  [Facility.School]: <LuSchool />,
  [Facility.University]: <LuSchool />,
  [Facility.Taman]: <LuTrees />,
  [Facility.TamanBermain]: <TbMoodKid />,
  [Facility.Teras]: <TbPlayFootball />,
  [Facility.JalurTelepon]: <LuPhone />,
  [Facility.AC]: <TbAirConditioning />,
  [Facility.KolamRenang]: <FaPersonSwimming />,
  [Facility.KolamIkan]: <FaFish />,
  [Facility.CCTV]: <LuCctv />,
  [Facility.Backyard]: <TbPlayFootball />,
  [Facility.Keamanan24]: <LuClock />,
  [Facility.TempatCuci]: <MdOutlineLocalLaundryService />,
  [Facility.TempatJemuran]: <TbHanger />,
  [Facility.TempatLaundry]: <MdOutlineLocalLaundryService />,
  [Facility.TempatIbadah]: <LuChurch />,
  [Facility.JoggingTrack]: <FaPersonRunning />,
  [Facility.AksesParkir]: <LuCircleParking/>, // Fixed from LuCircleParking
  [Facility.OneGateSystem]: <GiSecurityGate />,
};
