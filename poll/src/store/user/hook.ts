import {
  createUserSelector,
  hasHydratedSelector,
  removeUserSelector,
  userSelector,
  useUserStore,
} from './index.ts';
import {useCallback} from 'react';
import {User} from './type.ts';

export function useUser() {
  return useUserStore(userSelector);
}

export function useHasHydrated() {
  return useUserStore(hasHydratedSelector);
}

export function useCreateUser() {
  const createUser = useUserStore(createUserSelector);
  return useCallback((user: User) => createUser(user), [createUser]);
}

export function useRemoveUser() {
  const removeUser = useUserStore(removeUserSelector);
  return useCallback(() => {
    removeUser();
  }, [removeUser]);
}
