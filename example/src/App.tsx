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
        />
      </div>
    </div>
  )
}

export default App
