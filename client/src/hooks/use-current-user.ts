import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useCurrentUser() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/current-user`, {
        credentials: 'include'  // Important!
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      return response.json();
    }
  });

  return { user, isLoading, error };
}