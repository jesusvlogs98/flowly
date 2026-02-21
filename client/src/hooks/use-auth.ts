export function useAuth() {
  // Mock auth for guest access - no user interface/logout needed
  return {
    user: {
      id: "guest_user_123",
      username: "guest",
      firstName: "Guest",
      displayName: "Guest User",
      email: "guest@example.com"
    },
    isLoading: false,
    isAuthenticated: true,
    logout: () => {}, // No-op
    isLoggingOut: false,
  };
}

/* Original Auth Hook (Commented out for now)
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/models/auth";

async function fetchUser(): Promise<User | null> {
...
*/
