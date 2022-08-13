import { useEffect, useState } from 'react'
import React from 'react';

import { downloadFile } from '../utils/ipfs-service';
import { Item } from '../models/item';

export interface ViewNftProps {
  item: Item;
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

  return (
    <div>
      {imageSrc
        ? <div>
            <img src={imageSrc} style={{ maxHeight: '400px' }} ></img>
            <br />
            Price: {props.item.price}
          </div>
        : <div>Downloading...</div>}
    </div>
  )
}

export default ViewNft