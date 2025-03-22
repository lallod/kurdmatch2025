
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
import { useQuestions } from './useQuestions';
import { getCategoryCount } from './utils/questionUtils';

interface CategoryItemProps {
  icon: React.ReactNode;
  name: string;
  count: number;
  color: string;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ icon, name, count, color, onClick }) => (
  <div 
    className="flex items-center p-2 rounded-lg hover:bg-secondary/50 cursor-pointer"
    onClick={onClick}
  >
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
  const { questions, setActiveTab } = useQuestions();
  
  // Map category names to their icon, color, and tab value
  const categories = [
    { 
      icon: <User size={16} />, 
      name: 'Basics', 
      count: getCategoryCount(questions, 'Basics'), 
      color: 'bg-blue-100 text-blue-700',
      tabValue: 'basic'
    },
    { 
      icon: <Heart size={16} />, 
      name: 'Relationships', 
      count: getCategoryCount(questions, 'Relationships'), 
      color: 'bg-red-100 text-red-700',
      tabValue: 'relationships'
    },
    { 
      icon: <Coffee size={16} />, 
      name: 'Lifestyle', 
      count: getCategoryCount(questions, 'Lifestyle'), 
      color: 'bg-amber-100 text-amber-700',
      tabValue: 'lifestyle'
    },
    { 
      icon: <Scroll size={16} />, 
      name: 'Beliefs', 
      count: getCategoryCount(questions, 'Beliefs'), 
      color: 'bg-purple-100 text-purple-700',
      tabValue: 'beliefs'
    },
    { 
      icon: <Brain size={16} />, 
      name: 'Personality', 
      count: getCategoryCount(questions, 'Personality'), 
      color: 'bg-indigo-100 text-indigo-700',
      tabValue: 'personality'
    },
    { 
      icon: <Star size={16} />, 
      name: 'Interests', 
      count: getCategoryCount(questions, 'Interests'), 
      color: 'bg-green-100 text-green-700',
      tabValue: 'interests'
    },
    { 
      icon: <Activity size={16} />, 
      name: 'Physical', 
      count: getCategoryCount(questions, 'Physical'), 
      color: 'bg-orange-100 text-orange-700',
      tabValue: 'physical'
    },
  ];

  // Total questions count
  const totalQuestions = questions.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div 
          className="flex items-center p-2 rounded-lg hover:bg-secondary/50 cursor-pointer mb-2 border-b pb-3"
          onClick={() => setActiveTab('all')}
        >
          <div className="ml-1 flex-1">
            <p className="text-sm font-medium">All Questions</p>
          </div>
          <div className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-xs">{totalQuestions}</span>
          </div>
        </div>

        {categories.map((category, index) => (
          <CategoryItem
            key={index}
            icon={category.icon}
            name={category.name}
            count={category.count}
            color={category.color}
            onClick={() => setActiveTab(category.tabValue)}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default QuestionCategoriesSection;
