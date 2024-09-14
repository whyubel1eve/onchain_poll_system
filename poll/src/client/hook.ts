import {privateKeyToAccount} from 'viem/accounts';
import {createWalletClient, http} from 'viem';
import {useUser} from '../store/user/hook.ts';
import {arbitrumSepolia} from 'viem/chains';
import {useMemo} from 'react';

export function useClient() {
  const user = useUser();
  const account = useMemo(() => {
    return user.privateKey && privateKeyToAccount(user.privateKey);
  }, [user.privateKey]);

  return useMemo(() => {
    return createWalletClient({
      account,
      chain: arbitrumSepolia,
      transport: http(),
    });
  }, [account]);
}
