import {createWalletClient, getContract, http} from 'viem';
import {useClient} from '../client/hook.ts';
import {POLL_ABI} from '../abi/poll.ts';
import {useMemo} from 'react';
import {arbitrumSepolia} from 'viem/chains';
import {privateKeyToAccount} from 'viem/accounts';

export function useContract() {
  const client = useClient();
  return useMemo(() => {
    return getContract({
      address: '0x718640f43391Fd235D1D04b064f0F2E3D36E033f',
      abi: POLL_ABI,
      client,
    });
  }, [client]);
}

export function useAdminContract() {
  const account = privateKeyToAccount('0x666');
  const client = createWalletClient({
    account,
    chain: arbitrumSepolia,
    transport: http(),
  });
  return useMemo(() => {
    return getContract({
      address: '0x718640f43391Fd235D1D04b064f0F2E3D36E033f',
      abi: POLL_ABI,
      client,
    });
  }, [client]);
}
