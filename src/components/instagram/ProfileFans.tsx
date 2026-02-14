import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Fan {
  id: string;
  name: string;
  profile_image: string;
}

interface ProfileFansProps {
  userId: string;
}

const ProfileFans: React.FC<ProfileFansProps> = ({ userId }) => {
  const [fans, setFans] = useState<Fan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFans = async () => {
      // Fans = people who follow this user (followers)
      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower_id,
          profiles:follower_id (id, name, profile_image)
        `)
        .eq('following_id', userId)
        .limit(20);

      if (!error && data) {
        const fanProfiles = data
          .map((f: any) => f.profiles)
          .filter(Boolean);
        setFans(fanProfiles);
      }
    };
    fetchFans();
  }, [userId]);

  if (fans.length === 0) return null;

  return (
    <div className="px-4 py-3">
      <div className="bg-card rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">Fans</span>
            <span className="text-xs text-muted-foreground">({fans.length})</span>
          </div>
          <button className="text-xs text-primary font-medium">See All</button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {fans.map((fan) => (
            <button
              key={fan.id}
              onClick={() => navigate(`/profile/${fan.id}`)}
              className="flex flex-col items-center gap-1 min-w-[56px] active:scale-95 transition-transform"
            >
              <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                <AvatarImage src={fan.profile_image} alt={fan.name} />
                <AvatarFallback className="text-xs bg-muted text-muted-foreground">
                  {fan.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <span className="text-[10px] text-muted-foreground truncate max-w-[56px]">
                {fan.name?.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileFans;
