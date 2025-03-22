
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Search, Filter, Eye, Trash2, Flag, CheckCircle, XCircle, Image, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious
} from '@/components/ui/pagination';

interface Photo {
  id: string;
  userId: string;
  userName: string;
  url: string;
  uploadDate: string;
  status: 'approved' | 'pending' | 'rejected';
  reportCount: number;
  reason?: string;
}

const PhotosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock photos data - in a real app, this would come from an API
  const [photos, setPhotos] = useState<Photo[]>([
    {
      id: '1',
      userId: '001',
      userName: 'Emma Johnson',
      url: 'https://placekitten.com/600/400',
      uploadDate: '2023-05-15',
      status: 'approved',
      reportCount: 0
    },
    {
      id: '2',
      userId: '002',
      userName: 'James Smith',
      url: 'https://placekitten.com/601/400',
      uploadDate: '2023-05-14',
      status: 'approved',
      reportCount: 0
    },
    {
      id: '3',
      userId: '003',
      userName: 'Sophia Martinez',
      url: 'https://placekitten.com/602/400',
      uploadDate: '2023-05-13',
      status: 'pending',
      reportCount: 0
    },
    {
      id: '4',
      userId: '004',
      userName: 'Robert Wilson',
      url: 'https://placekitten.com/603/400',
      uploadDate: '2023-05-12',
      status: 'rejected',
      reportCount: 0,
      reason: 'Inappropriate content'
    },
    {
      id: '5',
      userId: '005',
      userName: 'Olivia Brown',
      url: 'https://placekitten.com/604/400',
      uploadDate: '2023-05-11',
      status: 'approved',
      reportCount: 2
    },
    {
      id: '6',
      userId: '001',
      userName: 'Emma Johnson',
      url: 'https://placekitten.com/605/400',
      uploadDate: '2023-05-10',
      status: 'pending',
      reportCount: 3
    },
    {
      id: '7',
      userId: '006',
      userName: 'Daniel Lee',
      url: 'https://placekitten.com/606/400',
      uploadDate: '2023-05-09',
      status: 'approved',
      reportCount: 0
    },
    {
      id: '8',
      userId: '007',
      userName: 'Charlotte Garcia',
      url: 'https://placekitten.com/607/400',
      uploadDate: '2023-05-08',
      status: 'pending',
      reportCount: 1
    }
  ]);

  const getFilteredPhotos = () => {
    let filtered = photos;
    
    // Apply tab filter
    if (activeTab !== 'all') {
      filtered = filtered.filter(photo => photo.status === activeTab);
    }
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(photo => 
        photo.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.userId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'reported') {
        filtered = filtered.filter(photo => photo.reportCount > 0);
      } else {
        filtered = filtered.filter(photo => photo.status === statusFilter);
      }
    }
    
    return filtered;
  };

  const filteredPhotos = getFilteredPhotos();

  const openPhotoDetail = (photo: Photo) => {
    setSelectedPhoto(photo);
  };

  const closePhotoDetail = () => {
    setSelectedPhoto(null);
  };

  const approvePhoto = (photoId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPhotos(photos.map(photo => 
        photo.id === photoId 
          ? { ...photo, status: 'approved' as const } 
          : photo
      ));
      setIsLoading(false);
      
      // If we're approving the currently selected photo, update it
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, status: 'approved' });
      }
    }, 500);
  };

  const rejectPhoto = (photoId: string, reason: string = 'Inappropriate content') => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPhotos(photos.map(photo => 
        photo.id === photoId 
          ? { ...photo, status: 'rejected' as const, reason } 
          : photo
      ));
      setIsLoading(false);
      
      // If we're rejecting the currently selected photo, update it
      if (selectedPhoto && selectedPhoto.id === photoId) {
        setSelectedPhoto({ ...selectedPhoto, status: 'rejected', reason });
      }
    }, 500);
  };

  const deletePhoto = (photoId: string) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setPhotos(photos.filter(photo => photo.id !== photoId));
      setIsLoading(false);
      
      // If we're deleting the currently selected photo, close the dialog
      if (selectedPhoto && selectedPhoto.id === photoId) {
        closePhotoDetail();
      }
    }, 500);
  };

  const getStatusBadge = (status: string, reportCount: number) => {
    if (reportCount > 0) {
      return (
        <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Flag size={12} /> Reported ({reportCount})
        </Badge>
      );
    }
    
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Photo Management</h1>
        <Button className="gap-2" onClick={() => console.log('Export photos')}>
          <Download size={16} />
          Export Data
        </Button>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-[500px]">
          <TabsTrigger value="all">All Photos</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by user name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="reported">Reported</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.length > 0 ? (
                  filteredPhotos.map((photo) => (
                    <div 
                      key={photo.id} 
                      className="border rounded-md overflow-hidden bg-white flex flex-col"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={photo.url} 
                          alt={`Photo by ${photo.userName}`}
                          className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openPhotoDetail(photo)}
                        />
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-sm">{photo.userName}</h3>
                            <p className="text-xs text-gray-500">ID: {photo.userId}</p>
                          </div>
                          {getStatusBadge(photo.status, photo.reportCount)}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Uploaded: {photo.uploadDate}</p>
                        
                        <div className="mt-3 flex gap-1 justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => openPhotoDetail(photo)}
                          >
                            <Eye size={14} className="mr-1" /> View
                          </Button>
                          {photo.status === 'pending' ? (
                            <div className="flex gap-1">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                                onClick={() => approvePhoto(photo.id)}
                                disabled={isLoading}
                              >
                                <CheckCircle size={14} />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                                onClick={() => rejectPhoto(photo.id)}
                                disabled={isLoading}
                              >
                                <XCircle size={14} />
                              </Button>
                            </div>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              onClick={() => deletePhoto(photo.id)}
                              disabled={isLoading}
                            >
                              <Trash2 size={14} />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
                    <Image size={48} className="mb-4 opacity-20" />
                    <h3 className="text-lg font-medium">No photos found</h3>
                    <p className="text-sm">Try adjusting your filters or search query</p>
                  </div>
                )}
              </div>

              {filteredPhotos.length > 0 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>1</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={closePhotoDetail}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Photo Details</DialogTitle>
            <DialogDescription>
              Review and moderate this photo
            </DialogDescription>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="rounded-md overflow-hidden border">
                <img 
                  src={selectedPhoto.url} 
                  alt={`Photo by ${selectedPhoto.userName}`}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Photo Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">User:</span>
                      <span className="text-sm">{selectedPhoto.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">User ID:</span>
                      <span className="text-sm">{selectedPhoto.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Upload Date:</span>
                      <span className="text-sm">{selectedPhoto.uploadDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <span className="text-sm">{getStatusBadge(selectedPhoto.status, selectedPhoto.reportCount)}</span>
                    </div>
                    {selectedPhoto.reason && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Rejection Reason:</span>
                        <span className="text-sm">{selectedPhoto.reason}</span>
                      </div>
                    )}
                    {selectedPhoto.reportCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Report Count:</span>
                        <span className="text-sm">{selectedPhoto.reportCount}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500">Moderation Actions</h3>
                  
                  {selectedPhoto.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1 gap-2" 
                        variant="outline"
                        onClick={() => approvePhoto(selectedPhoto.id)}
                        disabled={isLoading}
                      >
                        <CheckCircle size={16} />
                        Approve Photo
                      </Button>
                      <Button 
                        className="flex-1 gap-2" 
                        variant="outline"
                        onClick={() => rejectPhoto(selectedPhoto.id)}
                        disabled={isLoading}
                      >
                        <XCircle size={16} />
                        Reject Photo
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full gap-2" 
                    variant="destructive"
                    onClick={() => deletePhoto(selectedPhoto.id)}
                    disabled={isLoading}
                  >
                    <Trash2 size={16} />
                    Delete Photo
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={closePhotoDetail}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosPage;
