import { providers, ethers } from 'ethers';

import marketContractAbi from '../artifacts/contracts/MyNftMarketplace.sol/MyNftMarketplace.json'

const MarketContractAddress = '0x0165878A594ca255338adfa4d48449f69242Eb8F';

function getContract(signerOrProvider: providers.Provider | ethers.Signer): ethers.Contract {
  return new ethers.Contract(MarketContractAddress, marketContractAbi.abi, signerOrProvider);
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

  const ethereum: providers.ExternalProvider = (window as any).ethereum;
  const provider: providers.Web3Provider = new ethers.providers.Web3Provider(ethereum);
  const signer: providers.JsonRpcSigner = provider.getSigner();

  const contract: ethers.Contract = getContract(signer);
  const transaction = await contract.createToken(url, price);
  const result: number = await transaction.wait();
  console.log('createToken result', result);
};