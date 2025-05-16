import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { User, UserRole } from '@/lib/types';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string, role: UserRole, bio?: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const mapSupabaseUser = async (supabaseUser: SupabaseUser | null): Promise<User | null> => {
    if (!supabaseUser) return null;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();
      
      if (error) throw error;
      
      if (!profile) return null;

      return {
        id: profile.id,
        name: profile.name || '',
        email: profile.email || '',
        role: profile.role as UserRole || UserRole.CUSTOMER,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        isVerified: profile.is_verified,
        isPublic: profile.is_public,
        createdAt: new Date(profile.created_at)
      };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        
        setTimeout(async () => {
          if (currentSession?.user) {
            const mappedUser = await mapSupabaseUser(currentSession.user);
            setUser(mappedUser);
          } else {
            setUser(null);
          }
          setLoading(false);
        }, 0);
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: currentSession } }) => {
      setSession(currentSession);
      
      if (currentSession?.user) {
        const mappedUser = await mapSupabaseUser(currentSession.user);
        setUser(mappedUser);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      toast.success("Login successful", {
        description: "Welcome back to Threadly!"
      });
    } catch (error: any) {
      toast.error("Login failed", {
        description: error.message || "Please check your credentials and try again."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string, role: UserRole, bio?: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
            bio
          },
          emailRedirectTo: undefined,
        },
      });
      
      if (error) throw error;
      
      toast.success("Registration successful", {
        description: "Your account has been created. Welcome to Threadly!"
      });
    } catch (error: any) {
      toast.error("Registration failed", {
        description: error.message || "Please check your information and try again."
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      toast.error("Logout failed", {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from('profiles')
        .update({
          name: updates.name,
          bio: updates.bio,
          avatar_url: updates.avatar_url,
          is_public: updates.isPublic,
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({ ...user, ...updates });
      
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error("Update failed", {
        description: error.message
      });
      throw error;
    }
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    try {
      if (!user) throw new Error("Not authenticated");
      
      const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          upsert: true,
        });
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error: any) {
      toast.error("Upload failed", {
        description: error.message
      });
      return null;
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
    uploadAvatar
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
