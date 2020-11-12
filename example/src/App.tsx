import React, { useEffect, useState } from 'react'
import detectEthereumProvider from '@metamask/detect-provider'

import {
  ExchangeBlock,
  BridgeSDK,
  testnet as testnetConfig
} from 'bridge-ui-sdk'

import 'bridge-ui-sdk/dist/index.css'
import { ITokenInfo } from 'bridge-sdk'

const myTokens = [
  {
    chainId: 1,
    address: '0x3095c7557bCb296ccc6e363DE01b760bA031F2d9',
    symbol: '1WBTC',
    name: 'Wrapped BTC',
    decimals: 8,
    logoURI:
      'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png'
  },
  {
    chainId: 1,
    address: '0xF720b7910C6b2FF5bd167171aDa211E226740bfe',
    symbol: '1WETH',
    name: 'Wrapped Ether',
    decimals: 18,
    logoURI:
      'https://swoop-exchange.s3-us-west-1.amazonaws.com/tokens/1WETH.png'
  },
  {
    chainId: 1,
    address: '0xcF664087a5bB0237a0BAd6742852ec6c8d69A27a',
    symbol: 'WONE',
    name: 'Wrapped ONE',
    decimals: 18,
    logoURI: 'https://swoop-exchange.s3-us-west-1.amazonaws.com/tokens/WONE.png'
  }
]

const App = () => {
  const [metamask, setMetamask] = useState<string>()
  const [oneWallet, setOneWallet] = useState<string>()
  const [validatorTokens, setValidatorTokens] = useState<ITokenInfo[]>([])

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

  useEffect(() => {
    try {
      const bridgeSdk = new BridgeSDK({ logLevel: 0 })

      bridgeSdk.init(testnetConfig).then(() => {
        bridgeSdk.api
          .getTokensInfo({ page: 0, size: 1000 })
          .then((res) => setValidatorTokens(res.content))
      })
    } catch (e) {
      console.error(e)
    }
  }, [])

  const getErc20Address = (hrc20Address: string): string =>
    (validatorTokens.find((vt) => vt.hrc20Address === hrc20Address) || {})
      .erc20Address || ''

  const customTokens = myTokens.map((t) => ({
    image: t.logoURI,
    name: t.name,
    erc20Address: getErc20Address(t.address)
  }))

  return (
    <div
      style={{
        background: '#dedede',
        width: '100vw',
        height: '100vh',
        padding: '100px 0'
      }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: '0 auto'
        }}
      >
        <ExchangeBlock
          network='testnet'
          addressMetamask={metamask}
          addressOneWallet={oneWallet}
          tokens={customTokens}
        />
      </div>
    </div>
  )
}

export default App
