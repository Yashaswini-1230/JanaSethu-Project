import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  AlertTriangle, 
  Plus, 
  Clock,
  Info,
  AlertCircle
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Alert {
  id: string;
  title: string;
  description: string;
  priority: 'Normal' | 'High';
  created_at: string;
}

export default function Alerts() {
  const { userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    title: '',
    description: '',
    priority: 'Normal' as 'Normal' | 'High'
  });

  // Fetch alerts
  const { data: alerts, isLoading } = useQuery({
    queryKey: ['alerts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Alert[];
    }
  });

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('alerts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'alerts'
        },
        (payload) => {
          console.log('New alert received:', payload);
          queryClient.invalidateQueries({ queryKey: ['alerts'] });
          
          // Show toast notification for new alerts
          const newAlert = payload.new as Alert;
          toast({
            title: "New Alert",
            description: newAlert.title,
            variant: newAlert.priority === 'High' ? 'destructive' : 'default',
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, toast]);

  // Create alert mutation
  const createAlert = useMutation({
    mutationFn: async (alertData: typeof newAlert) => {
      const { data, error } = await supabase
        .from('alerts')
        .insert({
          title: alertData.title,
          description: alertData.description,
          priority: alertData.priority
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Alert published",
        description: "The alert has been published to all citizens.",
      });
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
      setShowCreateForm(false);
      setNewAlert({ title: '', description: '', priority: 'Normal' });
    },
    onError: (error) => {
      toast({
        title: "Publication failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAlert.title.trim() || !newAlert.description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    createAlert.mutate(newAlert);
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'High' ? (
      <AlertCircle className="h-5 w-5 text-red-500" />
    ) : (
      <Info className="h-5 w-5 text-blue-500" />
    );
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'High' 
      ? 'bg-red-100 text-red-800 border-red-200' 
      : 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Alerts</h1>
          <p className="text-muted-foreground">Stay informed about important community updates.</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post Alert
          </Button>
        )}
      </div>

      {/* Create Alert Form */}
      {showCreateForm && userRole === 'admin' && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Post New Alert
            </CardTitle>
            <CardDescription>Share important information with the community.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAlert} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Alert Title</Label>
                <Input
                  id="title"
                  placeholder="Brief, clear title for the alert"
                  value={newAlert.title}
                  onChange={(e) => setNewAlert({ ...newAlert, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the alert"
                  value={newAlert.description}
                  onChange={(e) => setNewAlert({ ...newAlert, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select 
                  value={newAlert.priority} 
                  onValueChange={(value: 'Normal' | 'High') => setNewAlert({ ...newAlert, priority: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Normal">
                      <div className="flex items-center gap-2">
                        <Info className="h-4 w-4 text-blue-500" />
                        Normal - General information
                      </div>
                    </SelectItem>
                    <SelectItem value="High">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        High - Urgent attention required
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createAlert.isPending}>
                  {createAlert.isPending ? 'Publishing...' : 'Publish Alert'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Alerts Feed */}
      <div className="space-y-4">
        {alerts?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No alerts at this time.</p>
              {userRole === 'admin' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Post alerts to keep the community informed.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          alerts?.map((alert) => (
            <Card 
              key={alert.id} 
              className={cn(
                "transition-all duration-200",
                alert.priority === 'High' 
                  ? "border-red-200 shadow-red-100 shadow-lg" 
                  : "border-border"
              )}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getPriorityIcon(alert.priority)}
                    <div>
                      <CardTitle className="text-lg">{alert.title}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Clock className="h-4 w-4" />
                        {formatRelativeTime(alert.created_at)}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getPriorityColor(alert.priority)}>
                    {alert.priority} Priority
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {alert.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}