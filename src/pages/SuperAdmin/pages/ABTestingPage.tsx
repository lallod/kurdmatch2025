
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Bar,
  BarChart
} from 'recharts';
import { 
  Brain, 
  TestTube, 
  Plus, 
  PlayCircle, 
  StopCircle, 
  Copy, 
  Edit, 
  Trash, 
  ChevronDown, 
  Check, 
  BarChart3 
} from 'lucide-react';
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from '@/components/ui/chart';

const ABTestingPage = () => {
  const [newTestOpen, setNewTestOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<any>(null);

  // Mock data for A/B tests
  const abTests = [
    {
      id: '1',
      name: 'Homepage Hero Image',
      status: 'active',
      startDate: '2023-05-01',
      endDate: '2023-05-30',
      conversion: {
        a: 4.2,
        b: 5.7,
        improvement: '+35.7%'
      },
      target: 'All users',
      variants: {
        a: 'Current design',
        b: 'New design with AI theme'
      },
      metrics: [
        { day: '1', variantA: 4.1, variantB: 5.2 },
        { day: '2', variantA: 4.0, variantB: 5.5 },
        { day: '3', variantA: 4.3, variantB: 5.6 },
        { day: '4', variantA: 4.2, variantB: 5.8 },
        { day: '5', variantA: 4.1, variantB: 5.9 },
        { day: '6', variantA: 4.3, variantB: 5.7 },
        { day: '7', variantA: 4.4, variantB: 5.8 },
      ]
    },
    {
      id: '2',
      name: 'Onboarding Flow',
      status: 'active',
      startDate: '2023-05-05',
      endDate: '2023-06-05',
      conversion: {
        a: 67.5,
        b: 72.1,
        improvement: '+6.8%'
      },
      target: 'New users',
      variants: {
        a: '5-step flow',
        b: '3-step simplified flow'
      },
      metrics: [
        { day: '1', variantA: 65.3, variantB: 70.2 },
        { day: '2', variantA: 66.1, variantB: 71.5 },
        { day: '3', variantA: 67.2, variantB: 71.8 },
        { day: '4', variantA: 68.0, variantB: 72.1 },
        { day: '5', variantA: 67.8, variantB: 72.4 },
        { day: '6', variantA: 68.3, variantB: 72.7 },
        { day: '7', variantA: 69.0, variantB: 73.1 },
      ]
    },
    {
      id: '3',
      name: 'Premium Upgrade CTA',
      status: 'completed',
      startDate: '2023-04-01',
      endDate: '2023-04-30',
      conversion: {
        a: 2.3,
        b: 3.1,
        improvement: '+34.8%'
      },
      target: 'Free users only',
      variants: {
        a: 'Standard button',
        b: 'Animated button with benefits tooltip'
      },
      metrics: [
        { day: '1', variantA: 2.1, variantB: 2.8 },
        { day: '2', variantA: 2.2, variantB: 2.9 },
        { day: '3', variantA: 2.3, variantB: 3.0 },
        { day: '4', variantA: 2.3, variantB: 3.1 },
        { day: '5', variantA: 2.4, variantB: 3.2 },
        { day: '6', variantA: 2.3, variantB: 3.3 },
        { day: '7', variantA: 2.4, variantB: 3.2 },
      ]
    },
    {
      id: '4',
      name: 'Profile Match Algorithm',
      status: 'draft',
      startDate: '',
      endDate: '',
      conversion: {
        a: 0,
        b: 0,
        improvement: 'N/A'
      },
      target: '50% of active users',
      variants: {
        a: 'Current algorithm',
        b: 'AI enhanced algorithm'
      },
      metrics: []
    }
  ];

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Completed</Badge>;
      case 'draft':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Mock function for A/B test actions
  const handleTestAction = (testId: string, action: 'start' | 'stop' | 'delete' | 'duplicate') => {
    console.log(`Test ${testId} action: ${action}`);
    // In a real app, this would call an API to perform the action
  };

  const viewTestDetails = (test: any) => {
    setSelectedTest(test);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">A/B Testing</h1>
        <Button onClick={() => setNewTestOpen(true)} className="gap-2">
          <Plus size={16} />
          New Test
        </Button>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Powered Test Analysis</h3>
          <p className="text-sm text-gray-600">Our AI continuously analyzes test results and provides insights to help optimize your decisions</p>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="active">Active (2)</TabsTrigger>
          <TabsTrigger value="completed">Completed (1)</TabsTrigger>
          <TabsTrigger value="draft">Draft (1)</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Test Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Target</TableHead>
                      <TableHead>Improvement</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {abTests.map((test) => (
                      <TableRow key={test.id} onClick={() => viewTestDetails(test)} className="cursor-pointer">
                        <TableCell>
                          <div className="font-medium">{test.name}</div>
                          <div className="text-xs text-gray-500">Variants: A vs B</div>
                        </TableCell>
                        <TableCell>{getStatusBadge(test.status)}</TableCell>
                        <TableCell>{test.target}</TableCell>
                        <TableCell>
                          {test.status !== 'draft' ? (
                            <span className={test.conversion.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}>
                              {test.conversion.improvement}
                            </span>
                          ) : (
                            'Not started'
                          )}
                        </TableCell>
                        <TableCell>
                          {test.status !== 'draft' ? (
                            <span>
                              {test.startDate} to {test.endDate}
                            </span>
                          ) : (
                            'N/A'
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {test.status === 'active' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                onClick={(e) => { e.stopPropagation(); handleTestAction(test.id, 'stop'); }}
                              >
                                <StopCircle size={16} className="mr-2" />
                                Stop
                              </Button>
                            )}
                            {test.status === 'draft' && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-green-600 hover:text-green-700 border-green-200 hover:border-green-300"
                                onClick={(e) => { e.stopPropagation(); handleTestAction(test.id, 'start'); }}
                              >
                                <PlayCircle size={16} className="mr-2" />
                                Start
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); }}
                            >
                              <BarChart3 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {selectedTest && (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTest.name}</CardTitle>
                    <CardDescription>
                      {selectedTest.variants.a} vs {selectedTest.variants.b}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Copy size={16} />
                      Duplicate
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit size={16} />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 border rounded-lg bg-white space-y-2">
                    <div className="text-sm text-gray-500">Status</div>
                    <div className="font-semibold flex items-center">
                      {getStatusBadge(selectedTest.status)}
                    </div>
                  </div>
                  <div className="p-4 border rounded-lg bg-white space-y-2">
                    <div className="text-sm text-gray-500">Target Audience</div>
                    <div className="font-semibold">{selectedTest.target}</div>
                  </div>
                  <div className="p-4 border rounded-lg bg-white space-y-2">
                    <div className="text-sm text-gray-500">Improvement</div>
                    <div className={`font-semibold ${selectedTest.conversion.improvement.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {selectedTest.conversion.improvement}
                    </div>
                  </div>
                </div>

                {selectedTest.status !== 'draft' && (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
                      <ChartContainer
                        config={{
                          variantA: { color: "#8075FF" },
                          variantB: { color: "#FF4B91" }
                        }}
                        className="h-80"
                      >
                        <LineChart data={selectedTest.metrics}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis />
                          <ChartTooltip 
                            content={
                              <ChartTooltipContent />
                            }
                          />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="variantA" 
                            name="Variant A" 
                            stroke="var(--color-variantA)" 
                            activeDot={{ r: 8 }} 
                          />
                          <Line 
                            type="monotone" 
                            dataKey="variantB" 
                            name="Variant B" 
                            stroke="var(--color-variantB)" 
                          />
                        </LineChart>
                      </ChartContainer>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50">
                      <h4 className="font-semibold text-blue-800 mb-2">AI Analysis</h4>
                      <p className="text-blue-700">
                        Variant B is showing a statistically significant improvement of {selectedTest.conversion.improvement}. 
                        Based on the current trend, we recommend continuing the test for at least 7 more days to ensure 
                        consistency in results. The improvement is most notable among users from the 25-34 age demographic.
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              {selectedTest.status === 'active' && (
                <CardFooter className="border-t p-4 bg-gray-50">
                  <div className="w-full flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Running for: 14 days (16 days remaining)
                    </span>
                    <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300">
                      <StopCircle size={16} />
                      Stop Test
                    </Button>
                  </div>
                </CardFooter>
              )}
            </Card>
          )}
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardHeader>
              <CardTitle>Active Tests</CardTitle>
              <CardDescription>Currently running tests</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Active tests content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tests</CardTitle>
              <CardDescription>Finished tests with results</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Completed tests content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="draft">
          <Card>
            <CardHeader>
              <CardTitle>Draft Tests</CardTitle>
              <CardDescription>Tests in preparation</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Draft tests content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Test Dialog */}
      <Dialog open={newTestOpen} onOpenChange={setNewTestOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New A/B Test</DialogTitle>
            <DialogDescription>
              Set up a new test to compare variations and measure their performance.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="test-name" className="text-sm font-medium">Test Name</label>
              <Input id="test-name" placeholder="e.g., Homepage Hero Image Test" />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Test Type</label>
              <Select defaultValue="ui">
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ui">UI Component Test</SelectItem>
                  <SelectItem value="flow">User Flow Test</SelectItem>
                  <SelectItem value="algorithm">Algorithm Test</SelectItem>
                  <SelectItem value="content">Content Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Variant A (Control)</label>
                <Input placeholder="e.g., Current Design" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Variant B (Test)</label>
                <Input placeholder="e.g., New Design" />
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Target Audience</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="new">New Users</SelectItem>
                  <SelectItem value="returning">Returning Users</SelectItem>
                  <SelectItem value="premium">Premium Users</SelectItem>
                  <SelectItem value="free">Free Users</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Traffic Distribution</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Variant A: 50%</label>
                  <Input type="range" min="10" max="90" defaultValue="50" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">Variant B: 50%</label>
                  <Input type="range" min="10" max="90" defaultValue="50" disabled />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Success Metrics</label>
              <Select defaultValue="conversion">
                <SelectTrigger>
                  <SelectValue placeholder="Select primary metric" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conversion">Conversion Rate</SelectItem>
                  <SelectItem value="engagement">Engagement Rate</SelectItem>
                  <SelectItem value="retention">Retention Rate</SelectItem>
                  <SelectItem value="revenue">Revenue per User</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Start Date</label>
                <Input type="date" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">End Date</label>
                <Input type="date" />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTestOpen(false)}>Cancel</Button>
            <Button>Create Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ABTestingPage;
