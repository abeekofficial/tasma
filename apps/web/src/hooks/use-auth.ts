import { useState, useEffect } from 'react';

// This is a placeholder for better-auth integration
export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [session, setSession] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSession = async () => {
    setIsLoading(true);
    try {
      // Replace with actual better-auth client call
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/session`, {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSession(data.session);
      } else {
        setUser(null);
        setSession(null);
      }
    } catch (err) {
      setUser(null);
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const signOut = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signout`, {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setSession(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refetch: fetchSession
  };
}
