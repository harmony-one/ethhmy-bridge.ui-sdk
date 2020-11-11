import * as React from 'react'
import { Exchange } from './Exchange'
import stores, { StoresProvider } from './stores'
import { Provider as MobxProvider } from 'mobx-react'
import { Grommet } from 'grommet'
import { Theme, baseTheme } from './themes'
import { useEffect, useState } from 'react'

interface IExchangeProps {
  network: 'testnet' | 'mainnet'
  addressMetamask?: string
  addressOneWallet?: string
  addressMathWallet?: string
  theme?: typeof baseTheme
}

export const ExchangeBlock = (props: IExchangeProps) => {
  const [sdkInit, setSdkInit] = useState(false)

  useEffect(() => {
    Promise.all([
      stores.user.setNetwork(props.network),
      stores.userMetamask.setNetwork(props.network),
      stores.exchange.setNetwork(props.network)
    ]).then(() => setSdkInit(true))
  }, [props.network])

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
  }, [props.addressOneWallet, sdkInit])

  useEffect(() => {
    if (!sdkInit) return
    stores.user.setMathWalletAddress(props.addressMathWallet)
    try {
      stores.exchange.bridgeSdk.setUseMathWallet(!!props.addressMathWallet)
    } catch (e) {
      console.warn(e)
    }
  }, [props.addressMathWallet, sdkInit])

  return (
    <StoresProvider stores={stores as any}>
      <MobxProvider {...stores}>
        <Grommet
          theme={{ ...Theme, ...baseTheme, ...props.theme }}
          plain={true}
          full={true}
          id='grommetRoot'
        >
          <Exchange />
        </Grommet>
      </MobxProvider>
    </StoresProvider>
  )
}
