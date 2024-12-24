import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { FavoritesList } from '@/components/profile/FavoritesList';
import { WatchHistory } from '@/components/profile/WatchHistory';

export function Profile() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="space-y-8">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <FavoritesList />
        <WatchHistory />
      </div>
    </div>
  );
}