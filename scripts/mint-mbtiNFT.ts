import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { Contract } from "ethers";

dotenv.config();

// Load contract addresses from .env file or hardcode them here
const IP_CREATOR_ADDRESS =
  process.env.IP_CREATOR_ADDRESS ||
  "0xB3e993c87c17E2B64B03c5d14FE0adE4F6a72d57"; // Replace with your deployed IpCreator address
const MBTI_NFT_ADDRESS =
  process.env.MBTI_NFT_ADDRESS || "0x1B3eD4A3f806dC5D283eD553F946C9B0f5d4E6B8";

async function main() {
  // Get the signer
  const [signer] = await ethers.getSigners();
  console.log(`Using address: ${signer.address}`);

  // Get the IpCreator contract
  const IpCreator = await ethers.getContractFactory("IpCreator");
  //const ipCreator = await IpCreator.attach(IP_CREATOR_ADDRESS).connect(signer);
  const ipCreator = new Contract(
    IP_CREATOR_ADDRESS,
    IpCreator.interface,
    signer
  );
  // Get the MBTI contract
  const MBTI = await ethers.getContractFactory("MBTI");
  const mbtiContract = MBTI.attach(MBTI_NFT_ADDRESS) as unknown as {
    balanceOf: (address: string) => Promise<any>;
    tokenURI: (tokenId: number) => Promise<any>;
  };

  console.log("Minting a new NFT and creating IP...");

  // Replace with your desired token URI
  const tokenURI =
    "https://aidrop-test.s3.ap-southeast-2.amazonaws.com/aa.json";

  try {
    // await ipCreator.callStatic.mintAndCreateIp(signer.address, tokenURI);
    //   console.log("✅ callStatic: no revert detected");
    // } catch (staticError: any) {
    //   console.error("❌ Revert detected during callStatic execution:");
    //   console.error(staticError.reason || staticError.message || staticError);
    //   return; // 여기서 멈추도록 할 수 있음
    // }

    // Execute mintAndCreateIp function
    const tx = await ipCreator.mintAndCreateIp(
      signer.address, // recipient
      tokenURI,
      { gasLimit: 1000000 }
    );

    console.log(`Transaction hash: ${tx.hash}`);
    await tx.wait();
    console.log("NFT minted and IP created successfully!");

    // Try to determine the token ID
    // This is a simplified approach - you may need to adjust based on your contract
    // Option 1: If your contract emits an event with the token ID, parse the logs
    // Option 2: If tokens are minted sequentially, you might know the ID

    // For this example, we'll try to get the token count and assume it's the latest ID
    // Replace this with your actual method of determining the token ID
    let tokenId;
    try {
      // This is a placeholder - replace with your actual method to get the token ID
      // For example, if your contract has a function to get the latest token ID:
      // tokenId = await mbtiContract.getLatestTokenId();

      // Or if you know tokens are minted sequentially starting from 1:
      const balance = await mbtiContract.balanceOf(signer.address);
      tokenId = Number(balance);
      console.log(`Token ID: ${tokenId}`);

      // Check the tokenURI
      const retrievedTokenURI = await mbtiContract.tokenURI(tokenId);
      console.log(`Token URI: ${retrievedTokenURI}`);

      // Verify it matches what we expected
      if (retrievedTokenURI === tokenURI) {
        console.log("✅ Token URI matches the expected value!");
      } else {
        console.log("❌ Token URI does not match the expected value!");
        console.log(`Expected: ${tokenURI}`);
        console.log(`Actual: ${retrievedTokenURI}`);
      }
    } catch (error) {
      console.error("Error checking token URI:", error);
    }
  } catch (error) {
    console.error("Error minting NFT:", error);
    console.error(error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
