import { useEffect, useState } from 'react'
import React from 'react';

import { downloadFile } from '../utils/ipfs-service';
import { Item } from '../models/item';
import { buyToken } from '../utils/web3-service';

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
    <div>
      {imageSrc
        ? <div>
            <img src={imageSrc} style={{ maxHeight: '200px' }} ></img>
            <br />
            Price: {props.item.ethPrice} ETH
            { props.canBuy ? <button type='button' onClick={buyNft}>Buy</button> : '' }
            <br />
            Seller: {props.item.sellerAddress}
          </div>
        : <div>Downloading...</div>}
    </div>
  )
}

export default ViewNft