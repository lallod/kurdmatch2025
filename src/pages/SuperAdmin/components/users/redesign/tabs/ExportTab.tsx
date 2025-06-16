
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, Database } from 'lucide-react';

const ExportTab: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);

  const fieldGroups = [
    {
      name: 'Core Identity',
      fields: ['name', 'email', 'age', 'gender', 'location']
    },
    {
      name: 'Physical Characteristics',
      fields: ['height', 'body_type', 'ethnicity', 'eye_color', 'hair_color']
    },
    {
      name: 'Lifestyle & Habits',
      fields: ['occupation', 'education', 'smoking', 'drinking', 'exercise_habits']
    },
    {
      name: 'Activity Data',
      fields: ['join_date', 'last_active', 'photo_count', 'message_count', 'match_count']
    }
  ];

  const handleFieldToggle = (field: string) => {
    setSelectedFields(prev => 
      prev.includes(field) 
        ? prev.filter(f => f !== field)
        : [...prev, field]
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download size={20} />
              Export Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Export Format</label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                  <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="xml">XML</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">User Filter</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active Users Only</SelectItem>
                  <SelectItem value="verified">Verified Users Only</SelectItem>
                  <SelectItem value="premium">Premium Users Only</SelectItem>
                  <SelectItem value="recent">Recently Joined</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Export Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="anonymize" />
                  <label htmlFor="anonymize" className="text-sm">Anonymize personal data</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="compress" />
                  <label htmlFor="compress" className="text-sm">Compress export file</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="email" />
                  <label htmlFor="email" className="text-sm">Email export link</label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Exports</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText size={16} />
              User List (Basic Info)
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Database size={16} />
              Full User Database
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <Download size={16} />
              Analytics Report
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2">
              <FileText size={16} />
              Registration Statistics
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Select Fields to Export</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fieldGroups.map((group) => (
              <div key={group.name} className="space-y-3">
                <h3 className="font-medium text-sm">{group.name}</h3>
                <div className="space-y-2">
                  {group.fields.map((field) => (
                    <div key={field} className="flex items-center space-x-2">
                      <Checkbox 
                        id={field}
                        checked={selectedFields.includes(field)}
                        onCheckedChange={() => handleFieldToggle(field)}
                      />
                      <label htmlFor={field} className="text-sm">
                        {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedFields.length} fields selected
            </p>
            <div className="space-x-2">
              <Button variant="outline" onClick={() => setSelectedFields([])}>
                Clear All
              </Button>
              <Button disabled={selectedFields.length === 0}>
                Export Selected Fields
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExportTab;
