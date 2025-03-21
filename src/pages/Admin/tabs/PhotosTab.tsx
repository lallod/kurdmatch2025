
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Image, Sparkles, Brain } from 'lucide-react';

const PhotosTab = () => {
  return (
    <Card className="neo-card bg-white/80">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Image size={20} className="mr-2 text-tinder-rose" />
          <span>Photo Gallery</span>
        </CardTitle>
        <CardDescription>Manage profile photos. AI will suggest the best photo order.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1598897516650-e4dc73d8e417?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
          ].map((photo, index) => (
            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-gray-100 border neo-border">
              <img 
                src={photo} 
                alt={`Gallery image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button variant="outline" size="icon" className="bg-black/20 border-white/20 text-white hover:bg-black/40 hover:text-white">
                  <Image size={16} />
                </Button>
              </div>
              {index === 0 && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-tinder-rose to-tinder-orange text-white text-xs px-2 py-1 rounded-full flex items-center">
                  <Sparkles size={10} className="mr-1" />
                  AI Recommended
                </div>
              )}
            </div>
          ))}
          <div className="aspect-square rounded-lg border-2 border-dashed flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer neo-border">
            <div className="flex flex-col items-center text-gray-500">
              <Image size={24} className="mb-2" />
              <span className="text-sm">Add Photo</span>
            </div>
          </div>
        </div>
        <div className="mt-4 w-full py-2 px-3 rounded-md bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 flex items-center">
          <Brain size={18} className="text-tinder-rose mr-2" />
          <p className="text-xs text-gray-600">AI analysis shows your first photo gets 62% more matches than others</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotosTab;
