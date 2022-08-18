import { useEffect, useState } from 'react';
import React from 'react';

import { downloadFile } from '../utils/ipfs-service';
import { Item } from '../models/item';
import { editItem } from '../utils/web3-service';
import edit from '../styles/EditNft.module.css';
import view from '../styles/ViewNft.module.css';
import button from '../styles/Button.module.css';
import toggle from '../styles/Toggle.module.css';

export interface EditNftProps {
  item: Item;
}

const EditNft = (props: EditNftProps) => {
  const [imageSrc, setImageSrc] = useState('');
  const [nftPrice, setNftPrice] = useState(props.item.ethPrice);
  const [forSale, setForSale] = useState(props.item.isForSale);

  const itemEdited = () => forSale !== props.item.isForSale || +nftPrice !== +props.item.ethPrice;

  const getImageUrl = async () => {
    const url: string = await downloadFile(props.item.tokenURI, 'image/jpeg');
    setImageSrc(url);
  }

  useEffect(() => {
    getImageUrl();
  }, []);

  const saveNft = async () => {
    await editItem(props.item.tokenId, nftPrice, forSale);
  }

  return (
    <div className={view.cardProduct}>
      <div className={view.cardMedia}>
        {imageSrc ? <img src={imageSrc} alt={props.item.tokenURI} className={view.image}></img> : ''}
      </div>

      <div className={view.metaInfo}>
        <div className={edit.priceContainer}>
          <div className={view.label}>Price in ETH</div>
          <input className={edit.priceInput} type='number' onChange={e => setNftPrice(e.target.value)} value={nftPrice} />
        </div>

        <div className={edit.priceContainer}>
          <div className={view.label}>Is for sale</div>
          <label className={toggle.switch}>
            <input type="checkbox" onChange={e => setForSale(e.target.checked)} checked={forSale} />
            <span className={toggle.slider}></span>
          </label>
        </div>

        <div className={edit.cardBottom}>
          <button type="button" className={button.customButton} onClick={saveNft} disabled={!itemEdited()}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditNft