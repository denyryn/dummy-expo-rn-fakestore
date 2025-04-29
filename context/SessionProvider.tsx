import {
  useContext,
  createContext,
  type PropsWithChildren,
  useState,
} from "react";
import { useStorageState } from "@/utils/useStorageState";

type AuthContextType = {
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (
    username: string,
    password: string,
    confirmPassword: string,
    email: string
  ) => Promise<void>;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  error: string | null;
};

type AuthResponse = {
  token?: string;
};

type RegisterResponse = {
  id?: number;
  username: "string";
  email: "string";
  password: "string";
};

const AuthContext = createContext<AuthContextType>({
  signIn: async () => Promise.resolve(undefined),
  signUp: async () => Promise.resolve(undefined),
  signOut: () => null,
  session: null,
  isLoading: false,
  error: null,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isStorageLoading, session], setSession] = useStorageState("session");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = async (username: string, password: string) => {
    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setError(null);
    setIsSigningIn(true);

    try {
      const apiUrl = process.env.FAKE_STORE_API_URL;
      if (!apiUrl) {
        throw new Error("API endpoint not configured");
      }

      const res = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        throw new Error(
          res.status === 401
            ? "Invalid credentials"
            : "Login failed, please try again"
        );
      }

      const data: AuthResponse = await res.json();
      if (!data?.token) {
        throw new Error("Invalid response from server");
      }

      setSession(data.token);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const signUp = async (
    // id: number = 80,
    username: string,
    password: string,
    confirmPassword: string,
    email: string
  ) => {
    // Input validation
    if (!username || !password || !confirmPassword || !email) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setError(null);
    setIsSigningIn(true);

    try {
      const apiUrl = process.env.FAKE_STORE_API_URL;
      if (!apiUrl) {
        throw new Error("API endpoint not configured");
      }

      const res = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            (res.status === 401
              ? "Invalid credentials"
              : "Registration failed, please try again")
        );
      }

      const data: RegisterResponse = await res.json();

      // Auto-login after successful registration
      await signIn(username, password);
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : "An unknown error occurred"
      );
    } finally {
      setIsSigningIn(false);
    }
  };

  const signOut = () => {
    setSession(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signUp,
        signOut,
        session,
        isLoading: isStorageLoading || isSigningIn,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
