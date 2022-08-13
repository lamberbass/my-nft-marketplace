import type { NextPage } from 'next'
import { useState } from 'react'
import { downloadFile, uploadFile } from '../utils/ipfs-service';
import { createToken } from '../utils/web3-service';

const CreateNft: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState({} as File);
  const [imageSrc, setImageSrc] = useState('');
  const [nftPath, setNftPath] = useState('');
  const [nftPrice, setNftPrice] = useState(1);

  const onFileSelected = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const getFileDetails = () => {
    if (!selectedFile.name) {
      return (<h4>Choose or drop a file</h4>);
    }

    return (
      <div>
        <h4>File Details:</h4>
        <p>File Name: {selectedFile.name}</p>
        <p>File Type: {selectedFile.type}</p>
        <p>
          Last Modified: {new Date(selectedFile.lastModified).toLocaleString()}
        </p>
        <button type="button" onClick={uploadAndDisplayFile}>Upload and Display</button>
      </div>
    );
  }

  const uploadAndDisplayFile = async () => {
    const path: string = await uploadFile(selectedFile);
    setNftPath(path);
    const url: string = await downloadFile(path, selectedFile.type);
    setImageSrc(url);
  }

  const createNft = async () => {
    await createToken(nftPath, nftPrice);
  }

  return (
    <div>
      <input type="file" onChange={onFileSelected} />
      {getFileDetails()}

      {imageSrc
        ? <div>
            <img src={imageSrc} style={{ maxHeight: '400px' }} ></img>
            <br />
            Price: <input type='number' onChange={e => setNftPrice(+e.target.value)} value={nftPrice}/>
            <button type='button' onClick={createNft}>Create NFT</button>
          </div>
        : <div></div>}
    </div>
  )
}

export default CreateNft