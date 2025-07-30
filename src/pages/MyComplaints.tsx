import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { MessageSquare, MapPin, Calendar, Image as ImageIcon, RefreshCw, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  location: string;
  image_url: string | null;
  image_urls: string[] | null;
  created_at: string;
  updated_at: string;
  latitude?: number;
  longitude?: number;
  user_id: string;
}

const statusColors = {
  'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'In Progress': 'bg-blue-100 text-blue-800 border-blue-300',
  'Resolved': 'bg-green-100 text-green-800 border-green-300',
  'Rejected': 'bg-red-100 text-red-800 border-red-300',
};

export default function MyComplaints() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComplaints((data || []).map(complaint => ({
        ...complaint,
        image_urls: Array.isArray(complaint.image_urls) 
          ? (complaint.image_urls as string[])
          : null
      })) as Complaint[]);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast({
        title: "Error",
        description: "Failed to load your complaints. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteComplaint = async (complaintId: string) => {
    try {
      const { error } = await supabase
        .from('complaints')
        .delete()
        .eq('id', complaintId);

      if (error) throw error;

      setComplaints(prev => prev.filter(complaint => complaint.id !== complaintId));
      toast({
        title: "Success",
        description: "Complaint deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting complaint:', error);
      toast({
        title: "Error",
        description: "Failed to delete complaint. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchComplaints();

    // Set up real-time subscription for status updates
    const subscription = supabase
      .channel('complaint-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'complaints',
          filter: `user_id=eq.${user?.id}`,
        },
        (payload) => {
          const updatedComplaint = payload.new as Complaint;
          setComplaints(prev => 
            prev.map(complaint => 
              complaint.id === updatedComplaint.id ? updatedComplaint : complaint
            )
          );
          
          toast({
            title: "Status Updated",
            description: `Your complaint "${updatedComplaint.title}" status changed to ${updatedComplaint.status}`,
          });
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <p className="text-muted-foreground">Track the status of your reported issues</p>
        </div>
        <Button onClick={fetchComplaints} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {complaints.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No complaints yet</h3>
            <p className="text-muted-foreground mb-4">
              You haven't reported any issues yet. Start by reporting a civic issue.
            </p>
            <Button onClick={() => window.location.href = '/report'}>
              Report an Issue
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {complaints.map((complaint) => (
            <Card key={complaint.id} className="shadow-soft transition-smooth hover:shadow-elegant">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{complaint.title}</CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(complaint.created_at)}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {complaint.location}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={statusColors[complaint.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}
                    >
                      {complaint.status}
                    </Badge>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-background border border-border">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-foreground">Delete Complaint</AlertDialogTitle>
                          <AlertDialogDescription className="text-muted-foreground">
                            Are you sure you want to delete this complaint? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-background text-foreground border border-border hover:bg-muted">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteComplaint(complaint.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <Badge variant="outline">{complaint.category}</Badge>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-muted-foreground">{complaint.description}</p>
                </div>

                {((complaint.image_urls && complaint.image_urls.length > 0) || complaint.image_url) && (
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      {complaint.image_urls && complaint.image_urls.length > 1 ? 'Photos' : 'Photo'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {complaint.image_urls && complaint.image_urls.length > 0 ? (
                        complaint.image_urls.map((url, index) => (
                          <img
                            key={index}
                            src={url}
                            alt={`Complaint photo ${index + 1}`}
                            className="rounded-lg max-w-sm max-h-48 object-cover border border-border"
                          />
                        ))
                      ) : complaint.image_url ? (
                        <img
                          src={complaint.image_url}
                          alt="Complaint"
                          className="rounded-lg max-w-sm max-h-48 object-cover border border-border"
                        />
                      ) : null}
                    </div>
                  </div>
                )}

                {complaint.updated_at !== complaint.created_at && (
                  <div className="text-sm text-muted-foreground">
                    Last updated: {formatDate(complaint.updated_at)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}