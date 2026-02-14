
import React, { useState } from 'react';
import { useAdminDataExports } from '../hooks/useAdminDataExports';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DownloadCloud, 
  FileDown, 
  Calendar, 
  Search, 
  Filter, 
  RefreshCw, 
  Plus, 
  ExternalLink, 
  ClipboardCopy, 
  FileSpreadsheet, 
  FileJson, 
  FileText, 
  FileArchive, 
  Brain 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';

const ExportsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [newExportOpen, setNewExportOpen] = useState(false);
  const { exports: exportJobs, loading, refetch, createExport } = useAdminDataExports();
  

  // Filter exports based on search term and type
  const filteredExports = exportJobs.filter(job => {
    const matchesSearch = 
      job.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = 
      typeFilter === 'all' || 
      job.export_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Status badge component
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Processing</Badge>;
      case 'scheduled':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Scheduled</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Failed</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Format type icon component
  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv':
        return <FileSpreadsheet size={16} className="text-green-500" />;
      case 'xlsx':
        return <FileSpreadsheet size={16} className="text-blue-500" />;
      case 'json':
        return <FileJson size={16} className="text-amber-500" />;
      case 'txt':
        return <FileText size={16} className="text-gray-500" />;
      case 'zip':
        return <FileArchive size={16} className="text-purple-500" />;
      default:
        return <FileDown size={16} />;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
    toast.success("Data refreshed");
  };

  const handleDownload = (exportId: string) => {
    const exportJob = exportJobs.find(e => e.id === exportId);
    if (exportJob?.file_url) {
      window.open(exportJob.file_url, '_blank');
    } else {
      toast.error("File not available");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Data Exports</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </Button>
          <Button onClick={() => setNewExportOpen(true)} className="gap-2">
            <Plus size={16} />
            New Export
          </Button>
        </div>
      </div>

      {/* AI banner */}
      <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-tinder-rose/5 to-tinder-orange/5 border border-tinder-rose/10 flex items-center">
        <Brain size={24} className="text-tinder-rose mr-3" />
        <div>
          <h3 className="font-semibold text-gray-800">AI-Enhanced Data Exports</h3>
          <p className="text-sm text-gray-600">Our AI system can automatically schedule reports, detect patterns, and format data for optimal analysis</p>
        </div>
      </div>

      <Tabs defaultValue="recent">
        <TabsList className="mb-4">
          <TabsTrigger value="recent">Recent Exports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="templates">Export Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search exports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="user-activity">User Activity</SelectItem>
                      <SelectItem value="financial">Financial</SelectItem>
                      <SelectItem value="user-profiles">User Profiles</SelectItem>
                      <SelectItem value="messages">Messages</SelectItem>
                      <SelectItem value="user-registrations">User Registrations</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon">
                    <Filter size={16} />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Export Name</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Records</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExports.length > 0 ? (
                      filteredExports.map((exportJob) => (
                         <TableRow key={exportJob.id}>
                          <TableCell>
                            <div className="font-medium">{exportJob.name}</div>
                            <div className="text-xs text-gray-500">{exportJob.id}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              {getFormatIcon(exportJob.format)}
                              <span className="ml-2 uppercase">{exportJob.format}</span>
                            </div>
                          </TableCell>
                          <TableCell>{getStatusBadge(exportJob.status)}</TableCell>
                          <TableCell>
                            <div>{new Date(exportJob.created_at).toLocaleString()}</div>
                            {exportJob.status === 'completed' && exportJob.completed_at && (
                              <div className="text-xs text-gray-500">Completed: {new Date(exportJob.completed_at).toLocaleString()}</div>
                            )}
                          </TableCell>
                          <TableCell>{exportJob.row_count || '-'}</TableCell>
                          <TableCell>{exportJob.file_size ? `${(exportJob.file_size / 1024 / 1024).toFixed(2)} MB` : '-'}</TableCell>
                          <TableCell className="text-right">
                            {exportJob.status === 'completed' ? (
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="gap-2"
                                onClick={() => handleDownload(exportJob.id)}
                              >
                                <DownloadCloud size={16} />
                                Download
                              </Button>
                            ) : exportJob.status === 'failed' ? (
                              <Button variant="outline" size="sm" className="gap-2">
                                <RefreshCw size={16} />
                                Retry
                              </Button>
                            ) : (
                              <Button variant="outline" size="sm" disabled>
                                {exportJob.status === 'processing' ? 'Processing...' : 'Scheduled'}
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          No exports found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Exports</CardTitle>
              <CardDescription>Exports scheduled for future execution</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Scheduled exports content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Export Templates</CardTitle>
              <CardDescription>Reusable export configurations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Export templates content will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* New Export Dialog */}
      <Dialog open={newExportOpen} onOpenChange={setNewExportOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>New Data Export</DialogTitle>
            <DialogDescription>
              Configure and create a new data export job.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="export-name" className="text-sm font-medium">Export Name</label>
              <Input id="export-name" placeholder="e.g., Monthly User Activity Report" />
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Data Type</label>
              <Select defaultValue="user-activity">
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user-activity">User Activity</SelectItem>
                  <SelectItem value="user-profiles">User Profiles</SelectItem>
                  <SelectItem value="messages">Messages</SelectItem>
                  <SelectItem value="financial">Financial Data</SelectItem>
                  <SelectItem value="user-registrations">User Registrations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Date Range</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">From</label>
                  <Input type="date" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">To</label>
                  <Input type="date" />
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">File Format</label>
              <Select defaultValue="csv">
                <SelectTrigger>
                  <SelectValue placeholder="Select file format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="xlsx">XLSX</SelectItem>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="txt">TXT</SelectItem>
                  <SelectItem value="zip">ZIP (Compressed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Export Options</label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-headers" defaultChecked />
                  <label htmlFor="include-headers" className="text-sm">Include column headers</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="anonymize-data" />
                  <label htmlFor="anonymize-data" className="text-sm">Anonymize sensitive data</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-metadata" />
                  <label htmlFor="include-metadata" className="text-sm">Include metadata</label>
                </div>
              </div>
            </div>
            
            <div className="grid gap-2">
              <label className="text-sm font-medium">Scheduling</label>
              <Select defaultValue="now">
                <SelectTrigger>
                  <SelectValue placeholder="Select schedule" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Export Now</SelectItem>
                  <SelectItem value="schedule">Schedule for Later</SelectItem>
                  <SelectItem value="recurring">Set as Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewExportOpen(false)}>Cancel</Button>
            <Button>Create Export</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExportsPage;
