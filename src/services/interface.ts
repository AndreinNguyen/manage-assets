import { BigNumber } from "@ethersproject/bignumber";

export interface BalancesResponse {
  address: string;
  balance: string;
  symbol: string;
  site_url: string;
  icon_url: string;
  price: number;
  chain: string;
  decimals: number;
  name: string;
  usd_24h_change: number;
  totalValue?: number;
}
export interface Asset {
  address: string;
  balance: string;
  symbol: string;
  site_url: string;
  icon_url: string;
  price: number;
  chain: string;
  decimals: number;
  name: string;
  usd_24h_change: number;
  totalValue?: number;
}

export interface RefactorAssets {
  lists: Asset[];
  totalValue: BigNumber;
  icon_url: string;
  symbol: string;
  address: string;
}

export interface TokenDetail {
  balance: string;
  symbol: string;
  site_url: string;
  icon_url: string;
  price: number;
  chain: string;
  decimals: number;
  name: string;
  usd_24h_change: number;
}
