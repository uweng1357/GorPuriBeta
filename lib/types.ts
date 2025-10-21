// Interface untuk User
export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

// Interface untuk Field
export interface Field {
  id: number;
  name: string;
  description: string;
  location: string;
  price_per_hour: number;
  image_url?: string;
  facilities: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// Interface untuk Reservation
export interface Reservation {
  id: number;
  user_id: number;
  field_id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'refunded';
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

// Interface untuk Field Schedule
export interface FieldSchedule {
  id: number;
  field_id: number;
  day_of_week: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  start_time: string;
  end_time: string;
  is_available: boolean;
}
