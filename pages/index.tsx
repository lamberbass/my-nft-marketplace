import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useState } from 'react';
import { providers } from 'ethers';

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('');

  const connectWallet = async () => {
    const ethereum: providers.ExternalProvider | undefined = (window as any).ethereum;

    if (!ethereum || !ethereum.request) {
      return alert('Please install MetaMask.');
    }

    const accounts: string[] = await ethereum.request({
      method: 'eth_requestAccounts',
    });

    setCurrentAccount(accounts[0]);
  };

  return (
    <div>
      <Head>
        <title>My NFT Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        Welcome to My NFT Marketplace!
      </h1>

      {currentAccount ? <div>Current account: {currentAccount}</div>
        : <button type='button' onClick={connectWallet}>Connect Wallet</button>}

      <br></br>

      <button>
        <Link href={'/create-nft'}>Create NFT</Link>
      </button>
    </div>
  )
}

export default Home
