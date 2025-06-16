
import { QuestionItem } from '@/pages/SuperAdmin/components/registration-questions/types';

export const generateAIBio = (formData: Record<string, any>, questions: QuestionItem[]) => {
  const fullNameQ = questions.find(q => q.profileField === 'full_name');
  const occupationQ = questions.find(q => q.profileField === 'occupation');
  const locationQ = questions.find(q => q.profileField === 'location');
  const interestsQ = questions.find(q => q.profileField === 'interests');
  const relationshipGoalsQ = questions.find(q => q.profileField === 'relationship_goals');
  
  const fullName = fullNameQ ? formData[fullNameQ.id] || '' : '';
  const firstName = fullName.split(' ')[0] || 'there';

  const occupation = occupationQ ? formData[occupationQ.id] : '';
  const location = locationQ ? formData[locationQ.id] : '';
  const interests = interestsQ ? (Array.isArray(formData[interestsQ.id]) ? formData[interestsQ.id].join(', ') : formData[interestsQ.id]) : '';
  const relationshipGoals = relationshipGoalsQ ? formData[relationshipGoalsQ.id] : '';
  
  let bio = `Hi, I'm ${firstName}`;
  
  if (occupation) {
    bio += `, working as a ${occupation}`;
  }
  
  if (location) {
    bio += ` based in ${location}`;
  }
  
  bio += `. `;
  
  if (interests) {
    bio += `I enjoy ${interests}. `;
  }
  
  if (relationshipGoals) {
    bio += `I'm looking for ${relationshipGoals}. `;
  }
  
  bio += `I'm excited to connect with like-minded people!`;
  
  return bio;
};
