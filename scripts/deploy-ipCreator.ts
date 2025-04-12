import { ethers } from "hardhat";

async function main() {
  console.log("Deploying IpCreator contract...");

  // Get the contract factory
  const IpCreator = await ethers.getContractFactory("IpCreator");

  // Get the deployer's address
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying from address: ${deployer.address}`);

  // Deploy the contract
  // Note: Replace these parameters with your actual constructor parameters
  // Assuming IpCreator constructor takes IPAssetRegistry address and other parameters
  const ipAssetRegistryAddress = "0x77319B4031e6eF1250907aa00018B8B1c67a244b"; // Replace with actual IPAssetRegistry address on Aeneid
  const mbtiNFTAddress = "0x1B3eD4A3f806dC5D283eD553F946C9B0f5d4E6B8";
  const licensingModuleAddress = "0x04fbd8a2e56dd85CFD5500A4A4DfA955B9f1dE6f";
  const pilTemplateAddress = "0x2E896b0b2Fdb7457499B56AAaA4AE55BCB4Cd316";
  const royaltyPolicyLapAddress = "0xBe54FB168b3c982b7AaE60dB6CF75Bd8447b390E";
  const wipAddress = "0x1514000000000000000000000000000000000000"; // Replace with actual MBTI NFT address on Aeneid
  const ipCreator = await IpCreator.deploy(
    ipAssetRegistryAddress,
    licensingModuleAddress,
    pilTemplateAddress,
    royaltyPolicyLapAddress,
    wipAddress,
    mbtiNFTAddress
  );
  //address _ipAssetRegistry, address _licensingModule, address _pilTemplate, address _royaltyPolicyLAP, address _wip, address _mbtiNft)
  await ipCreator.waitForDeployment();

  const ipCreatorAddress = await ipCreator.getAddress();
  console.log(`IpCreator contract deployed to: ${ipCreatorAddress}`);

  console.log("Deployment complete!");
  console.log(
    "To mint NFTs, run: yarn hardhat run scripts/mint-mbtiNFT.ts --network aeneid"
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
