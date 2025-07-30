import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Vote, Plus, Clock, Users, CheckCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, string[]>;
  created_at: string;
  expires_at?: string;
}

export default function Polls() {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  });

  // Fetch polls
  const { data: polls, isLoading } = useQuery({
    queryKey: ['polls'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('polls')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Poll[];
    }
  });

  // Create poll mutation
  const createPoll = useMutation({
    mutationFn: async (pollData: { question: string; options: string[] }) => {
      const { data, error } = await supabase
        .from('polls')
        .insert({
          question: pollData.question,
          options: pollData.options,
          votes: {}
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Poll created",
        description: "Your poll has been created successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['polls'] });
      setShowCreateForm(false);
      setNewPoll({ question: '', options: ['', ''] });
    },
    onError: (error) => {
      toast({
        title: "Creation failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async ({ pollId, optionIndex }: { pollId: string; optionIndex: number }) => {
      if (!user) throw new Error('Not authenticated');

      // Get current poll data
      const { data: poll, error: fetchError } = await supabase
        .from('polls')
        .select('votes')
        .eq('id', pollId)
        .single();

      if (fetchError) throw fetchError;

      const currentVotes = poll.votes || {};
      
      // Remove user's previous vote if exists
      Object.keys(currentVotes).forEach(option => {
        if (currentVotes[option]) {
          currentVotes[option] = currentVotes[option].filter((userId: string) => userId !== user.id);
        }
      });

      // Add new vote
      const optionKey = optionIndex.toString();
      if (!currentVotes[optionKey]) {
        currentVotes[optionKey] = [];
      }
      currentVotes[optionKey].push(user.id);

      // Update poll
      const { error: updateError } = await supabase
        .from('polls')
        .update({ votes: currentVotes })
        .eq('id', pollId);

      if (updateError) throw updateError;
    },
    onSuccess: () => {
      toast({
        title: "Vote submitted",
        description: "Your vote has been recorded.",
      });
      queryClient.invalidateQueries({ queryKey: ['polls'] });
    },
    onError: (error) => {
      toast({
        title: "Vote failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] });
  };

  const removeOption = (index: number) => {
    if (newPoll.options.length > 2) {
      setNewPoll({
        ...newPoll,
        options: newPoll.options.filter((_, i) => i !== index)
      });
    }
  };

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...newPoll.options];
    updatedOptions[index] = value;
    setNewPoll({ ...newPoll, options: updatedOptions });
  };

  const handleCreatePoll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPoll.question.trim() || newPoll.options.some(opt => !opt.trim())) {
      toast({
        title: "Invalid poll",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    createPoll.mutate(newPoll);
  };

  const getUserVote = (poll: Poll) => {
    if (!user || !poll.votes) return null;
    
    for (const [optionIndex, voterIds] of Object.entries(poll.votes)) {
      if (voterIds && voterIds.includes(user.id)) {
        return parseInt(optionIndex);
      }
    }
    return null;
  };

  const getTotalVotes = (poll: Poll) => {
    if (!poll.votes) return 0;
    return Object.values(poll.votes).reduce((total, voters) => total + (voters?.length || 0), 0);
  };

  const getOptionVotes = (poll: Poll, optionIndex: number) => {
    return poll.votes?.[optionIndex.toString()]?.length || 0;
  };

  const getVotePercentage = (poll: Poll, optionIndex: number) => {
    const totalVotes = getTotalVotes(poll);
    if (totalVotes === 0) return 0;
    return (getOptionVotes(poll, optionIndex) / totalVotes) * 100;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-48 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
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
          <h1 className="text-3xl font-bold">Community Polls</h1>
          <p className="text-muted-foreground">Participate in community decision making.</p>
        </div>
        {userRole === 'admin' && (
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Poll
          </Button>
        )}
      </div>

      {/* Create Poll Form */}
      {showCreateForm && userRole === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Poll</CardTitle>
            <CardDescription>Ask the community a question with multiple options.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePoll} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea
                  id="question"
                  placeholder="What would you like to ask the community?"
                  value={newPoll.question}
                  onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Options</Label>
                {newPoll.options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={`Option ${index + 1}`}
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      required
                    />
                    {newPoll.options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addOption}
                  className="w-full"
                >
                  Add Option
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createPoll.isPending}>
                  {createPoll.isPending ? 'Creating...' : 'Create Poll'}
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

      {/* Polls List */}
      <div className="space-y-6">
        {polls?.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No polls available yet.</p>
              {userRole === 'admin' && (
                <p className="text-sm text-muted-foreground mt-2">
                  Create the first poll to get community input.
                </p>
              )}
            </CardContent>
          </Card>
        ) : (
          polls?.map((poll) => {
            const userVote = getUserVote(poll);
            const totalVotes = getTotalVotes(poll);
            const hasVoted = userVote !== null;

            return (
              <Card key={poll.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{poll.question}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(poll.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                        </span>
                      </CardDescription>
                    </div>
                    {hasVoted && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Voted
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {poll.options.map((option, index) => {
                    const votes = getOptionVotes(poll, index);
                    const percentage = getVotePercentage(poll, index);
                    const isSelected = userVote === index;

                    return (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Button
                            variant={isSelected ? "default" : "outline"}
                            className="flex-1 justify-start text-left"
                            onClick={() => {
                              if (!hasVoted) {
                                voteMutation.mutate({ pollId: poll.id, optionIndex: index });
                              }
                            }}
                            disabled={voteMutation.isPending || hasVoted}
                          >
                            {option}
                            {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
                          </Button>
                          <span className="ml-3 text-sm text-muted-foreground min-w-[60px] text-right">
                            {votes} ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        {totalVotes > 0 && (
                          <Progress 
                            value={percentage} 
                            className="h-2"
                          />
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}