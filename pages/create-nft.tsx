import type { NextPage } from 'next'
import { useState } from 'react'
import { downloadFile, uploadFile } from '../utils/ipfs-service';

const CreateNft: NextPage = () => {
  const [selectedFile, setSelectedFile] = useState({} as File);
  const [imageSrc, setImageSrc] = useState('');

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
    const url: string = await downloadFile(path, selectedFile.type);
    setImageSrc(url);
  }

  return (
    <div>
      <input type="file" onChange={onFileSelected} />
      {getFileDetails()}

      {imageSrc
        ? <img src={imageSrc} style={{ height: '400px' }} ></img>
        : <div></div>}
    </div>
  )
}

export default CreateNft