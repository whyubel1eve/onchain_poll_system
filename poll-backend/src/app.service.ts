import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { privateKeyToAccount } from 'viem/accounts';
import { hashMessage, hexToSignature, Signature } from 'viem';
import { Token } from './model/token';

@Injectable()
export class AppService {
  //test
  async generateToken() {
    const account = privateKeyToAccount('0x666');

    const uuid = uuidv4();
    const hash = hashMessage(uuid);

    const signature = await account.signMessage({
      message: uuid,
    });

    const { r, s, yParity }: Signature = hexToSignature(signature);
    const v = (yParity as number) + 27;

    const token: Partial<Token> = {
      hash,
      r,
      s,
      v,
      isIssued: false,
    };
    return JSON.stringify(token);
  }
}
