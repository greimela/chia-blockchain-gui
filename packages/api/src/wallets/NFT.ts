import type BigNumber from 'bignumber.js';

import type CalculateRoyaltiesRequest from '../@types/CalculateRoyaltiesRequest';
import type NFTInfo from '../@types/NFTInfo';
import type SpendBundle from '../@types/SpendBundle';
import Wallet from '../services/WalletService';

export default class NFTWallet extends Wallet {
  async getNftsCount(args: { walletId: number }) {
    return this.command('nft_count_nfts', args);
  }

  async getNfts(args: { walletId: number; num: number; startIndex: number }) {
    const { num = 100_000, ...rest } = args;

    return this.command('nft_get_nfts', {
      num,
      ...rest,
    });
  }

  async getNftInfo(args: { coinId: string }) {
    return this.command<{
      nftInfo: NFTInfo;
    }>('nft_get_info', args);
  }

  async getNftWalletsWithDids() {
    return this.command<{
      nftWallets: {
        walletId: number;
        didId: string;
        didWalletId: number;
      }[];
    }>('nft_get_wallets_with_dids');
  }

  async getNftWalletDid(args: { walletId: number }) {
    return this.command<{
      didId: string;
    }>('nft_get_wallet_did', args);
  }

  async transferNft(args: { walletId: number; nftCoinIds: string[]; targetAddress: string; fee: string }) {
    const { walletId, nftCoinIds, targetAddress, fee } = args;
    if (nftCoinIds.length === 1) {
      return this.command<{
        walletId: number;
        spendBundle: SpendBundle;
      }>('nft_transfer_nft', {
        walletId,
        nftCoinId: nftCoinIds[0],
        targetAddress,
        fee,
      });
    }
    return this.command<{
      walletId: number[];
      spendBundle: SpendBundle;
      txNum: number;
    }>('nft_transfer_bulk', {
      nftCoinList: nftCoinIds.map((nftId: string) => ({ nft_coin_id: nftId, wallet_id: walletId })),
      targetAddress,
      fee,
    });
  }

  async setNftDid(args: { walletId: number; nftCoinIds: string[]; did: string; fee: string }) {
    const { walletId, nftCoinIds, did, fee } = args;
    if (nftCoinIds.length === 1) {
      return this.command<{
        walletId: number;
        spendBundle: SpendBundle;
      }>('nft_set_nft_did', {
        walletId,
        nftCoinId: nftCoinIds[0],
        didId: did,
        fee,
      });
    }
    return this.command<{
      walletId: number[];
      spendBundle: SpendBundle;
      txNum: number;
    }>('nft_set_did_bulk', {
      nftCoinList: nftCoinIds.map((nftId: string) => ({ nft_coin_id: nftId, wallet_id: walletId })),
      didId: did,
      fee,
    });
  }

  async setNftStatus(args: { walletId: number; nftCoinId: string; inTransaction: boolean }) {
    const { walletId, nftCoinId, inTransaction } = args;
    return this.command<void>('nft_set_nft_status', {
      walletId,
      coinId: nftCoinId,
      inTransaction,
    });
  }

  async calculateRoyalties(args: CalculateRoyaltiesRequest) {
    return this.command<Record<string, Array<{ asset: string; address: string; amount: BigNumber | number }>>>(
      'nft_calculate_royalties',
      args
    );
  }
}
