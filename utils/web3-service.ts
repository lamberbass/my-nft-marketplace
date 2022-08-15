import { providers, ethers, BigNumber } from 'ethers';
import { formatEther, parseEther } from 'ethers/lib/utils';

import marketContractAbi from '../artifacts/contracts/MyNftMarketplace.sol/MyNftMarketplace.json'
import { Item } from '../models/item';

const MarketContractAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F';

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
    ethPrice: formatEther(item.price)
  } as Item));
};

export async function buyToken(tokenId: number, ethPrice: string): Promise<void> {
  await getConnectedAccounts();

  const contract: ethers.Contract = getContract();
  const transaction = await contract.buyToken(tokenId, { value: parseEther(ethPrice) });
  const result = await transaction.wait();
  console.log('buyToken result', result);
};