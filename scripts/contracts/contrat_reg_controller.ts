// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')

const hre = require("hardhat");
import { txParams, labelhash, AddressZero } from "../helper";
const ReserveDuration = 60 * 60 * 24 * 60;


const address = "0xAa0C2716011A8bA80550F8742AdfFaaCb0c90CCd";

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
  const Contract = await hre.ethers.getContractFactory("RegistrarController");
  const cntract = Contract.attach(address);
  // transaction one
  // const tx = await cntract.addController(
  //   "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
  //   {
  //       ...overrides
  //   }
  // );
  // console.log("Tx hash:", tx.hash);


  const isAvailable = await cntract.available("arnenlabs");
  console.log("available? ", isAvailable);
  // const isAvailable = await cntract.rentPrice(name, ReserveDuration);
  // console.log("expiryDate? ", isAvailable);

//   const checkNode = await cntract.baseNode();
//   console.log(checkNode);
  // first transaction
  // const tx = await regCont.addController(
  //   "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
  //   {
  //       ...overrides
  //   }
  // );
  

// second transaction
  // const tx = await cntract.setLNSXp(
  //   "0x42D3605DD602DaD0a5d81d03263F9e501F2986bf",
  // );
  // console.log("Tx hash:", tx.hash);

// third transaction

//   const tx = await cntract.setResolver(
//     "0x8E5996A3963011Ca9dFa04E3CB773147F98C0e17",
//     {
//         ...overrides
//     }
//   );

  // const tx = await cntract.register(
  //   "legendarome",
  //   "0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5",
  //   ReserveDuration,
  //   "0xbeB0B97A5e238b383f45757dE2e93080DACe0eCb",
  //   [],
  //   true,
  //   {
  //       value: ethers.utils.parseEther(price.toString()),
  //       ...overrides
  //   }
  // );


  // const tx = await cntract.setPriceOracle(
  //   "0x16486fdaa93e7E11BBdFF64db232EbE5a99A6aE0"
  // );
  // console.log("Tx hash:", tx.hash);
// const namme = await cntract.costName();
// console.log(namme);
// const nammme = await cntract.moneyName();
// console.log(nammme);
const name = "xxxploit";
const tx = await cntract.register(
  name,
  "0xbAe1b2C5eCD83C00Bad64D45492750b978214A61",
  ReserveDuration,
  "0xbBA0CfcE06d6581e6FDc6D0aB359C17f3b25850E",
  [],
  false,
  {
    value: ethers.utils.parseEther("0.001"),
  }
);
console.log("Tx hash:", tx.hash);
  // console.log(ReserveDuration);
  // const yes = await cntract.available("aneneona.link")
  // console.log("Name available? ", yes);
//fourth transaction

// for (const name of ReserveNames) {
//         const id = labelhash(name);
//         if (!await cntract.available(id)) {
//           continue;
//         }
//         console.log(`Register reserve name: ${name} ...`);
        
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
