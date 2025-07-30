import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: 'citizen' | 'admin' | null;
  isAdminSession: boolean;
  adminSessionExpiry: Date | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  enterAdminMode: (pin: string) => Promise<{ success: boolean; error?: string }>;
  exitAdminMode: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<'citizen' | 'admin' | null>(null);
  const [isAdminSession, setIsAdminSession] = useState(false);
  const [adminSessionExpiry, setAdminSessionExpiry] = useState<Date | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Check admin session status
  const checkAdminSession = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('admin_sessions')
        .select('expires_at')
        .eq('user_id', userId)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (data) {
        setIsAdminSession(true);
        setAdminSessionExpiry(new Date(data.expires_at));
        return true;
      } else {
        setIsAdminSession(false);
        setAdminSessionExpiry(null);
        return false;
      }
    } catch (error) {
      setIsAdminSession(false);
      setAdminSessionExpiry(null);
      return false;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile and role
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('user_id', session.user.id)
                .single();
              
              setUserRole(profile?.role || 'citizen');
              
              // Check for active admin session
              await checkAdminSession(session.user.id);
            } catch (error) {
              console.error('Error fetching user role:', error);
              setUserRole('citizen');
            }
          }, 0);
        } else {
          setUserRole(null);
          setIsAdminSession(false);
          setAdminSessionExpiry(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (!session) {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, fullName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        }
      }
    });
    
    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Check your email",
        description: "We've sent you a confirmation link.",
      });
    }
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    }
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setIsAdminSession(false);
    setAdminSessionExpiry(null);
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };

  const enterAdminMode = async (pin: string) => {
    if (!user) {
      toast({
        title: "Authentication error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return { success: false, error: "User not authenticated" };
    }

    try {
      console.log('Attempting to validate admin PIN for user:', user.id);
      
      // Validate PIN using the database function
      const { data, error } = await supabase.rpc('validate_admin_pin', { pin_input: pin });
      
      console.log('PIN validation result:', { data, error });
      
      if (error) {
        console.error('PIN validation error:', error);
        toast({
          title: "Validation error",
          description: "Failed to validate PIN",
          variant: "destructive",
        });
        return { success: false, error: "Failed to validate PIN" };
      }
      
      if (!data) {
        toast({
          title: "Invalid PIN",
          description: "The PIN you entered is incorrect",
          variant: "destructive",
        });
        return { success: false, error: "Invalid PIN" };
      }

      // Create admin session
      console.log('Creating admin session for user:', user.id);
      const { data: sessionId, error: sessionError } = await supabase.rpc('create_admin_session', { 
        user_id: user.id 
      });

      console.log('Admin session creation result:', { sessionId, sessionError });

      if (sessionError) {
        console.error('Session creation error:', sessionError);
        toast({
          title: "Session error",
          description: "Failed to create admin session",
          variant: "destructive",
        });
        return { success: false, error: "Failed to create admin session" };
      }

      // Update local state
      setIsAdminSession(true);
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + 8); // 8 hour session
      setAdminSessionExpiry(expiry);

      toast({
        title: "Admin mode activated",
        description: "You now have admin privileges for 8 hours.",
      });

      return { success: true };
    } catch (error) {
      console.error('Error entering admin mode:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return { success: false, error: "An error occurred" };
    }
  };

  const exitAdminMode = async () => {
    if (!user) return;

    try {
      // Delete admin session
      await supabase
        .from('admin_sessions')
        .delete()
        .eq('user_id', user.id);

      setIsAdminSession(false);
      setAdminSessionExpiry(null);

      toast({
        title: "Admin mode deactivated",
        description: "You have exited admin mode.",
      });
    } catch (error) {
      console.error('Error exiting admin mode:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      userRole,
      isAdminSession,
      adminSessionExpiry,
      loading,
      signUp,
      signIn,
      signOut,
      enterAdminMode,
      exitAdminMode,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}