// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash, AddressZero } from "../helper";


const priceOracle = "0x42D3605DD602DaD0a5d81d03263F9e501F2986bf";
const baseNode = namehash.hash('link')
const ReserveNames = ["resolver", "lns", "arnen", "sphewallet"];
const ReserveDuration = 60 * 60 * 24 * 30 * 12;


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
  const Contract = await hre.ethers.getContractFactory("LNSXP");
  const cntract = Contract.attach(priceOracle);
  const price = 5;
// check is name is available
  // const available = await cntract.price("aneneonaojass", ReserveDuration, ReserveDuration, "0xbAe1b2C5eCD83C00Bad64D45492750b978214A61");
  // console.log("Is name available? ", available);


  // Get the base node
  const checkNode = await cntract.getUserLevel("0xAE816ca6C4FB8c75A5d354B029DED737465E1BaB");
  console.log(checkNode);
//   // Add controller to Registrar Contract
  // const tx = await cntract.setLNSXp(
  //   "0x42D3605DD602DaD0a5d81d03263F9e501F2986bf",
  // );
  // console.log(`> tx: ${tx.hash}`);

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
