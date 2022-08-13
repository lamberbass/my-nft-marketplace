import { providers, ethers } from 'ethers';

import marketContractAbi from '../artifacts/contracts/MyNftMarketplace.sol/MyNftMarketplace.json'
import { Item } from '../models/item';

const MarketContractAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

function getContract(): ethers.Contract {
  const ethereum: providers.ExternalProvider = (window as any).ethereum;
  const provider: providers.Web3Provider = new ethers.providers.Web3Provider(ethereum);
  const signer: providers.JsonRpcSigner = provider.getSigner();

  return new ethers.Contract(MarketContractAddress, marketContractAbi.abi, signer);
}

export async function getConnectedAccounts(): Promise<string[]> {
  const ethereum: providers.ExternalProvider | undefined = (window as any).ethereum;

  if (!ethereum || !ethereum.request) {
    console.error('Could not get connected accounts. Please install MetaMask.');
    return [];
  }

  const accounts: string[] = await ethereum.request({
    method: 'eth_requestAccounts',
  });

  return accounts;
};

export async function createToken(url: string, price: number): Promise<void> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const transaction = await contract.createToken(url, price);
  const result = await transaction.wait();
  console.log('createToken result', result);
};

export async function getAllItems(): Promise<Item[]> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const result: any[] = await contract.getAllItems();
  console.log('getAllItems result', result);

  const getTokenURIs: Promise<string>[] = result.map(i => contract.tokenURI(i.tokenId));
  const tokenURIs: string[] = await Promise.all(getTokenURIs);

  return result.map((item: any, index: number) => ({
    tokenId: item.tokenId.toNumber(),
    tokenURI: tokenURIs[index],
    ownerAddress: item.owner,
    sellerAddress: item.seller,
    price: item.price.toNumber()
  } as Item));
};