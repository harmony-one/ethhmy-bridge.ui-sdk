import { StoreConstructor } from './core/StoreConstructor'
import { action, computed, observable } from 'mobx'
import { EXCHANGE_MODE, IOperation, STATUS, TOKEN } from './interfaces'

import { tokensMainnet } from './tokensMainnet'
import { tokensTestnet } from './tokensTestnet'

import { ITokenInfo } from 'bridge-sdk'

export type IToken = {
  image: string
  erc20Address: string
  name: string
}

export type statusFetching =
  | 'init'
  | 'fetching'
  | 'success'
  | 'error'
  | 'first_fetching'

// import { getNetworkFee } from '../blockchain-bridge/eth/helpers'

export enum EXCHANGE_STEPS {
  GET_TOKEN_ADDRESS = 'GET_TOKEN_ADDRESS',
  BASE = 'BASE',
  CONFIRMATION = 'CONFIRMATION',
  SENDING = 'SENDING',
  RESULT = 'RESULT'
}

export interface IStepConfig {
  id: EXCHANGE_STEPS
  buttons: Array<{
    title: string
    onClick: () => void
    validate?: boolean
    transparent?: boolean
  }>
  title?: string
}

export class Exchange extends StoreConstructor {
  @observable error = ''
  @observable txHash = ''
  @observable actionStatus: statusFetching = 'init'
  @observable stepNumber = 0
  @observable isFeeLoading = false

  defaultTransaction = {
    oneAddress: '',
    ethAddress: '',
    amount: '0',
    erc20Address: ''
  }

  @observable transaction = this.defaultTransaction
  @observable mode: EXCHANGE_MODE = EXCHANGE_MODE.ETH_TO_ONE
  @observable token: TOKEN = TOKEN.BUSD

  constructor(stores) {
    super(stores)

    setInterval(async () => {
      if (this.operation) {
        const operation = await this.bridgeSdk.api.getOperation(
          this.operation.id
        )

        if (this.operation && this.operation.id === operation.id) {
          this.operation = operation
          this.setStatus()
        }
      }
    }, 3000)
  }

  @observable tokens: IToken[] = []

  @action.bound setTokens = (tokens?: IToken[]) => {
    if (tokens) {
      this.tokens = tokens

      return
    }

    this.tokens = this.network === 'mainnet' ? tokensMainnet : tokensTestnet
  }

  @computed
  get step() {
    return this.stepsConfig[this.stepNumber]
  }

  @observable ethNetworkFee = 0

  @computed
  get networkFee() {
    return this.mode === EXCHANGE_MODE.ETH_TO_ONE
      ? this.ethNetworkFee
      : 0.0134438
  }

  stepsConfig: Array<IStepConfig> = [
    {
      id: EXCHANGE_STEPS.BASE,
      buttons: [
        {
          title: 'Continue',
          onClick: async () => {
            this.stepNumber = this.stepNumber + 1
            // this.transaction.oneAddress = this.stores.user.address;
            this.transaction.erc20Address = this.stores.userMetamask.erc20Address

            switch (this.mode) {
              case EXCHANGE_MODE.ETH_TO_ONE:
                this.transaction.ethAddress = this.stores.userMetamask.ethAddress

                this.isFeeLoading = true
                this.ethNetworkFee = 0 // await getNetworkFee()
                this.isFeeLoading = false
                break
              case EXCHANGE_MODE.ONE_TO_ETH:
                this.transaction.oneAddress = this.stores.user.address
                break
            }
          },
          validate: true
        }
      ]
    },
    {
      id: EXCHANGE_STEPS.CONFIRMATION,
      buttons: [
        {
          title: 'Back',
          onClick: () => (this.stepNumber = this.stepNumber - 1),
          transparent: true
        },
        {
          title: 'Confirm',
          onClick: () => {
            this.stepNumber = this.stepNumber + 1
            this.sendOperation()
          }
        }
      ]
    },
    {
      id: EXCHANGE_STEPS.SENDING,
      buttons: []
    },
    {
      id: EXCHANGE_STEPS.RESULT,
      buttons: [
        {
          title: 'Close',
          transparent: true,
          onClick: () => {
            this.clear()
            this.stepNumber = 0
          }
        }
      ]
    }
  ]

  @action.bound
  setAddressByMode() {
    if (this.mode === EXCHANGE_MODE.ETH_TO_ONE) {
      // this.transaction.oneAddress = this.stores.user.address;
      this.transaction.oneAddress = ''
      this.transaction.ethAddress = this.stores.userMetamask.ethAddress
    }

    if (this.mode === EXCHANGE_MODE.ONE_TO_ETH) {
      // this.transaction.ethAddress = this.stores.userMetamask.ethAddress;
      this.transaction.ethAddress = ''
      this.transaction.oneAddress = this.stores.user.address
    }
  }

  @action.bound
  setMode(mode: EXCHANGE_MODE) {
    if (
      this.operation &&
      [STATUS.IN_PROGRESS, STATUS.WAITING].includes(this.operation.status)
    ) {
      return
    }

    this.clear()
    this.mode = mode
    this.setAddressByMode()
  }

  @action.bound
  setToken(token: TOKEN) {
    // this.clear();
    this.token = token
    // this.setAddressByMode();
  }

  @observable operation: IOperation

  @action.bound
  setStatus() {
    switch (this.operation.status) {
      case STATUS.ERROR:
        this.actionStatus = 'error'
        this.stepNumber = this.stepsConfig.length - 1
        break

      case STATUS.SUCCESS:
        this.actionStatus = 'success'
        this.stepNumber = this.stepsConfig.length - 1
        break

      case STATUS.WAITING:
      case STATUS.IN_PROGRESS:
        this.stepNumber = 2
        this.actionStatus = 'fetching'
        break
    }
  }

  @action.bound
  async setOperationId(operationId: string) {
    this.operation = await this.bridgeSdk.api.getOperation(operationId)

    this.mode = this.operation.type
    this.token = this.operation.token
    this.transaction.amount = String(this.operation.amount)
    this.transaction.ethAddress = this.operation.ethAddress
    this.transaction.oneAddress = this.operation.oneAddress
    this.transaction.erc20Address = this.operation.erc20Address

    this.setStatus()
  }

  @action.bound
  async sendOperation(id: string = '') {
    try {
      this.actionStatus = 'fetching'

      let operationId = id

      if (!operationId) {
        await this.bridgeSdk.sendToken(
          {
            ...this.transaction,
            amount: Number(this.transaction.amount),
            type: this.mode,
            token: this.token
          },
          (id) => this.setOperationId(id)
        )

        this.actionStatus = 'success'

        return
      }
    } catch (e) {
      if (e.status && e.response.body) {
        this.error = e.response.body.message
      } else {
        this.error = e.message
      }
      this.actionStatus = 'error'
      this.operation = null
    }

    this.stepNumber = this.stepsConfig.length - 1
  }

  clear() {
    this.transaction = this.defaultTransaction
    this.operation = null
    this.error = ''
    this.txHash = ''
    this.actionStatus = 'init'
    this.stepNumber = 0
  }
}
