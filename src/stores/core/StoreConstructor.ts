import { IStores } from '..'
import { BridgeSDK } from 'bridge-sdk'
import { observable } from 'mobx'
const configs = require('bridge-sdk/lib/configs')

export class StoreConstructor {
  public stores: IStores
  @observable network: 'testnet' | 'mainnet' = 'testnet'

  bridgeSdk: BridgeSDK

  constructor(stores: IStores) {
    this.stores = stores

    this.bridgeSdk = new BridgeSDK({ logLevel: 2 })

    this.bridgeSdk.init(configs.testnet)
  }

  setNetwork = async (network: 'testnet' | 'mainnet') => {
    this.bridgeSdk = new BridgeSDK({ logLevel: 2 })

    this.network = network

    await this.bridgeSdk.init(configs[network] || configs.testnet)
  }
}
