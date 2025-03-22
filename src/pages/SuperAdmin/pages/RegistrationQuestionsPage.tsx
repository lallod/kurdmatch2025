
import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/hooks/use-toast";
import QuestionCategoriesSection from '../components/registration-questions/QuestionCategoriesSection';
import QuestionPreviewCard from '../components/registration-questions/QuestionPreviewCard';
import QuestionsTable from '../components/registration-questions/QuestionsTable';
import QuestionsToolbar from '../components/registration-questions/QuestionsToolbar';
import BulkActions from '../components/registration-questions/BulkActions';
import AddQuestionDialog from '../components/registration-questions/AddQuestionDialog';
import EditQuestionDialog from '../components/registration-questions/EditQuestionDialog';
import { QuestionItem } from '../components/registration-questions/types';
import { useQuestions } from '../components/registration-questions/useQuestions';

const RegistrationQuestionsPage = () => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);
  
  const {
    filteredQuestions,
    selectedQuestions,
    isSelectAll,
    activeTab,
    searchQuery,
    setActiveTab,
    setSearchQuery,
    toggleQuestionSelection,
    toggleSelectAll,
    handleBulkDelete,
    handleBulkToggleEnabled,
    handleDeleteQuestion,
    handleUpdateQuestion,
    handleAddQuestion
  } = useQuestions();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Registration Questions</h1>
          <p className="text-muted-foreground">
            Manage the questions users are asked during the registration process
          </p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Export Started",
                description: "Questions exported to CSV successfully",
              });
            }}
          >
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Question
          </Button>
        </div>
      </div>

      <div className="flex space-x-4">
        <div className="w-2/3 space-y-6">
          <Card>
            <CardHeader>
              <QuestionsToolbar 
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onFilterSelect={setActiveTab}
              />
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-7 mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="basic">Basics</TabsTrigger>
                  <TabsTrigger value="lifestyle">Lifestyle</TabsTrigger>
                  <TabsTrigger value="beliefs">Beliefs</TabsTrigger>
                  <TabsTrigger value="relationships">Relationships</TabsTrigger>
                  <TabsTrigger value="personality">Personality</TabsTrigger>
                  <TabsTrigger value="interests">Interests</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="space-y-4">
                  <BulkActions
                    selectedCount={selectedQuestions.length}
                    onEnableBulk={() => handleBulkToggleEnabled(true)}
                    onDisableBulk={() => handleBulkToggleEnabled(false)}
                    onDeleteBulk={handleBulkDelete}
                  />
                  
                  <QuestionsTable
                    questions={filteredQuestions}
                    selectedQuestions={selectedQuestions}
                    isSelectAll={isSelectAll}
                    onToggleSelectAll={toggleSelectAll}
                    onToggleSelection={toggleQuestionSelection}
                    onEdit={setEditingQuestion}
                    onDelete={handleDeleteQuestion}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="w-1/3 space-y-6">
          <QuestionCategoriesSection />
          <QuestionPreviewCard />
        </div>
      </div>

      <EditQuestionDialog
        question={editingQuestion}
        onOpenChange={() => setEditingQuestion(null)}
        onSave={handleUpdateQuestion}
      />

      <AddQuestionDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddQuestion={(newQuestion) => {
          const success = handleAddQuestion(newQuestion);
          if (success) {
            setIsAddDialogOpen(false);
          }
        }}
        questionsCount={filteredQuestions.length}
      />
    </div>
  );
};

export default RegistrationQuestionsPage;
