// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";


const _lns = "0x0B59779C5320B384c9D72457fcd92ABA299ef360";
const _trustedRegistrarController = "0xAa0C2716011A8bA80550F8742AdfFaaCb0c90CCd";
const _trustedReverseRegistrar = "0x11fDc1dD8874c66ce73AA42e92005c71a6ABf7eE";



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
    const constructorArgs = [
      _lns,
      _trustedRegistrarController,
      _trustedReverseRegistrar
    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("PublicResolver");
    const data = await Data.deploy(...constructorArgs);
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0x65dFAfbCf20A2E7a3a3754c608Fa15801192D3D0",
    //     constructorArguments: constructorArgs,
    // });
    console.log("PublicResolver contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
