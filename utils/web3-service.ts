import { providers, ethers, BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';

import marketContractAbi from '../artifacts/contracts/MyNftMarketplace.sol/MyNftMarketplace.json'
import { Item } from '../models/item';

const MarketContractAddress = '0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e';

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

export async function createToken(url: string, ethPrice: string): Promise<void> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const transaction = await contract.createToken(url, parseEther(ethPrice));
  const result = await transaction.wait();
  console.log('createToken result', result);
};

export async function getItemsForSale(): Promise<Item[]> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const result: any[] = await contract.getItemsForSale();
  console.log('getItemsForSale result', result);

  const items: Item[] = await mapResultToItems(result, contract);
  console.log('items for sale', items);

  return items;
};

export async function getOwnedItems(): Promise<Item[]> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const result: any[] = await contract.getOwnedItems();
  console.log('getOwnedItems result', result);

  const items: Item[] = await mapResultToItems(result, contract);
  console.log('owned items', items);

  return items;
};

export async function buyToken(tokenId: number, ethPrice: string): Promise<void> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const transaction = await contract.buyToken(tokenId, { value: parseEther(ethPrice) });
  const result = await transaction.wait();
  console.log('buyToken result', result);
};

export async function editItem(tokenId: number, ethPrice: string, isForSale: boolean): Promise<void> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const transaction = await contract.editItem(tokenId, parseEther(ethPrice), isForSale);
  const result = await transaction.wait();
  console.log('editItem result', result);
};

async function mapResultToItems(result: any[], contract: ethers.Contract): Promise<Item[]> {
  const getTokenURIs: Promise<string>[] = result.map(i => contract.tokenURI(i.tokenId));
  const tokenURIs: string[] = await Promise.all(getTokenURIs);

  const items: Item[] = result.map((item: any, index: number) => ({
    tokenId: item.tokenId.toNumber(),
    tokenURI: tokenURIs[index],
    ownerAddress: item.owner,
    ethPrice: formatEther(item.price),
    isForSale: item.isForSale
  } as Item));

  return items;
};