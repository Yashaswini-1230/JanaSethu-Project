import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, FileText, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminVerification() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    colonyCode: '',
    colonyName: '',
    document: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, document: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.document) return;

    setLoading(true);
    try {
      // Upload document to storage
      const fileExt = formData.document.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('verification-documents')
        .upload(fileName, formData.document);

      if (uploadError) throw uploadError;

      // Get the file URL
      const { data: { publicUrl } } = supabase.storage
        .from('verification-documents')
        .getPublicUrl(fileName);

      // Submit verification request
      const { error: insertError } = await supabase
        .from('admin_verifications')
        .insert({
          user_id: user.id,
          colony_code: formData.colonyCode,
          colony_name: formData.colonyName,
          document_url: publicUrl,
          status: 'Pending'
        });

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: "Admin verification request submitted successfully.",
      });

      setFormData({ colonyCode: '', colonyName: '', document: null });
    } catch (error) {
      console.error('Error submitting verification:', error);
      toast({
        title: "Error",
        description: "Failed to submit verification request.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Admin Verification Request
          </CardTitle>
          <CardDescription>
            Submit your documents to request admin privileges for your colony
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please ensure all information is accurate. Admin verification requests are reviewed manually and may take 1-3 business days.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="colonyCode">Colony Code</Label>
              <Input
                id="colonyCode"
                value={formData.colonyCode}
                onChange={(e) => setFormData(prev => ({ ...prev, colonyCode: e.target.value }))}
                placeholder="Enter your colony code"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colonyName">Colony Name</Label>
              <Input
                id="colonyName"
                value={formData.colonyName}
                onChange={(e) => setFormData(prev => ({ ...prev, colonyName: e.target.value }))}
                placeholder="Enter your colony name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Verification Document</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <Label htmlFor="document" className="cursor-pointer">
                    <span className="text-primary hover:text-primary/80">Upload a file</span>
                    <Input
                      id="document"
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      required
                    />
                  </Label>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, JPG, JPEG, PNG up to 10MB
                  </p>
                </div>
                {formData.document && (
                  <p className="mt-2 text-sm text-green-600">
                    Selected: {formData.document.name}
                  </p>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !formData.document}
            >
              {loading ? "Submitting..." : "Submit Verification Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}