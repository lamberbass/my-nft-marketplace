import { time, loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import { ethers } from "hardhat";
import { formatEther, parseEther, solidityKeccak256 } from 'ethers/lib/utils';
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

  describe("Tokens", () => {
    it('Should create a token', async () => {
      const { myNftMarketplace, owner } = await loadFixture(deployMyNftMarketplaceFixture);

      const noItems: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getOwnedItems();
      expect(noItems.length).to.equal(0);

      const tokenPrice: string = "1.0";
      const tokenPath: string = "abcdefg";

      const transaction: ContractTransaction = await myNftMarketplace.createToken(tokenPath, parseEther(tokenPrice));
      const result: ContractReceipt = await transaction.wait();
      expect(result).to.not.equal(null);

      const oneItem: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getOwnedItems();
      expect(oneItem.length).to.equal(1);

      expect(oneItem[0].tokenId.toNumber()).to.equal(1);
      expect(formatEther(oneItem[0].price)).to.equal(tokenPrice);
      expect(oneItem[0].owner).to.equal(owner.address);
      expect(oneItem[0].isForSale).to.equal(true);
    });

    it('Should list tokens for sale', async () => {
      const { myNftMarketplace, owner, otherAccount } = await loadFixture(deployMyNftMarketplaceFixture);

      const noItems: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getItemsForSale();
      expect(noItems.length).to.equal(0);

      const tokenPrice: string = "1.0";
      const tokenPath: string = "abcdefg";

      const transaction: ContractTransaction = await myNftMarketplace.createToken(tokenPath, parseEther(tokenPrice));
      const result: ContractReceipt = await transaction.wait();
      expect(result).to.not.equal(null);

      const contract = myNftMarketplace.connect(otherAccount);
      const oneItem: MyNftMarketplace.ItemStructOutput[] = await contract.getItemsForSale();
      expect(oneItem.length).to.equal(1);
    });

    it('Should allow buying tokens', async () => {
      const { myNftMarketplace, owner, otherAccount } = await loadFixture(deployMyNftMarketplaceFixture);

      const tokenPrice: string = "1.0";
      const tokenPath: string = "abcdefg";

      const transaction: ContractTransaction = await myNftMarketplace.createToken(tokenPath, parseEther(tokenPrice));
      const result: ContractReceipt = await transaction.wait();
      expect(result).to.not.equal(null);

      const contract = myNftMarketplace.connect(otherAccount);
      const oneItem: MyNftMarketplace.ItemStructOutput[] = await contract.getItemsForSale();
      expect(oneItem.length).to.equal(1);

      expect(oneItem[0].tokenId.toNumber()).to.equal(1);
      expect(formatEther(oneItem[0].price)).to.equal(tokenPrice);
      expect(oneItem[0].owner).to.equal(owner.address);
      expect(oneItem[0].isForSale).to.equal(true);

      const buyTransaction: ContractTransaction = await contract.buyToken(oneItem[0].tokenId, { value: oneItem[0].price });
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
      const { myNftMarketplace, owner } = await loadFixture(deployMyNftMarketplaceFixture);

      const tokenPrice: string = "1.0";
      const tokenPath: string = "abcdefg";

      const transaction: ContractTransaction = await myNftMarketplace.createToken(tokenPath, parseEther(tokenPrice));
      const result: ContractReceipt = await transaction.wait();
      expect(result).to.not.equal(null);

      const ownedItems: MyNftMarketplace.ItemStructOutput[] = await myNftMarketplace.getOwnedItems();
      expect(ownedItems.length).to.equal(1);

      expect(ownedItems[0].tokenId.toNumber()).to.equal(1);
      expect(formatEther(ownedItems[0].price)).to.equal(tokenPrice);
      expect(ownedItems[0].owner).to.equal(owner.address);
      expect(ownedItems[0].isForSale).to.equal(true);

      const newPrice: string = "2.0";
      const isForSale: boolean = false;

      const editTransaction: ContractTransaction = await myNftMarketplace.editItem(ownedItems[0].tokenId, parseEther(newPrice), isForSale);
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
