import { IStores } from '..'
import { BridgeSDK } from 'bridge-sdk'
const configs = require('bridge-sdk/lib/configs')

export class StoreConstructor {
  public stores: IStores

  bridgeSdk: BridgeSDK

  constructor(stores: IStores) {
    this.stores = stores

    this.bridgeSdk = new BridgeSDK({ logLevel: 2 })

    this.bridgeSdk.init(configs.testnet)
  }

  setNetwork = async (network: string) => {
    this.bridgeSdk = new BridgeSDK({ logLevel: 2 })

    await this.bridgeSdk.init(configs[network] || configs.testnet)
  }
}
