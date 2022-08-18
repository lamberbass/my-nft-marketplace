import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link';
import { useEffect, useState } from 'react';

import ViewNft from '../components/view-nft';
import { Item } from '../models/item';

import { getConnectedAccounts, getAllItems } from '../utils/web3-service';
import styles from '../styles/Home.module.css';
import button from '../styles/Button.module.css'

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

      <h1 className={styles.title}>Welcome to My NFT Marketplace!</h1>

      {!currentAccount
        ? <button type='button' className={button.customButton} onClick={connectWallet}>Connect Wallet</button>
        : <div>
          <div className={styles.account}>Selected Account<span>{currentAccount}</span></div>

          <hr></hr>

          <div className={styles.viewOrCreateNft}>
            <h2>NFTs for sale</h2>
            <button className={button.customButton}>
              <Link href={'/create-nft'}><div>Create NFT</div></Link>
            </button>
          </div>

          {items.length > 0
            ? <div className={styles.itemsList}>
              {items.map(i => <ViewNft key={i.tokenId} item={i} canBuy={i.sellerAddress.toLowerCase() !== currentAccount.toLowerCase()} />)}
            </div>
            : <div>No NFTs</div>}
        </div>
      }
    </div>
  )
}

export default Home
