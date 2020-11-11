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
  <ExchangeBlock network='testnet' addressMetamask={metamask} addressOneWallet={oneWallet} />
```

#### You need to do signIn to your wallets in other blocks. ExchangeBlock will use your wallets through window object.
#### After you will do Sign In to Wallet (Metamask or OneWallet) your need to set next props to ExchangeBlock

### Params
##### network: `'testnet' or 'mainnet'`
##### addressMetamask: `your Metamask account address in hex` 
##### addressOneWallet: `your OneWallet account address`

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
