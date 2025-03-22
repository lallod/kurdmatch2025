
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Smartphone, Monitor } from 'lucide-react';

const QuestionPreviewCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Preview</span>
          <Tabs defaultValue="mobile" className="w-[180px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="mobile">
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </TabsTrigger>
              <TabsTrigger value="desktop">
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 border p-4 rounded-lg bg-background">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Sample Registration Form</h3>
            <p className="text-sm text-muted-foreground">
              This is how your questions will appear to users
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="preview-text">What is your height?</Label>
              <Input id="preview-text" placeholder="e.g., 175 cm" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preview-textarea">Tell us about yourself</Label>
              <Textarea id="preview-textarea" placeholder="Share a bit about yourself..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="preview-select">What is your body type?</Label>
              <Select>
                <SelectTrigger id="preview-select">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="athletic">Athletic</SelectItem>
                  <SelectItem value="average">Average</SelectItem>
                  <SelectItem value="slim">Slim</SelectItem>
                  <SelectItem value="muscular">Muscular</SelectItem>
                  <SelectItem value="curvy">Curvy</SelectItem>
                  <SelectItem value="plus">Plus Size</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <Label>What are your hobbies?</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="preview-hobby-1" />
                  <Label htmlFor="preview-hobby-1" className="text-sm">Photography</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="preview-hobby-2" />
                  <Label htmlFor="preview-hobby-2" className="text-sm">Reading</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="preview-hobby-3" />
                  <Label htmlFor="preview-hobby-3" className="text-sm">Travel</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="preview-hobby-4" />
                  <Label htmlFor="preview-hobby-4" className="text-sm">Cooking</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>What are your relationship goals?</Label>
              <RadioGroup defaultValue="long-term">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="long-term" id="preview-goal-1" />
                  <Label htmlFor="preview-goal-1" className="text-sm">Long-term relationship</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="casual" id="preview-goal-2" />
                  <Label htmlFor="preview-goal-2" className="text-sm">Casual dating</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="friends" id="preview-goal-3" />
                  <Label htmlFor="preview-goal-3" className="text-sm">Making friends</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="flex justify-end pt-2">
            <Button>Continue</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionPreviewCard;
