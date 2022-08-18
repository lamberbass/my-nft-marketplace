import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react'
import { uploadFile } from '../utils/ipfs-service';
import { createToken } from '../utils/web3-service';
import styles from '../styles/CreateNft.module.css'
import button from '../styles/Button.module.css'

const CreateNft: NextPage = () => {
  const router: NextRouter = useRouter();
  const [selectedFile, setSelectedFile] = useState({} as File);
  const [imageSrc, setImageSrc] = useState('');
  const [nftPrice, setNftPrice] = useState("1");

  const onFileSelected = (event: any) => {
    setSelectedFile(event.target.files[0]);
    const fileUrl: string = window.URL.createObjectURL(event.target.files[0]);
    setImageSrc(fileUrl)
  };

  const createNft = async () => {
    const path: string = await uploadFile(selectedFile);
    await createToken(path, nftPrice);
    router.back();
  }

  return (
    <div className={styles.createCard}>
      <h2>Create your NFT</h2>

      <label className={styles.uploadFile}>
        <span>Click here to select an image to upload.</span>
        <input type="file" onChange={onFileSelected} />
      </label>

      <div className={styles.imageContainer}>
        {imageSrc
          ? <img className={styles.image} src={imageSrc} alt={selectedFile.name}></img>
          : <div className={styles.noImage}>No image selected.</div>}
      </div>

      <h4>Price in ETH</h4>
      <input className={styles.priceInput} type='number' onChange={e => setNftPrice(e.target.value)} value={nftPrice} />

      <button type='button' className={button.customButton} onClick={createNft} disabled={imageSrc == '' || +nftPrice == 0}>Create NFT</button>
    </div>
  )
}

export default CreateNft