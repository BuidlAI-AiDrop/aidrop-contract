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
  const mbtiNFTAddress = "0x46a8fd938aFc64d64a670b99c5F78eDd3f9107f6"; // Replace with actual MBTI NFT address on Aeneid
  const ipCreator = await IpCreator.deploy(
    ipAssetRegistryAddress,
    mbtiNFTAddress
  );

  await ipCreator.waitForDeployment();

  const ipCreatorAddress = await ipCreator.getAddress();
  console.log(`IpCreator contract deployed to: ${ipCreatorAddress}`);

  // Wait a bit for the deployment to be confirmed
  console.log("Waiting for deployment confirmation...");
  await new Promise((resolve) => setTimeout(resolve, 5000)); // 5 seconds delay

  // Execute mintAndCreateIp function
  console.log("Executing mintAndCreateIp function...");

  // Replace these parameters with actual values needed for your mintAndCreateIp function
  // Assuming the function takes parameters like tokenURI, name, contentHash, etc.
  const tokenURI = "ipfs://your-metadata-uri";
  const ipName = "JENN IP Asset";
  const contentHash = ethers.keccak256(ethers.toUtf8Bytes("content"));

  // Execute the function
  const tx = await ipCreator.mintAndCreateIp(
    deployer.address // recipient
    // Add any other parameters your function requires
  );

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();
  console.log("mintAndCreateIp function executed successfully!");

  // You can add code here to verify the IP was created correctly
  // For example, get the token ID and check its properties
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
