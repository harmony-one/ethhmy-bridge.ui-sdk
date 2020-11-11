# bridge-ui-sdk

> Horizon Bridge UI SDK

[![NPM](https://img.shields.io/npm/v/bridge-ui-sdk.svg)](https://www.npmjs.com/package/bridge-ui-sdk) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install
For npm users:

```shell
  $ npm install bridge-ui-sdk styled-components --save
```

For Yarn users:

```shell
  $ yarn add bridge-ui-sdk styled-components
```

## Usage
```tsx
import React from 'react'
import { ExchangeBlock } from 'bridge-ui-sdk'
import 'bridge-ui-sdk/dist/index.css'

({ addressMetamask, addressOneWallet }) => <ExchangeBlock network='testnet' addressMetamask={addressMetamask} addressOneWallet={addressOneWallet} />
```

#### You need to do sign nn with your wallets in other blocks. ExchangeBlock will use your wallets through window object.
#### After wallet sign in (Metamask or OneWallet), your need to set next props to ExchangeBlock

### Params
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| network | `'mainnet' | 'testnet'` | `'testnet'` | Network type - instead of this type Exchange block will use different configs (smart contract address, validator address etc)
| addressMetamask | String |  | Your Ethereum address with wich you signed in
| addressOneWallet | String |  | Your Harmony address with wich you signed in

## Full Example (with wallets sign in)

https://github.com/harmony-one/ethhmy-bridge.ui-sdk/blob/main/example/src/App.tsx

```tsx
import React, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import { ExchangeBlock } from 'bridge-ui-sdk'
import 'bridge-ui-sdk/dist/index.css'

const App = () => {
  const [metamask, setMetamask] = useState<string>()
  const [oneWallet, setOneWallet] = useState<string>()

  useEffect(() => {
    detectEthereumProvider().then((provider: any) => {
      try {
        // @ts-ignore
        if (provider !== window.ethereum) {
          console.error('Do you have multiple wallets installed?')
        }

        if (!provider) {
          alert('Metamask not found')
        }

        provider.on('accountsChanged', (accounts: string[]) =>
          setMetamask(accounts[0])
        )

        provider.on('disconnect', () => {
          setMetamask('')
        })

        provider
          .request({ method: 'eth_requestAccounts' })
          .then(async (accounts: string[]) => {
            setMetamask(accounts[0])
          })
      } catch (e) {
        console.error(e)
      }
    })
  }, [])

  useEffect(() => {
    try {
      // @ts-ignore
      setTimeout(() => {
        // @ts-ignore
        window.onewallet
          .getAccount()
          .then(({ address }: any) => setOneWallet(address))
      }, 3000)
    } catch (e) {
      console.error(e)
    }
  }, [])

  return (
    <ExchangeBlock
      network='testnet'
      addressMetamask={metamask}
      addressOneWallet={oneWallet}
    />
  )
}

export default App
```

## License

MIT © [harmony](https://github.com/harmony)
