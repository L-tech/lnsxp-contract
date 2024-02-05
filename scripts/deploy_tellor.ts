// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";


const _tellor = "0xb2CB696fE5244fB9004877e58dcB680cB86Ba444";



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
    const constructorArgs = [
      _tellor
    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("TestTellor");
    const data = await Data.deploy(...constructorArgs, {
      ...overrides
    });
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0x4549a91b4727537372925C8C589d9BCfF9B6c261",
    //     constructorArguments: constructorArgs,
    // });
    console.log("Test Tellor contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
