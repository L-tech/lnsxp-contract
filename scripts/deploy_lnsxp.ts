// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";



async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  // console.log(prices)
    const treasury = "0xbAe1b2C5eCD83C00Bad64D45492750b978214A61";
    const company = "0xAa0C2716011A8bA80550F8742AdfFaaCb0c90CCd";
    const constructorArgs = [
        treasury,
        company,

    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("LNSXP");
    const data = await Data.deploy(...constructorArgs);
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0xe1CFEB4d718FBA16d2C905CC1A4cE1Aa0F3464Bf",
    //     constructorArguments: constructorArgs,
    // });
    console.log("ReverseRegistrar contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
