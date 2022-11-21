import { Asset, RefactorAssets } from "./interface";
import _ from "lodash";
import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import fromExponential from "from-exponential";
import { wmul } from "../utils/ds-math";

export class ManageAssets {
  public assets: Asset[];
  private assetGroupByTokenAddress: { [key: string]: Asset[] };
  private refactorAssets: {
    [key: string]: RefactorAssets;
  };
  public outputAsset: RefactorAssets[] = [];

  constructor(_assets: Asset[]) {
    this.assets = _assets;
    this.assetGroupByTokenAddress = this.getAssetsGroupByTokenAddress();
    this.refactorAssets = this.handleRefactorAssets();
    this.outputAsset = this.getOutputAssets();
  }

  private getAssetsGroupByTokenAddress() {
    return _.groupBy(this.assets, "address");
  }

  private getValue(balance: BigNumber, price: number) {
    const priceEther = parseUnits(fromExponential(price.toString()));
    // console.log(balance.mul(priceEther));
    // return formatUnits(balance.mul(priceEther));
    return wmul(balance, priceEther);
  }

  private handleRefactorAssets() {
    const _refactorAssets: {
      [key: string]: RefactorAssets;
    } = {};

    Object.keys(this.assetGroupByTokenAddress).forEach((key) => {
      const token = this.assetGroupByTokenAddress[key][0];

      const lists = this.assetGroupByTokenAddress[key];

      const totalBalance = lists.reduce(
        (pre, cur) => pre.add(parseUnits(fromExponential(cur.balance))),
        BigNumber.from(0)
      );

      const totalValue = this.getValue(totalBalance, token.price);

      _refactorAssets[key] = {
        lists,
        totalValue,
        icon_url: token.icon_url,
        symbol: token.symbol,
        address: key,
      };
    });

    return _refactorAssets;
  }

  public getOutputAssets() {
    return Object.keys(this.refactorAssets).map(
      (key) => this.refactorAssets[key]
    );
  }

  public getTotalValue() {
    return this.outputAsset.reduce(
      (pre, cur) => pre.add(cur.totalValue),
      BigNumber.from(0)
    );
  }
}
