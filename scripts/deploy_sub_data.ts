// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("@ethersproject/bignumber");
const { ethers } = require("hardhat");
const hre = require("hardhat");
import { txParams } from "./helper";


const discountSlabs: number[] = [];
const discountPercents: number[] = [];
const spheTestToken = "0xF7ec286A19CE6fe80c6A0d5CEb9528d9a87c9557";
// const usdcTest = "0xE163A5689Dc303f5A7AFdbbb050432Fb5a8E7174";
const escrow = "0x3ae68d8eFB25C137aBd52F16f3fF3067856aa175";
// let argoPriceFeed = "0x987aeea14c3638766ef05f66e64f7ea38ddc8dcd";
// const argoFeedSymbol = "ARGO/USD";
// const usdcFeedSymbol = "USDC/USD";
// const usdcFeedAddress = "0x572dDec9087154dC5dfBB1546Bb62713147e0Ab0";
const params = [
    "PACKAGE_PRO_FIRST",
    "PACKAGE_PRO",
    "PACKAGE_STARTER",
    "BONUS_BANDWIDTH",
    "BONUS_CONCURRENT_BUILD",
    "BONUS_DEPLOYMENT_PER_DAY",
    "BONS_HNS_DOMAIN_LIMIT",
    "BONUS_ENS_DOMAIN_LIMIT",
    "BONUS_ENVIRONMENTS",
    "BONUS_STORAGE_ARWEAVE",
    "BONUS_STORAGE_IPFS",
    "BONUS_CLUSTER_AKT",
    "BONUS_PASSWORD_PROTECTION",
  ];
const getConvertedPrice = (price: number) => {
    return ethers.utils.parseEther(price.toString());
};
const prices = [
    getConvertedPrice(20),
    getConvertedPrice(15),
    getConvertedPrice(0),
    getConvertedPrice(0.4),
    getConvertedPrice(30),
    getConvertedPrice(0.01),
    getConvertedPrice(1),
    getConvertedPrice(1),
    getConvertedPrice(5),
    getConvertedPrice(0.0033),
    getConvertedPrice(0.0001),
    getConvertedPrice(1),
    getConvertedPrice(120),
  ];



async function main() {
    // Hardhat always runs the compile task when running scripts with its command
    // line interface.
    //
    // If this script is run directly using `node` you may want to call compile
    // manually to make sure everything is compiled
    // await hre.run('compile');

    // We get the contract to deploy
    const constructorArgs = [
        params,
        prices,
        escrow,
        discountSlabs,
        discountPercents,
        spheTestToken,
    ];
    const deployer = (await ethers.getSigners())[0];
    const provider = deployer.provider!;
    const overrides = txParams(await provider.getFeeData());
    const Data = await hre.ethers.getContractFactory("SubscriptionData");
    const data = await Data.deploy(...constructorArgs, {
        ...overrides
    });
    await data.deployed();
    // await hre.run("verify:verify", {
    //     address: "0x4549a91b4727537372925C8C589d9BCfF9B6c261",
    //     constructorArguments: constructorArgs,
    // });
    console.log("RegistrarController contract deployed to:", data.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
