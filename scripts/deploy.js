// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const ethers = hre.ethers;

async function main() {
  // Ensure the ABI is correctly imported
  const vinceCharityDonationABI = require("../artifacts/contracts/VinceCharityDonation.sol/VinceCharityDonation.json").abi;

  // Deploy the contract
  const VinceCharityDonation = await ethers.getContractFactory("VinceCharityDonation", vinceCharityDonationABI);
  const vinceCharityDonation = await VinceCharityDonation.deploy();
  await vinceCharityDonation.deployed();

  console.log(`VinceCharityDonation contract deployed to: ${vinceCharityDonation.address}`);

  // Example: interact with the deployed contract
  const goalAmount = 100;
  await vinceCharityDonation.defineGoal(goalAmount);
  console.log(`Initial goal defined: ${goalAmount} ETH`);
}

// Ensure the script properly handles errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
