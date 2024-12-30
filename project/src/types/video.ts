export interface Video {
  id: string;
  title: string;
  description: string | null;
  synopsis: string | null;
  thumbnail_url: string | null;
  video_url: string;
  category_id: string;
  views: number;
  created_at: string;
  updated_at: string;
  quality_levels: string[];
  available_subtitles: {
    language: string;
    url: string;
  }[];
  rating: number;
  rating_count: number;
  category: {
    name: string;
  };
}