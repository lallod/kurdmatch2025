
import React from 'react';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { QuestionItem } from './types';
import { useToast } from "@/hooks/use-toast";

interface QuestionsTableProps {
  questions: QuestionItem[];
  selectedQuestions: string[];
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelection: (id: string) => void;
  onEdit: (question: QuestionItem) => void;
  onDelete: (id: string) => void;
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  questions,
  selectedQuestions,
  isSelectAll,
  onToggleSelectAll,
  onToggleSelection,
  onEdit,
  onDelete
}) => {
  const { toast } = useToast();

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px]">
              <Checkbox 
                checked={isSelectAll} 
                onCheckedChange={onToggleSelectAll} 
              />
            </TableHead>
            <TableHead className="w-[200px]">Question</TableHead>
            <TableHead className="w-[120px]">Category</TableHead>
            <TableHead className="w-[100px]">Field Type</TableHead>
            <TableHead className="w-[100px]">Required</TableHead>
            <TableHead className="w-[100px]">Status</TableHead>
            <TableHead className="w-[120px]">Registration Step</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                No questions found
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => (
              <TableRow key={question.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedQuestions.includes(question.id)} 
                    onCheckedChange={() => onToggleSelection(question.id)} 
                  />
                </TableCell>
                <TableCell className="font-medium">
                  {question.text}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {question.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {question.fieldType}
                  </Badge>
                </TableCell>
                <TableCell>
                  {question.required ? (
                    <Badge className="bg-primary/10 text-primary">Required</Badge>
                  ) : (
                    <Badge variant="outline">Optional</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {question.enabled ? (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  ) : (
                    <Badge className="bg-red-100 text-red-800">Disabled</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {question.registrationStep}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(question)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Preview",
                          description: `Previewing: ${question.text}`,
                        });
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => onDelete(question.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuestionsTable;
