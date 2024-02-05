// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash, AddressZero } from "../helper";


const priceOracle = "0xA78b8e953B78b1D100cda10c7907b959edc6b021";


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
  const Contract = await hre.ethers.getContractFactory("SubscriptionData");
  const cntract = Contract.attach(priceOracle);
  const price = 5;


  // set governance address
  // const tx = await cntract.setGovernanceAddress(
  //   "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
  //   {
  //       ...overrides
  //   }
  // );
    
  // const tx = await cntract.setManagers(
  //   ["0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5","0xbAe1b2C5eCD83C00Bad64D45492750b978214A61"],
  //   {
  //       ...overrides
  //   }
  // );
// console.log(`> tx: ${tx.hash}`);
  const tx = await cntract.removeTokens(["0x4F9337B261136E8c06ed4F543e28AbeEe08D889E"],
    {
        ...overrides
    }
  );
    // console.log(`> tx: ${tx.hash}`);
  // const tx = await cntract.addNewToken(
  //   "link",
  //   "0x5FEAa6344DbFE38aC9838E48C2f9E4ce8b7Efe8a",
  //   18,
  //   true,
  //   "0x5FEAa6344DbFE38aC9838E48C2f9E4ce8b7Efe8a",
  //   18,
  //   {
  //       ...overrides
  //   }
  // );
    console.log(`> tx: ${tx.hash}`);

// Set Resolver

//   const tx1 = await cntract.setResolver(
//     "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb",
//     {
//         ...overrides
//     }
//   );

// Check contract controllers
// const checkIt = await cntract.controllers("0xA05d173F369263fB697e1a0e214b107b59237400");
// console.log("Are you a controller? ",checkIt);
// //Owner Reserve Names

// for (const name of ReserveNames) {
//         const id = labelhash(name);
//         if (!await cntract.available(id)) {
//           continue;
//         }
//         console.log(`Register reserve name: ${name} ...`);
//         const tx = await cntract.register(
//             name,
//             "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
//             ReserveDuration,
//             AddressZero, {
//                 ...overrides
//             }
//         );
//         console.log(`> tx: ${tx.hash}`);
//       }




}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
