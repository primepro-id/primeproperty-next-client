export type Lead = {
  id: number;
  user_id: string;
  property_id: number;
  created_at: string;
  updated_at: string;
  name: string;
  phone_number: string;
  email: string | null;
  is_deleted: boolean;
};
