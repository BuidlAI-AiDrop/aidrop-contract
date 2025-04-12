import { ethers } from "hardhat";

async function main() {
  const MBTI = await ethers.getContractFactory("MBTI");

  // Deploy with constructor arguments (name and symbol)
  const mbti = await MBTI.deploy(
    "MBTI NFT",
    "MBTI",
    "" // example tokenURI
  );

  await mbti.waitForDeployment();

  const address = await mbti.getAddress();
  console.log(`MBTI contract deployed to: ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
