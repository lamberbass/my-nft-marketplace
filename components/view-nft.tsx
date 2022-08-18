import { useEffect, useState } from 'react';
import React from 'react';

import { downloadFile } from '../utils/ipfs-service';
import { Item } from '../models/item';
import { buyToken } from '../utils/web3-service';
import styles from '../styles/ViewNft.module.css'
import button from '../styles/Button.module.css'

export interface ViewNftProps {
  item: Item;
  canBuy: boolean;
}

const ViewNft = (props: ViewNftProps) => {
  const [imageSrc, setImageSrc] = useState('');

  const getImageUrl = async () => {
    const url: string = await downloadFile(props.item.tokenURI, 'image/jpeg');
    setImageSrc(url);
  }

  useEffect(() => { 
    getImageUrl(); 
  }, []);

  const buyNft = async () => {
    await buyToken(props.item.tokenId, props.item.ethPrice);
  }

  return (
    <div className={styles.cardProduct}>
      <div className={styles.cardMedia}>
        { imageSrc ? <img src={imageSrc} alt={props.item.tokenURI} className={styles.image}></img> : ''}
      </div>

      <div className={styles.metaInfo}>
        <div>
          <div className={styles.label}>Owner Address</div>
          <div className={styles.owner}>{props.item.ownerAddress}</div>
        </div>
        <div className={styles.priceAndBuy}>
          <div>
            <div className={styles.label}>Price</div>
            <div className={styles.price}>{props.item.ethPrice} ETH</div>
          </div>
          { props.canBuy ? <button type="button" className={button.customButton} onClick={buyNft}>Buy</button> : '' }
        </div>
      </div>
    </div>
  )
}

export default ViewNft