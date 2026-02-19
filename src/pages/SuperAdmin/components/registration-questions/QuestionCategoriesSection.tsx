
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
import { useTranslations } from '@/hooks/useTranslations';

interface CategoryItemProps {
  icon: React.ReactNode;
  name: string;
  count: number;
  color: string;
  onClick: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ icon, name, count, color, onClick }) => (
  <div 
    className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
    onClick={onClick}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${color}`}>
      {icon}
    </div>
    <div className="ml-3 flex-1">
      <p className="text-sm font-medium text-white">{name}</p>
    </div>
    <div className="bg-white/10 rounded-full w-6 h-6 flex items-center justify-center">
      <span className="text-xs text-white">{count}</span>
    </div>
  </div>
);

const QuestionCategoriesSection = () => {
  const { t } = useTranslations();
  const { questions, setActiveTab } = useQuestions();
  
  const categories = [
    { icon: <User size={16} />, name: 'Basics', count: getCategoryCount(questions, 'Basics'), color: 'bg-blue-500/10 text-blue-400', tabValue: 'basic' },
    { icon: <Heart size={16} />, name: 'Relationships', count: getCategoryCount(questions, 'Relationships'), color: 'bg-red-500/10 text-red-400', tabValue: 'relationships' },
    { icon: <Coffee size={16} />, name: 'Lifestyle', count: getCategoryCount(questions, 'Lifestyle'), color: 'bg-amber-500/10 text-amber-400', tabValue: 'lifestyle' },
    { icon: <Scroll size={16} />, name: 'Beliefs', count: getCategoryCount(questions, 'Beliefs'), color: 'bg-purple-500/10 text-purple-400', tabValue: 'beliefs' },
    { icon: <Brain size={16} />, name: 'Personality', count: getCategoryCount(questions, 'Personality'), color: 'bg-indigo-500/10 text-indigo-400', tabValue: 'personality' },
    { icon: <Star size={16} />, name: 'Interests', count: getCategoryCount(questions, 'Interests'), color: 'bg-green-500/10 text-green-400', tabValue: 'interests' },
    { icon: <Activity size={16} />, name: 'Physical', count: getCategoryCount(questions, 'Physical'), color: 'bg-orange-500/10 text-orange-400', tabValue: 'physical' },
  ];

  const totalQuestions = questions.length;

  return (
    <Card className="bg-[#141414] border-white/5">
      <CardHeader>
        <CardTitle className="text-white">{t('admin.question_categories', 'Question Categories')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div 
          className="flex items-center p-2 rounded-lg hover:bg-white/5 cursor-pointer mb-2 border-b border-white/5 pb-3 transition-colors"
          onClick={() => setActiveTab('all')}
        >
          <div className="ml-1 flex-1">
            <p className="text-sm font-medium text-white">{t('admin.all_questions', 'All Questions')}</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
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
