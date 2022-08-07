import { create, IPFSHTTPClient, Options } from 'ipfs-http-client';

const ipfsOptions: Options = {
    host: 'localhost',
    port: 5001,
    protocol: 'http'
  };

export async function uploadFile(file: File): Promise<string> {
    const ipfs: IPFSHTTPClient = create(ipfsOptions);

    const fileBuffer: ArrayBuffer = await file.arrayBuffer();
    const fileBlob = new Blob([fileBuffer], { type: file.type });

    const result = await ipfs.add(fileBlob);
    console.log('Upload result:', result);

    return result.path;
  }

  export async function downloadFile(path: string, type: string): Promise<string> {
    const ipfs: IPFSHTTPClient = create(ipfsOptions);

    const iterable: AsyncIterable<Uint8Array> = ipfs.get(path);
    const fileContent: Uint8Array[] = [];

    for await (const chunk of iterable) {
      fileContent.push(chunk);
    }

    const tarBlob: Blob = new Blob(fileContent, { type: 'application/x-tar' });
    const tarBuffer: ArrayBuffer = await tarBlob.arrayBuffer();
    const untar = await require("js-untar");
    const untarResults = await untar(tarBuffer);

    const fileBlob: Blob = new Blob([untarResults[0].buffer], { type });
    const fileUrl = window.URL.createObjectURL(fileBlob);
    console.log('Downloaded file url:', fileUrl);

    return fileUrl;
  }