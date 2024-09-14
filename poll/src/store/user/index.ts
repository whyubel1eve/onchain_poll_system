import {create} from 'zustand';
import {User} from './type.ts';
import {createJSONStorage, persist} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useUserStore = create(
  persist(
    set => ({
      user: {
        name: undefined,
        id: undefined,
        address: undefined,
        privateKey: undefined,
      },

      _hasHydrated: false,
      setHasHydrated: (state: any) => {
        set({
          _hasHydrated: state,
        });
      },

      createUser: (newUser: User) => set({user: newUser, ready: true}),
      removeUser: () =>
        set({
          user: {
            name: undefined,
            id: undefined,
            address: undefined,
            privateKey: undefined,
          },
        }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state: any) => {
        state.setHasHydrated(true);
      },
    },
  ),
);

export const userSelector = (state: any) => state.user;
export const hasHydratedSelector = (state: any) => state._hasHydrated;
export const createUserSelector = (state: any) => state.createUser;
export const removeUserSelector = (state: any) => state.removeUser;
