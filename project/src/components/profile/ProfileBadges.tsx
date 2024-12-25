import { Award, Star, Trophy, Target } from 'lucide-react';

interface Badge {
  icon: React.ReactNode;
  name: string;
  description: string;
  earned: boolean;
}

export function ProfileBadges() {
  const badges: Badge[] = [
    {
      icon: <Award className="w-6 h-6" />,
      name: "Creator",
      description: "Upload your first video",
      earned: true,
    },
    {
      icon: <Star className="w-6 h-6" />,
      name: "Influencer",
      description: "Reach 100 likes on your videos",
      earned: false,
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      name: "Cinephile",
      description: "Watch 24 hours of content",
      earned: false,
    },
    {
      icon: <Target className="w-6 h-6" />,
      name: "Engaged",
      description: "Comment on 10 different videos",
      earned: true,
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Badges</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.name}
            className={`p-4 rounded-lg text-center ${
              badge.earned ? 'bg-purple-900/50' : 'bg-gray-800'
            }`}
          >
            <div className={`inline-block p-2 rounded-full mb-2 ${
              badge.earned ? 'text-purple-400' : 'text-gray-400'
            }`}>
              {badge.icon}
            </div>
            <h3 className="font-medium mb-1">{badge.name}</h3>
            <p className="text-sm text-gray-400">{badge.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}