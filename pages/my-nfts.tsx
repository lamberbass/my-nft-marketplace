import type { NextPage } from 'next'
import { useEffect, useState } from 'react'

import { getConnectedAccounts, getOwnedItems } from '../utils/web3-service';
import styles from '../styles/CreateNft.module.css'
import home from '../styles/Home.module.css'

import EditNft from '../components/edit-nft';
import { Item } from '../models/item';

const MyNfts: NextPage = () => {
  const [items, setItems] = useState([] as Item[]);

  const connectWallet = async () => {
    await getConnectedAccounts();
  };

  const getItems = async () => {
    const items: Item[] = await getOwnedItems();
    setItems(items);
  };

  useEffect(() => {
    connectWallet();
    getItems();
  }, []);

  return (
    <div>
      <h2>My NFTs</h2>
      {items.length > 0
        ? <div className={home.itemsList}>
          {items.map(i => <EditNft key={i.tokenId} item={i} />)}
        </div>
        : <div>No NFTs</div>}
    </div>
  )
}

export default MyNfts