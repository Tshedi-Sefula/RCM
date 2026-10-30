// Row types are `type` aliases (not interfaces) so they satisfy
// supabase-js's Record<string, unknown> constraint.
// Mirrors supabase/migrations. Keep in sync when the schema changes
// (or regenerate with `npx supabase gen types typescript`).
// Timestamps arrive as ISO strings; `date` columns as "YYYY-MM-DD".

export type CalendarCategory = "service" | "special" | "holiday" | "other";
export type StreamPlatform = "youtube" | "facebook";
export type ContactTopic = "general" | "prayer" | "visit";
export type ProfileRole = "pastor" | "admin";
// new → waiting for an admin to forward; forwarded → waiting for the pastor;
// replied → the pastor answered last; closed → finished.
export type ThreadStatus = "new" | "forwarded" | "replied" | "closed";
export type ReplySenderType = "pastor" | "user";

export type ChurchEvent = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  location: string | null;
  poster_url: string | null;
  is_featured: boolean;
  created_at: string;
};

export type CalendarEntry = {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  category: CalendarCategory;
  // "HH:MM:SS" in the church's local time; null for all-day entries.
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  caption: string | null;
  uploaded_at: string;
};

export type StreamVideo = {
  id: string;
  title: string;
  platform: StreamPlatform;
  video_id_or_url: string;
  is_memorable: boolean;
  stream_date: string | null;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  topic: ContactTopic;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type ContactThread = {
  id: string;
  ticket_id: string;
  sender_name: string;
  sender_email: string | null;
  sender_phone: string | null;
  topic: ContactTopic;
  original_message: string;
  status: ThreadStatus;
  assigned_pastor_id: string | null;
  created_at: string;
  last_activity_at: string;
};

export type ThreadReply = {
  id: string;
  thread_id: string;
  sender_type: ReplySenderType;
  sender_id: string | null;
  message: string;
  created_at: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: ProfileRole;
  is_admin: boolean;
  created_at: string;
};

export const STORAGE_BUCKETS = {
  eventPosters: "event-posters",
  gallery: "gallery",
} as const;

// Columns with database defaults are optional on insert.
type Insertable<Row, Optional extends keyof Row> = Omit<Row, Optional> & Partial<Pick<Row, Optional>>;

type Table<Row, InsertOptional extends keyof Row> = {
  Row: Row;
  Insert: Insertable<Row, InsertOptional>;
  Update: Partial<Row>;
  Relationships: [];
};

// Shape expected by the `Database` generic of @supabase/supabase-js.
export type Database = {
  public: {
    Tables: {
      events: Table<ChurchEvent, "id" | "description" | "location" | "poster_url" | "is_featured" | "created_at">;
      calendar_entries: Table<
        CalendarEntry,
        "id" | "end_date" | "description" | "category" | "start_time" | "end_time" | "location" | "created_at"
      >;
      gallery_images: Table<GalleryImage, "id" | "caption" | "uploaded_at">;
      stream_videos: Table<StreamVideo, "id" | "is_memorable" | "stream_date" | "created_at">;
      contact_messages: Table<ContactMessage, "id" | "email" | "phone" | "topic" | "is_read" | "created_at">;
      contact_threads: Table<
        ContactThread,
        | "id"
        | "ticket_id"
        | "sender_email"
        | "sender_phone"
        | "topic"
        | "status"
        | "assigned_pastor_id"
        | "created_at"
        | "last_activity_at"
      >;
      thread_replies: Table<ThreadReply, "id" | "sender_id" | "created_at">;
      profiles: Table<Profile, "full_name" | "email" | "role" | "is_admin" | "created_at">;
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: { Args: Record<string, never>; Returns: boolean };
      is_pastor: { Args: Record<string, never>; Returns: boolean };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
