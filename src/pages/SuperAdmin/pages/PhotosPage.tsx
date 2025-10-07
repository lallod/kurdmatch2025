import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Search, Eye, Trash2, CheckCircle, XCircle, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { useAdminPhotos } from '../hooks/useAdminPhotos';
import { useToast } from '@/hooks/use-toast';

const PhotosPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { photos, loading, totalCount, fetchPhotos, deletePhoto, approvePhoto } = useAdminPhotos();
  const { toast } = useToast();

  React.useEffect(() => {
    fetchPhotos(currentPage, 12, searchTerm);
  }, [currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchPhotos(1, 12, searchTerm);
  };

  const handleDelete = async (photoId: string) => {
    const success = await deletePhoto(photoId);
    if (success) {
      toast({
        title: "Photo deleted",
        description: "The photo has been successfully deleted.",
      });
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    } else {
      toast({
        title: "Error",
        description: "Failed to delete photo.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    fetchPhotos(currentPage, 12, searchTerm);
  };

  const filteredPhotos = photos.filter(photo => {
    if (!searchTerm) return true;
    return photo.profile?.name?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Photo Management</h1>
          <p className="text-white/60 mt-1">Manage and moderate user photos</p>
        </div>
        <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Card className="bg-[#141414] border-white/5">
        <CardContent className="pt-6">
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Search by user name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/40"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-white/60">Loading photos...</div>
          ) : filteredPhotos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-white/60">
              <ImageIcon size={48} className="mb-4 opacity-20" />
              <h3 className="text-lg font-medium">No photos found</h3>
              <p className="text-sm">Try adjusting your search query</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredPhotos.map((photo) => (
                  <div 
                    key={photo.id} 
                    className="border border-white/10 rounded-md overflow-hidden bg-white/5 flex flex-col hover:border-white/20 transition-colors"
                  >
                    <div className="h-48 relative overflow-hidden">
                      <img 
                        src={photo.url} 
                        alt={`Photo by ${photo.profile?.name || 'User'}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => setSelectedPhoto(photo)}
                      />
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium text-sm text-white">{photo.profile?.name || 'Unknown User'}</h3>
                          <p className="text-xs text-white/40">
                            {format(new Date(photo.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                        {photo.is_primary && (
                          <Badge className="bg-blue-500/20 text-blue-300 text-xs">Primary</Badge>
                        )}
                      </div>
                      
                      <div className="mt-auto flex gap-1 justify-between">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1 text-white/80 hover:text-white hover:bg-white/10"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <Eye size={14} className="mr-1" /> View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                          onClick={() => handleDelete(photo.id)}
                          disabled={loading}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-white/60">
                  Showing {filteredPhotos.length} of {totalCount} photos (Page {currentPage} of {totalPages})
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || loading}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages || loading}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Photo Detail Dialog */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl bg-[#141414] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">Photo Details</DialogTitle>
          </DialogHeader>
          
          {selectedPhoto && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="rounded-md overflow-hidden border border-white/10">
                <img 
                  src={selectedPhoto.url} 
                  alt={`Photo by ${selectedPhoto.profile?.name || 'User'}`}
                  className="w-full h-auto"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-white/60">Photo Information</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white/80">User:</span>
                      <span className="text-sm text-white">{selectedPhoto.profile?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white/80">Upload Date:</span>
                      <span className="text-sm text-white">
                        {format(new Date(selectedPhoto.created_at), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-white/80">Status:</span>
                      {selectedPhoto.is_primary ? (
                        <Badge className="bg-blue-500/20 text-blue-300">Primary Photo</Badge>
                      ) : (
                        <Badge className="bg-white/10 text-white/80">Additional Photo</Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-white/60">Actions</h3>
                  <Button 
                    className="w-full" 
                    variant="destructive"
                    onClick={() => handleDelete(selectedPhoto.id)}
                    disabled={loading}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete Photo
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPhoto(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PhotosPage;
