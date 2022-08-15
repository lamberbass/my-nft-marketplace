import type { NextPage } from 'next'
import { NextRouter, useRouter } from 'next/router';
import { useState } from 'react'
import { uploadFile } from '../utils/ipfs-service';
import { createToken } from '../utils/web3-service';

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
    <div>
      <h2>Create your NFT</h2>

      <input type="file" onChange={onFileSelected} />

      {imageSrc
        ? <div>
            <img src={imageSrc} style={{ maxHeight: '400px' }} ></img>
            <br />
            ETH Price: <input type='number' onChange={e => setNftPrice(e.target.value)} value={nftPrice}/>
            <button type='button' onClick={createNft}>Create NFT</button>
          </div>
        : <div></div>}
    </div>
  )
}

export default CreateNft