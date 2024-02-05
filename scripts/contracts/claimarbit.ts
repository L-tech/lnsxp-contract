// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash } from "../helper";


const address = "0x0B59779C5320B384c9D72457fcd92ABA299ef360";
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
  //   "0xfD15D0bf913bE0B7d3A2DDaf8f857Ad48D56013e",
  //   {
  //       ...overrides
  //   }
  // );
  const tx = await cntract.setController(
    "0xaff68FDd8812e1a062d5652Cb4861932C15362A1",
    true,
    {
        ...overrides
    }
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
