import { Asset, RefactorAssets } from "./interface";
import _ from "lodash";
import { parseUnits } from "@ethersproject/units";
import { BigNumber } from "@ethersproject/bignumber";
import fromExponential from "from-exponential";
import { wmul } from "../utils/ds-math";

export class ManageAssets {
  public assets: Asset[];

  constructor(_assets: Asset[]) {
    this.assets = _assets;
  }

  private getAssetsGroupByTokenAddress() {
    return _.groupBy(this.assets, "address");
  }

  private getValue(balance: BigNumber, price: number) {
    const priceEther = parseUnits(fromExponential(price.toString()));
    return wmul(balance, priceEther);
  }

  private handleRefactorAssets() {
    const _refactorAssets: {
      [key: string]: RefactorAssets;
    } = {};

    const assetGroupByTokenAddress = this.getAssetsGroupByTokenAddress();

    Object.keys(this.getAssetsGroupByTokenAddress()).forEach((key) => {
      const token = assetGroupByTokenAddress[key][0];

      const lists = assetGroupByTokenAddress[key];

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
    const refactorAssets = this.handleRefactorAssets();

    return Object.keys(refactorAssets).map((key) => refactorAssets[key]);
  }

  public getTotalValue() {
    return this.getOutputAssets().reduce(
      (pre, cur) => pre.add(cur.totalValue),
      BigNumber.from(0)
    );
  }
}
