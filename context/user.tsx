import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../api/userEndpoint';

const DEFAULT_DURATION = 5000;

export type UserContext = {
  user: User;
  setUser: (user: User) => void;
  can: (permissions: string | string[]) => boolean;
  canAny: (permissions: string | string[]) => boolean;
  cannot: (permissions: string | string[]) => boolean;
  cannotAny: (permissions: string | string[]) => boolean;
};

const UserContext = createContext<UserContext>({} as UserContext);

export function useUser() {
  return useContext(UserContext);
}

type UserProviderProps = {
  initialUser: User | null;
  children?: ReactNode;
};

export function Provider({ initialUser, children }: UserProviderProps) {
  const [user, setUser] = useState(initialUser || ({} as User));

  const can = (permissions: string | string[]) => {
    permissions = [permissions].flat();

    return permissions.every((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const canAny = (permissions: string | string[]) => {
    permissions = [permissions].flat();

    return permissions.some((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const cannot = (permissions: string | string[]) => {
    permissions = [permissions].flat();

    return permissions.every(
      (permission) => !user.permissions?.includes(permission)
    );
  };

  const cannotAny = (permissions: string | string[]) => {
    permissions = [permissions].flat();

    return permissions.some(
      (permission) => !user.permissions?.includes(permission)
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        can,
        canAny,
        cannot,
        cannotAny,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
