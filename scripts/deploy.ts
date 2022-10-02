import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  const MyNftMarketplace = await ethers.getContractFactory("MyNftMarketplace");
  const marketplace = await MyNftMarketplace.deploy();
  
  await marketplace.deployed();
  console.log("MyNftMarketplace deployed to:", marketplace.address);

  const PriceConsumer = await ethers.getContractFactory("PriceConsumer");
  const priceConsumer = await PriceConsumer.deploy();
  
  await priceConsumer.deployed();
  console.log("PriceConsumer deployed to:", priceConsumer.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });