import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';

import ViewNft from '../components/view-nft';
import { Item } from '../models/item';

import { getConnectedAccounts, getAllItems } from '../utils/web3-service';

const Home: NextPage = () => {
  const [currentAccount, setCurrentAccount] = useState('');
  const [items, setItems] = useState([] as Item[]);

  const connectWallet = async () => {
    const accounts: string[] = await getConnectedAccounts();
    setCurrentAccount(accounts[0]);
  };

  const getItems = async () => {
    const items: Item[] = await getAllItems();
    setItems(items);
  };

  useEffect(() => {
    connectWallet();
    getItems(); 
  }, []);

  return (
    <div>
      <Head>
        <title>My NFT Marketplace</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Welcome to My NFT Marketplace!</h1>

      {currentAccount ? <div>Current account: {currentAccount}</div>
        : <button type='button' onClick={connectWallet}>Connect Wallet</button>}

      <br></br>

      <button>
        <Link href={'/create-nft'}>Create NFT</Link>
      </button>

      <hr></hr>

      <h2>NFTs for sale</h2>

      {items.length > 0 
        ? items.map(i => <ViewNft key={i.tokenId} item={i} canBuy={i.sellerAddress.toLowerCase() !== currentAccount.toLowerCase()}/>)
        : <div>No NFTs</div>}
    </div>
  )
}

export default Home
