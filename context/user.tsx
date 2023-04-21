import { createContext, ReactNode, useContext, useState } from 'react';
import { User } from '../api/userEndpoint';
import { Permission } from '../api/config/permissions';

const DEFAULT_DURATION = 5000;

export type UserContext = {
  user: User;
  setUser: (user: User) => void;
  can: (permissions: Permission | Permission[]) => boolean;
  canAny: (permissions: Permission | Permission[]) => boolean;
  cannot: (permissions: Permission | Permission[]) => boolean;
  cannotAny: (permissions: Permission | Permission[]) => boolean;
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

  const can = (permissions: Permission | Permission[]) => {
    permissions = [permissions].flat();

    return permissions.every((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const canAny = (permissions: Permission | Permission[]) => {
    permissions = [permissions].flat();

    return permissions.some((permission) =>
      user.permissions?.includes(permission)
    );
  };

  const cannot = (permissions: Permission | Permission[]) => {
    permissions = [permissions].flat();

    return permissions.every(
      (permission) => !user.permissions?.includes(permission)
    );
  };

  const cannotAny = (permissions: Permission | Permission[]) => {
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
