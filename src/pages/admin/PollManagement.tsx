import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Plus, Trash2, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  expires_at: string | null;
  created_at: string;
}

interface PollManagementProps {
  onStatsUpdate: () => void;
}

export default function PollManagement({ onStatsUpdate }: PollManagementProps) {
  const { toast } = useToast();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    expires_at: ''
  });

  const fetchPolls = async () => {
    try {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedData = (data || []).map(poll => ({
        ...poll,
        options: Array.isArray(poll.options) ? (poll.options as string[]) : [],
        votes: typeof poll.votes === 'object' && poll.votes ? poll.votes as Record<string, number> : {}
      }));
      
      setPolls(formattedData);
    } catch (error) {
      console.error('Error fetching polls:', error);
      toast({
        title: 'Error',
        description: 'Failed to load polls.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      question: '',
      options: ['', ''],
      expires_at: ''
    });
  };

  const addOption = () => {
    if (formData.options.length < 6) {
      setFormData({
        ...formData,
        options: [...formData.options, '']
      });
    }
  };

  const removeOption = (index: number) => {
    if (formData.options.length > 2) {
      setFormData({
        ...formData,
        options: formData.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateLoading(true);

    try {
      const filteredOptions = formData.options.filter(option => option.trim() !== '');
      
      if (filteredOptions.length < 2) {
        toast({
          title: 'Invalid Options',
          description: 'Please provide at least 2 options.',
          variant: 'destructive',
        });
        return;
      }

      // Get user's pin_code using the function that checks both profile and admin verification
      const { data: user } = await supabase.auth.getUser();
      const { data: userColonyCode, error: colonyError } = await supabase
        .rpc('get_user_colony_code', { user_id: user.user?.id });

      if (colonyError) {
        console.error('Error fetching user colony code:', colonyError);
      }

      const { error } = await supabase
        .from('polls')
        .insert({
          question: formData.question,
          options: filteredOptions,
          expires_at: formData.expires_at || null,
          votes: {},
          pin_code: userColonyCode || null
        });

      if (error) throw error;

      toast({
        title: 'Success!',
        description: 'Poll created successfully.',
      });

      resetForm();
      setDialogOpen(false);
      fetchPolls();
      onStatsUpdate();

    } catch (error) {
      console.error('Error creating poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to create poll.',
        variant: 'destructive',
      });
    } finally {
      setCreateLoading(false);
    }
  };

  const deletePoll = async (pollId: string) => {
    try {
      const { error } = await supabase
        .from('polls')
        .delete()
        .eq('id', pollId);

      if (error) throw error;

      setPolls(prev => prev.filter(poll => poll.id !== pollId));
      toast({
        title: 'Success',
        description: 'Poll deleted successfully.',
      });
      onStatsUpdate();
    } catch (error) {
      console.error('Error deleting poll:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete poll.',
        variant: 'destructive',
      });
    }
  };

  const getTotalVotes = (poll: Poll) => {
    return Object.values(poll.votes || {}).reduce((sum: number, count: number) => sum + count, 0);
  };

  const getOptionPercentage = (poll: Poll, option: string) => {
    const totalVotes = getTotalVotes(poll);
    if (totalVotes === 0) return 0;
    return ((poll.votes?.[option] || 0) / totalVotes) * 100;
  };

  const isExpired = (poll: Poll) => {
    if (!poll.expires_at) return false;
    return new Date(poll.expires_at) < new Date();
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Poll Management
              </CardTitle>
              <CardDescription>
                Create and manage community polls
              </CardDescription>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Poll
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create New Poll</DialogTitle>
                  <DialogDescription>
                    Create a poll to gather community opinions.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="question">Poll Question *</Label>
                    <Input
                      id="question"
                      value={formData.question}
                      onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                      placeholder="e.g., Should we install more streetlights?"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label>Options * (2-6 options)</Label>
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={option}
                          onChange={(e) => updateOption(index, e.target.value)}
                          placeholder={`Option ${index + 1}`}
                          required
                        />
                        {formData.options.length > 2 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => removeOption(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                    {formData.options.length < 6 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addOption}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Option
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                    <Input
                      id="expires_at"
                      type="datetime-local"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createLoading}>
                      {createLoading ? 'Creating...' : 'Create Poll'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Polls List */}
      <div className="space-y-4">
        {polls.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Polls Yet</h3>
              <p className="text-muted-foreground">
                Create your first community poll to gather opinions.
              </p>
            </CardContent>
          </Card>
        ) : (
          polls.map((poll) => (
            <Card key={poll.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{poll.question}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Total votes: {getTotalVotes(poll)}</span>
                      {poll.expires_at && (
                        <span className={isExpired(poll) ? 'text-red-500' : ''}>
                          {isExpired(poll) ? 'Expired' : 'Expires'}: {new Date(poll.expires_at).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Poll</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this poll? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deletePoll(poll.id)}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                <div className="space-y-3">
                  {Array.isArray(poll.options) && poll.options.map((option: string, index: number) => {
                    const votes = poll.votes?.[option] || 0;
                    const percentage = getOptionPercentage(poll, option);
                    
                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{option}</span>
                          <span>{votes} votes ({percentage.toFixed(1)}%)</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}