import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { BigNumber } from "ethers";

describe("PriceConsumer", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshopt in every test.
  async function deployPriceConsumerFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const PriceConsumer = await ethers.getContractFactory("PriceConsumer");
    const priceConsumer = await PriceConsumer.deploy();

    return { priceConsumer, owner, otherAccount };
  }

  describe("Deployment", () => {
    it("Should be deployed successfully", async () => {
      const { priceConsumer } = await loadFixture(deployPriceConsumerFixture);

      console.log('Contract address', priceConsumer.address);

      expect(priceConsumer.address).to.not.equal(0x0);
      expect(priceConsumer.address).to.not.equal('');
      expect(priceConsumer.address).to.not.equal(null);
      expect(priceConsumer.address).to.not.equal(undefined);
    });
  });

  describe("Get Latest Price", () => {
    it('Should retrieve the latest ETH/USD price', async () => {
      const { priceConsumer } = await loadFixture(deployPriceConsumerFixture);

      const price: BigNumber = await priceConsumer.getLatestPrice();
      expect(price.isZero()).to.be.false;
    });
  });
});
