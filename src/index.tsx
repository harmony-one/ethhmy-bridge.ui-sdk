import * as React from 'react'
import { Exchange } from './Exchange'
import stores, { StoresProvider } from './stores'
import { Provider as MobxProvider } from 'mobx-react'
import { Grommet } from 'grommet'
import { Theme, baseTheme } from './themes'
import { useEffect, useState } from 'react'
import { IToken } from './stores/Exchange'

interface IExchangeProps {
  network: 'testnet' | 'mainnet'
  addressMetamask?: string
  addressOneWallet?: string
  addressMathWallet?: string
  theme?: typeof baseTheme
  tokens?: IToken[]
}

export const ExchangeBlock = (props: IExchangeProps) => {
  const [sdkInit, setSdkInit] = useState(false)

  useEffect(() => {
    Promise.all([
      stores.user.setNetwork(props.network),
      stores.userMetamask.setNetwork(props.network),
      stores.exchange.setNetwork(props.network)
    ]).then(() => {
      setSdkInit(true)
    })
  }, [props.network])

  useEffect(() => {
    if (sdkInit) {
      stores.exchange.setTokens(props.tokens)
    }
  }, [props.tokens, sdkInit])

  useEffect(() => {
    if (!sdkInit) return
    stores.userMetamask.setMetamaskAddress(props.addressMetamask)
    try {
      stores.exchange.bridgeSdk.setUseMetamask(!!props.addressMetamask)
    } catch (e) {
      console.warn(e)
    }
  }, [props.addressMetamask, sdkInit])

  useEffect(() => {
    if (!sdkInit) return

    stores.user.setOneWalletAddress(props.addressOneWallet)

    try {
      stores.exchange.bridgeSdk.setUseOneWallet(!!props.addressOneWallet)
    } catch (e) {
      console.warn(e)
    }

    if (!props.addressOneWallet) {
      stores.user.setMathWalletAddress(props.addressMathWallet)

      try {
        stores.exchange.bridgeSdk.setUseMathWallet(!!props.addressMathWallet)
      } catch (e) {
        console.warn(e)
      }
    } else {
      try {
        stores.exchange.bridgeSdk.setUseMathWallet(false)
      } catch (e) {
        console.warn(e)
      }
    }
  }, [props.addressOneWallet, props.addressMathWallet, sdkInit])

  return (
    <StoresProvider stores={stores as any}>
      <MobxProvider {...stores}>
        <Grommet
          theme={{ ...Theme, ...baseTheme, ...props.theme }}
          plain={true}
          id='grommetRoot'
        >
          <Exchange />
        </Grommet>
      </MobxProvider>
    </StoresProvider>
  )
}

export * from 'bridge-sdk'
