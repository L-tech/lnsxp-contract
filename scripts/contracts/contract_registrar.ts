// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
import { txParams, labelhash, AddressZero } from "../helper";


const registrarAddress = "0xaff68FDd8812e1a062d5652Cb4861932C15362A1";
const baseNode = namehash.hash('link')
// const ReserveNames = ["resolver", "lns", "arnen", "arnenlabs"];
// const ReserveNames = ["ens"];


const ReserveNames = ["resolver", "lns", "arnen", "lightlink"];
const ReserveDuration = 3600 * 24 * 365 * 10;


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
  const Contract = await hre.ethers.getContractFactory("Registrar");
  const cntract = Contract.attach(registrarAddress);
  const price = 5;
// check is name is available
  // const available = await cntract.available("juan");
  // console.log("Is name available? ", available);


  // Get the base node
  // const checkNode = await cntract.baseNode();
  // console.log(checkNode);
  // Add controller to Registrar Contract
  // const tx = await cntract.addController(
  //   "0xAa0C2716011A8bA80550F8742AdfFaaCb0c90CCd"
  // );
  // console.log(`> tx: ${tx.hash}`);

// Set Resolver

  const tx = await cntract.setResolver(
    "0xbBA0CfcE06d6581e6FDc6D0aB359C17f3b25850E"
  );
  console.log(`> tx: ${tx.hash}`);

// Check contract controllers
// const checkIt = await cntract.controllers("0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5");
// console.log("Are you a controller? ",checkIt);
//Owner Reserve Names

  //  for (const name of ReserveNames) {
  //       const idname = name;
  //       // const id = labelhash(name);
  //       console.log(`Register reserve name: ${idname} ...`);
  //       const tx = await cntract.register(
  //           idname,
  //           "0xbAe1b2C5eCD83C00Bad64D45492750b978214A61",
  //           ReserveDuration,
  //           AddressZero
  //       );
  //       console.log(`> tx: ${tx.hash}`);
  //     }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
