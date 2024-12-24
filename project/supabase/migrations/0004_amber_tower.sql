/*
  # Add movie genres
  
  1. Changes
    - Inserts predefined movie genres into the categories table
    
  2. Genres Added
    - Standard movie genres like Action, Adventure, Comedy, etc.
    - Special genres like Noir, Superhero, Experimental
    - Documentary and non-fiction categories
*/

INSERT INTO categories (name, slug, description) VALUES
  ('Action', 'action', 'High-energy films with combat, chases, and stunts'),
  ('Adventure', 'adventure', 'Epic journeys and exciting quests'),
  ('Comedy', 'comedy', 'Films focused on humor and entertainment'),
  ('Drama', 'drama', 'Character-driven emotional narratives'),
  ('Fantasy', 'fantasy', 'Magical and supernatural stories'),
  ('Horror', 'horror', 'Scary and suspenseful content'),
  ('Mystery', 'mystery', 'Puzzling plots and investigations'),
  ('Romance', 'romance', 'Love stories and relationships'),
  ('Science Fiction', 'sci-fi', 'Futuristic and technological themes'),
  ('Thriller', 'thriller', 'Suspenseful and intense narratives'),
  ('Western', 'western', 'Stories of the American frontier'),
  ('Animated', 'animated', 'Animation in various styles'),
  ('Biography', 'biography', 'Stories about real people'),
  ('Documentary', 'documentary', 'Non-fiction educational content'),
  ('Historical', 'historical', 'Based on historical events'),
  ('Musical', 'musical', 'Features song and dance'),
  ('Crime', 'crime', 'Stories involving criminal activities'),
  ('War', 'war', 'Military and conflict-based narratives'),
  ('Sports', 'sports', 'Athletic competition and achievement'),
  ('Family', 'family', 'Content suitable for all ages'),
  ('Noir', 'noir', 'Dark, stylized crime dramas'),
  ('Superhero', 'superhero', 'Comic book and superhero content'),
  ('Experimental', 'experimental', 'Avant-garde and artistic films'),
  ('Psychological', 'psychological', 'Mind-bending psychological narratives'),
  ('Slasher', 'slasher', 'Horror featuring serial killers')
ON CONFLICT (slug) DO NOTHING;