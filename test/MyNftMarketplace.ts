import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatEther, parseEther } from 'ethers/lib/utils';
import { ContractReceipt, ContractTransaction } from "ethers";

import { MyNftMarketplace } from "../typechain-types";

describe("MyNftMarketplace", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployMyNftMarketplaceFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const MyNftMarketplace = await ethers.getContractFactory("MyNftMarketplace");
    const myNftMarketplace = await MyNftMarketplace.deploy();

    return { myNftMarketplace, owner, otherAccount };
  }

  async function createToken(tokenPrice: string, tokenPath: string, myNftMarketplace: MyNftMarketplace) {
    const transaction: ContractTransaction = await myNftMarketplace.createToken(tokenPath, parseEther(tokenPrice));
    await transaction.wait();

    const items: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getOwnedItems();
    return items[items.length - 1];
  }

  describe("Deployment", () => {
    it("Should be deployed successfully", async () => {
      const { myNftMarketplace } = await loadFixture(deployMyNftMarketplaceFixture);

      console.log('Contract address', myNftMarketplace.address);
      expect(myNftMarketplace.address).to.not.equal(0x0);
      expect(myNftMarketplace.address).to.not.equal('');
      expect(myNftMarketplace.address).to.not.equal(null);
      expect(myNftMarketplace.address).to.not.equal(undefined);
    });
  });

  describe("Creating Tokens", () => {
    it('Should create a token', async () => {
      const { myNftMarketplace, owner } = await loadFixture(deployMyNftMarketplaceFixture);

      const tokenPrice: string = '1.0';
      const tokenPath: string = 'abcdefg';
      const newItem: MyNftMarketplace.ItemStructOutput = await createToken(tokenPrice, tokenPath, myNftMarketplace);

      expect(newItem.tokenId.toNumber()).to.equal(1);
      expect(formatEther(newItem.price)).to.equal(tokenPrice);
      expect(newItem.owner).to.equal(owner.address);
      expect(newItem.isForSale).to.equal(true);
    });
  });

  describe("Listing Tokens", () => {
    const tokenPrice: string = '1.0';
    const tokenPath: string = 'abcdefg';

    let newItem: MyNftMarketplace.ItemStructOutput;
    let myNftMarketplace: MyNftMarketplace;
    let owner: any; // SignerWithAddress
    let otherAccount: any; // SignerWithAddress

    beforeEach(async () => {
      // Deploy the contract
      const result = await loadFixture(deployMyNftMarketplaceFixture);
      myNftMarketplace = result.myNftMarketplace;
      owner = result.owner;
      otherAccount = result.otherAccount;

      // Create a token to use in unit tests
      newItem = await createToken(tokenPrice, tokenPath, myNftMarketplace);
    });

    it('Should list owned tokens', async () => {
      const oneItem: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getOwnedItems();
      expect(oneItem.length).to.equal(1);
    });

    it('Should list tokens for sale', async () => {
      const contract: MyNftMarketplace = myNftMarketplace.connect(otherAccount);
      const oneItem: MyNftMarketplace.ItemStructOutput[] = await contract.getItemsForSale();
      expect(oneItem.length).to.equal(1);
    });

    it('Should allow buying tokens', async () => {
      const contract: MyNftMarketplace = myNftMarketplace.connect(otherAccount);
      const buyTransaction: ContractTransaction = await contract.buyToken(newItem.tokenId, { value: newItem.price });
      const buyResult: ContractReceipt = await buyTransaction.wait();
      expect(buyResult).to.not.equal(null);

      const ownedItems: MyNftMarketplace.ItemStructOutput[] = await contract.getOwnedItems();
      expect(ownedItems.length).to.equal(1);

      expect(ownedItems[0].tokenId.toNumber()).to.equal(1);
      expect(formatEther(ownedItems[0].price)).to.equal(tokenPrice);
      expect(ownedItems[0].owner).to.equal(otherAccount.address);
      expect(ownedItems[0].isForSale).to.equal(false);
    });

    it('Should allow editing tokens', async () => {
      const newPrice: string = "2.0";
      const isForSale: boolean = false;

      const editTransaction: ContractTransaction = await myNftMarketplace.editItem(newItem.tokenId, parseEther(newPrice), isForSale);
      const editResult: ContractReceipt = await editTransaction.wait();
      expect(editResult).to.not.equal(null);

      const items: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getOwnedItems();
      expect(items.length).to.equal(1);

      expect(items[0].tokenId.toNumber()).to.equal(1);
      expect(formatEther(items[0].price)).to.equal(newPrice);
      expect(items[0].owner).to.equal(owner.address);
      expect(items[0].isForSale).to.equal(isForSale);
    });
  });
});
