import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Shield, Timer, LogOut } from 'lucide-react';

export function AdminPINEntry() {
  const { isAdminSession, adminSessionExpiry, enterAdminMode, exitAdminMode } = useAuth();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await enterAdminMode(pin);
    
    if (result.success) {
      setPin('');
      setOpen(false);
    } else {
      // Error toast will be shown by the enterAdminMode function
    }
    
    setLoading(false);
  };

  const formatTimeRemaining = () => {
    if (!adminSessionExpiry) return '';
    
    const now = new Date();
    const remaining = adminSessionExpiry.getTime() - now.getTime();
    
    if (remaining <= 0) return 'Expired';
    
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (isAdminSession) {
    return (
      <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
        <Shield className="h-4 w-4 text-primary" />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-primary">Admin Mode Active</p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Timer className="h-3 w-3" />
            {formatTimeRemaining()}
          </div>
        </div>
        <Button 
          size="sm" 
          variant="outline" 
          onClick={exitAdminMode}
          className="h-6 px-2 text-xs"
        >
          <LogOut className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Shield className="h-4 w-4 mr-2" />
          Enter Admin Mode
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enter Admin Mode</DialogTitle>
          <DialogDescription>
            Enter the admin PIN to gain administrative privileges for 8 hours.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">Admin PIN</Label>
            <Input
              id="pin"
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter admin PIN"
              required
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !pin.trim()}>
              {loading ? 'Verifying...' : 'Activate Admin Mode'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}