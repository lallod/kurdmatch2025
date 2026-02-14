import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart } from 'lucide-react';
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
    <div className="px-4 py-2">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Heart className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-semibold text-foreground">Fans</span>
          <span className="text-[10px] text-muted-foreground">({fans.length})</span>
        </div>
        <button className="text-[10px] text-primary font-medium">See All</button>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
        {fans.map((fan) => (
          <button
            key={fan.id}
            onClick={() => navigate(`/profile/${fan.id}`)}
            className="flex flex-col items-center gap-1 min-w-[52px] active:scale-95 transition-transform"
          >
            <Avatar className="w-11 h-11 ring-2 ring-primary/20">
              <AvatarImage src={fan.profile_image} alt={fan.name} />
              <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                {fan.name?.[0]}
              </AvatarFallback>
            </Avatar>
            <span className="text-[9px] text-muted-foreground truncate max-w-[52px]">
              {fan.name?.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileFans;
