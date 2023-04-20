import { useRouter, useSegments } from 'expo-router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import * as SecureStore from 'expo-secure-store';
import { useUser } from './user';
import { useQueryClient } from 'react-query';
import { useNotification } from './notification';
import { prefetchUser } from '../api/userEndpoint';

export type Tokens = {
  token: string;
  refreshToken: string;
};

export type AuthContext = {
  storeTokens: (token: string, refreshToken: string) => void;
  login: (token: string, refreshToken: string) => void;
  logout: () => void;
  tokens: Tokens | null;
};

const AuthContext = createContext<AuthContext>({} as AuthContext);

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(tokens: Tokens | null) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === '(auth)';

    if (!tokens && !inAuthGroup) {
      router.replace('/login');
    } else if (tokens && inAuthGroup) {
      router.replace('/dashboard');
    }
  }, [segments]);
}

type AuthProviderProps = {
  tokens: Tokens | null;
  children?: ReactNode;
};

export function Provider(props: AuthProviderProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUser();
  const notification = useNotification();

  const [tokens, setTokens] = useState<Tokens | null>(props.tokens);

  const storeTokens = async (token: string, refreshToken: string) => {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('refreshToken', refreshToken);

    setTokens({
      token,
      refreshToken,
    });
  };

  const login = async (token: string, refreshToken: string) => {
    await storeTokens(token, refreshToken);

    const user = await prefetchUser(queryClient, token).catch((error) =>
      console.log(error)
    );

    if (!user) {
      notification.showNotification(
        'Es ist ein Fehler beim Laden des Profils aufgetreten.',
        'danger'
      );
      router.replace('/login');
    }

    setUser(user);

    router.replace('/dashboard');
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('refreshToken');

    setTokens(null);

    queryClient.getQueryCache().clear();

    router.replace('/login');
  };

  useProtectedRoute(tokens);

  return (
    <AuthContext.Provider
      value={{
        storeTokens: (token: string, refreshToken: string) =>
          storeTokens(token, refreshToken),
        login: (token: string, refreshToken: string) =>
          login(token, refreshToken),
        logout: () => logout(),
        tokens,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
