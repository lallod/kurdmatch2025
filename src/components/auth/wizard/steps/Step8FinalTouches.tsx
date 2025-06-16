
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Heart } from 'lucide-react';
import SimpleLocationSearch from '@/components/auth/components/enhanced-fields/SimpleLocationSearch';

interface Step8Data {
  dream_vacation?: string;
  ideal_date?: string;
}

interface Step8FinalTouchesProps {
  data: Step8Data;
  onChange: (data: Step8Data) => void;
}

export const Step8FinalTouches: React.FC<Step8FinalTouchesProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">A little bit more about you</h2>
        <p className="text-gray-600">These final touches will make your profile shine</p>
      </div>

      <div className="space-y-6">
        {/* Dream Vacation Destination */}
        <SimpleLocationSearch
          value={data.dream_vacation || ''}
          onChange={(value) => onChange({ ...data, dream_vacation: value })}
          placeholder="Where would you love to travel?"
        />

        {/* Ideal Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-purple-600" />
            <Label htmlFor="ideal_date" className="text-lg font-medium">Describe Your Ideal Date</Label>
          </div>
          <Textarea
            id="ideal_date"
            value={data.ideal_date || ''}
            onChange={(e) => onChange({ ...data, ideal_date: e.target.value })}
            placeholder="What would be your perfect date? Be creative and specific..."
            className="text-lg p-4 rounded-xl min-h-[100px] resize-none"
            rows={4}
          />
          <p className="text-sm text-gray-500">Help others imagine spending time with you</p>
        </div>
      </div>

      <div className="bg-purple-50 rounded-2xl p-6 text-center">
        <Sparkles className="w-8 h-8 text-purple-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Almost there!</h3>
        <p className="text-purple-700">You're about to complete your profile and unlock amazing connections!</p>
      </div>
    </div>
  );
};
