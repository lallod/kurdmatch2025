
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  User, 
  Heart, 
  Coffee, 
  Brain, 
  Star, 
  Activity, 
  Scroll 
} from 'lucide-react';

interface CategoryItemProps {
  icon: React.ReactNode;
  name: string;
  count: number;
  color: string;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ icon, name, count, color }) => (
  <div className="flex items-center p-2 rounded-lg hover:bg-secondary/50 cursor-pointer">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="ml-3 flex-1">
      <p className="text-sm font-medium">{name}</p>
    </div>
    <div className="bg-secondary rounded-full w-6 h-6 flex items-center justify-center">
      <span className="text-xs">{count}</span>
    </div>
  </div>
);

const QuestionCategoriesSection = () => {
  // Sample category data
  const categories = [
    { 
      icon: <User size={16} />, 
      name: 'Basics', 
      count: 12, 
      color: 'bg-blue-100 text-blue-700' 
    },
    { 
      icon: <Heart size={16} />, 
      name: 'Relationships', 
      count: 8, 
      color: 'bg-red-100 text-red-700' 
    },
    { 
      icon: <Coffee size={16} />, 
      name: 'Lifestyle', 
      count: 10, 
      color: 'bg-amber-100 text-amber-700' 
    },
    { 
      icon: <Scroll size={16} />, 
      name: 'Beliefs', 
      count: 6, 
      color: 'bg-purple-100 text-purple-700' 
    },
    { 
      icon: <Brain size={16} />, 
      name: 'Personality', 
      count: 5, 
      color: 'bg-indigo-100 text-indigo-700' 
    },
    { 
      icon: <Star size={16} />, 
      name: 'Interests', 
      count: 9, 
      color: 'bg-green-100 text-green-700' 
    },
    { 
      icon: <Activity size={16} />, 
      name: 'Physical', 
      count: 4, 
      color: 'bg-orange-100 text-orange-700' 
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            icon={category.icon}
            name={category.name}
            count={category.count}
            color={category.color}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionCategoriesSection;
