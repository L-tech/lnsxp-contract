// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash } from "../helper";


const address = "0x11fDc1dD8874c66ce73AA42e92005c71a6ABf7eE";
const baseNode = namehash.hash('link')


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const deployer = (await ethers.getSigners())[0];
  const provider = deployer.provider!;
  const overrides = txParams(await provider.getFeeData());
  const Contract = await hre.ethers.getContractFactory("ReverseRegistrar");
  const cntract = Contract.attach(address);
  // transaction one
  // const tx = await cntract.setDefaultResolver(
  //   "0xbBA0CfcE06d6581e6FDc6D0aB359C17f3b25850E"
  // );
  // transaction two
  const tx = await cntract.setController(
    "0xAa0C2716011A8bA80550F8742AdfFaaCb0c90CCd",
    true
  );

//   const tx = await cntract.setController(
//     "0x8E5996A3963011Ca9dFa04E3CB773147F98C0e17",
//     true,
//     {
//         ...overrides
//     }
//   );

  console.log("Tx hash:", tx.hash);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
