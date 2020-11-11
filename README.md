# bridge-ui-sdk

> Horizon Bridge UI SDK

[![NPM](https://img.shields.io/npm/v/bridge-ui-sdk.svg)](https://www.npmjs.com/package/bridge-ui-sdk) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save bridge-ui-sdk
```

## Usage

```tsx
import React, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import { ExchangeBlock } from 'bridge-ui-sdk'
import 'bridge-ui-sdk/dist/index.css'

const App = () => {
  const [metamask, setMetamask] = useState<string>()

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

  console.log(metamask)

  return <ExchangeBlock network='testnet' addressMetamask={metamask} />
}

export default App
```

## License

MIT © [harmony](https://github.com/harmony)
