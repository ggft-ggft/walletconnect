import styles from '@/styles/Home.module.css'
import { Button, Container, Spinner, VStack } from '@chakra-ui/react'
import WalletSDK from '@metamask/sdk'
import { CommunicationLayerPreference } from '@metamask/sdk-communication-layer'
import { Inter } from '@next/font/google'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { mainnet, optimism } from 'wagmi/chains'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'

const inter = Inter({ subsets: ['latin'] })

const metamaskConn = new InjectedConnector();
const coinbaseConn = new CoinbaseWalletConnector({
  chains: [mainnet, optimism],
  options: {
    appName: 'wagmish'
  },
})


export default function Home() {
  const { address, isConnected,isConnecting, isDisconnected, isReconnecting, status, connector } = useAccount()
  const [iswalletConnecting, setIswalletConnecting] = useState(false);

  useEffect(() => {
    setIswalletConnecting(isConnecting)
  }, [isConnecting]);

  const { connect, isLoading } = useConnect({
    connector: coinbaseConn,
    onError(error) {
      console.log('Error connect CO', error)
    }
  })
  const { connect: connectMM,  } = useConnect({
    connector: metamaskConn,
    onError(error) {
      console.log('Error connect MM', error)
    }
  })
  
  const { disconnect } = useDisconnect({
    onError(error) {
      console.log('Error disconnect', error)
    },
  })
  useEffect(() => {
    new WalletSDK({
      useDeeplink: false,
      communicationLayerPreference: CommunicationLayerPreference.SOCKET,
    })
    isMetaMaskConnected()    
    .then((res) => {
        if (res === true) {
          connectMM()
        }
      })
      .catch((er) => console.error('Error connecting to MetaMask', er))
      .finally(() => {setIswalletConnecting(false)})
      
    console.log("----init sdk");
  }, []);
  
  async function isMetaMaskConnected() {
    const { ethereum } = window
    const accounts = await ethereum?.request({ method: 'eth_accounts' })
    return accounts && accounts.length > 0
  }

  return (
    <>
      <Head>
        <title>Wallet connection Next App</title>
        <meta name="description" content="Wallet connection Next App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Container>
          <VStack >
            <div>{iswalletConnecting ? <Spinner />:null}</div>
            {isConnected ? <div>
              Connected to {address}
              <Button size='lg' onClick={() => disconnect()}>Disconnect</Button>
            </div> : <VStack><Button size='lg' onClick={() => { console.log("connCO"); connect() }}>Connect Wallet CO</Button>
            <Button size='lg' onClick={() => { console.log("connMMMM"); connectMM() }}>Connect MMM</Button>
            </VStack>}
            <Button onClick={() => alert("10000000")}>Alerto</Button>
          </VStack>
        </Container>
      </main>
    </>
  )
}
