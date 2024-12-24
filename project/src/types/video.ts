export interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string;
  category_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  category: {
    name: string;
  };
}