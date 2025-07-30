import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Upload, CheckCircle, Clock, XCircle, FileText } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function Verification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    documentType: '',
    file: null as File | null
  });

  // Fetch existing verification
  const { data: verification, isLoading } = useQuery({
    queryKey: ['verification', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('verifications')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const submitVerification = useMutation({
    mutationFn: async ({ name, documentType, file }: { name: string; documentType: string; file: File }) => {
      if (!user) throw new Error('Not authenticated');

      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      // Insert verification record
      const { data, error } = await supabase
        .from('verifications')
        .insert({
          user_id: user.id,
          name,
          document_type: documentType,
          document_url: publicUrl
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Verification submitted",
        description: "Your documents have been submitted for review.",
      });
      queryClient.invalidateQueries({ queryKey: ['verification'] });
      setFormData({ name: '', documentType: '', file: null });
    },
    onError: (error) => {
      toast({
        title: "Submission failed",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.documentType || !formData.file) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields and upload a document.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await submitVerification.mutateAsync(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'Rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-32 bg-muted rounded-lg mb-6"></div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary">
          <Shield className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold">Account Verification</h1>
        <p className="text-muted-foreground">
          Verify your identity to unlock additional features and increase trust in the community.
        </p>
      </div>

      {verification ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  {getStatusIcon(verification.status)}
                  Verification Status
                </CardTitle>
                <CardDescription>
                  Submitted on {new Date(verification.created_at).toLocaleDateString()}
                </CardDescription>
              </div>
              <Badge className={getStatusColor(verification.status)}>
                {verification.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-sm text-muted-foreground">{verification.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Document Type</Label>
              <p className="text-sm text-muted-foreground">{verification.document_type}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Document</Label>
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Document uploaded</span>
              </div>
            </div>
            {verification.status === 'Pending' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  Your verification is being reviewed by our admin team. This process typically takes 1-2 business days.
                </p>
              </div>
            )}
            {verification.status === 'Approved' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  Congratulations! Your account has been verified. You now have access to all platform features.
                </p>
              </div>
            )}
            {verification.status === 'Rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800">
                  Your verification was not approved. Please contact support for more information or submit new documents.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Submit Verification Documents</CardTitle>
            <CardDescription>
              Upload a government-issued ID or proof of residence to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name as on document"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="documentType">Document Type</Label>
                <Select
                  value={formData.documentType}
                  onValueChange={(value) => setFormData({ ...formData, documentType: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Aadhar Card">Aadhar Card</SelectItem>
                    <SelectItem value="Voter ID">Voter ID</SelectItem>
                    <SelectItem value="Water Bill">Water Bill</SelectItem>
                    <SelectItem value="Electricity Bill">Electricity Bill</SelectItem>
                    <SelectItem value="Driving License">Driving License</SelectItem>
                    <SelectItem value="Passport">Passport</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="document">Upload Document</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    id="document"
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setFormData({ ...formData, file });
                      }
                    }}
                    className="hidden"
                    required
                  />
                  <label htmlFor="document" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">
                      {formData.file ? formData.file.name : 'Click to upload document'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supports: JPG, PNG, PDF (Max 10MB)
                    </p>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit for Verification'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}