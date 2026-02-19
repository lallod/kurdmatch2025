
import React from 'react';
import { Edit, Eye, Trash2, Lock } from 'lucide-react';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { QuestionItem } from './types';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTranslations } from '@/hooks/useTranslations';

interface QuestionsTableProps {
  questions: QuestionItem[];
  selectedQuestions: string[];
  isSelectAll: boolean;
  onToggleSelectAll: () => void;
  onToggleSelection: (id: string) => void;
  onEdit: (question: QuestionItem) => void;
  onDelete: (id: string) => void;
  onPreview: (question: QuestionItem) => void;
}

const QuestionsTable: React.FC<QuestionsTableProps> = ({
  questions, selectedQuestions, isSelectAll, onToggleSelectAll,
  onToggleSelection, onEdit, onDelete, onPreview
}) => {
  const { t } = useTranslations();

  return (
    <div className="border border-white/5 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-white/5">
          <TableRow className="hover:bg-white/5 border-white/5">
            <TableHead className="w-[40px] text-white/60">
              <Checkbox checked={isSelectAll} onCheckedChange={onToggleSelectAll} />
            </TableHead>
            <TableHead className="w-[30px] text-white/60"></TableHead>
            <TableHead className="w-[200px] text-white/60">{t('admin.question', 'Question')}</TableHead>
            <TableHead className="w-[120px] text-white/60">{t('admin.category', 'Category')}</TableHead>
            <TableHead className="w-[100px] text-white/60">{t('admin.field_type', 'Field Type')}</TableHead>
            <TableHead className="w-[100px] text-white/60">{t('admin.required', 'Required')}</TableHead>
            <TableHead className="w-[100px] text-white/60">{t('admin.status', 'Status')}</TableHead>
            <TableHead className="w-[120px] text-white/60">{t('admin.registration_step', 'Registration Step')}</TableHead>
            <TableHead className="text-right text-white/60">{t('admin.actions', 'Actions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.length === 0 ? (
            <TableRow className="hover:bg-white/5 border-white/5">
              <TableCell colSpan={9} className="text-center py-4 text-white/50">
                {t('admin.no_questions_found', 'No questions found')}
              </TableCell>
            </TableRow>
          ) : (
            questions.map((question) => (
              <TableRow key={question.id} className={question.isSystemField ? "bg-white/5 hover:bg-white/10 border-white/5" : "hover:bg-white/5 border-white/5"}>
                <TableCell>
                  <Checkbox 
                    checked={selectedQuestions.includes(question.id)} 
                    onCheckedChange={() => onToggleSelection(question.id)} 
                    disabled={question.isSystemField}
                  />
                </TableCell>
                <TableCell>
                  {question.isSystemField && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div><Lock className="h-4 w-4 text-muted-foreground" /></div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{t('admin.system_field_restricted', 'System field - some operations are restricted')}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </TableCell>
                <TableCell className="font-medium text-white">
                  {question.text}
                  {question.profileField && (
                    <div className="text-xs text-white/50 mt-1">
                      {t('admin.maps_to', 'Maps to:')} {question.profileField}
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{question.category}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">{question.fieldType}</Badge>
                </TableCell>
                <TableCell>
                  {question.required ? (
                    <Badge className="bg-primary/10 text-primary">{t('admin.required', 'Required')}</Badge>
                  ) : (
                    <Badge variant="outline">{t('admin.optional', 'Optional')}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {question.enabled ? (
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">{t('admin.enabled', 'Enabled')}</Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">{t('admin.disabled', 'Disabled')}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">{question.registrationStep}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => onEdit(question)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => {
                      onPreview(question);
                      toast.info(`Previewing: ${question.text}`);
                    }}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(question.id)} disabled={question.isSystemField}>
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
