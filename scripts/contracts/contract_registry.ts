// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const namehash = require('eth-ens-namehash')
const hre = require("hardhat");
const contentHash = require('content-hash')
import { txParams, labelhash } from "../helper";


const address = "0x0B59779C5320B384c9D72457fcd92ABA299ef360";
const addressTwo = "0xbBA0CfcE06d6581e6FDc6D0aB359C17f3b25850E";
const PubResolverName = "resolver.link";
const PubResolverNode = namehash.hash(PubResolverName);
const TldName = "reverse";
const TldLable = labelhash(TldName);
const TldNode = namehash.hash(TldName);
const AddrName = `addr.${TldName}`;
const AddrLable = labelhash("addr");
const AddrNode = namehash.hash(AddrName);
const ZERO_HASH = "0x0000000000000000000000000000000000000000000000000000000000000000";


async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const deployer = (await ethers.getSigners())[0];
  // const provider = new ethers.providers.JsonRpcProvider("https://rpc.ankr.com/filecoin");
  // const overrides = txParams(provider.getGasPrice());
  const Contract = await hre.ethers.getContractFactory("LNSRegistry");
  const cntract = Contract.attach(address);
  const Contractt = await hre.ethers.getContractFactory("PublicResolver");
  const cntractt = Contractt.attach(addressTwo);

  const tx1 = await cntract.setResolver(PubResolverNode, "0xbBA0CfcE06d6581e6FDc6D0aB359C17f3b25850E");
  console.log(`> tx: ${tx1.hash}`);
  await tx1.wait();
  console.log("Tx hash:", tx1.hash);

    console.log(`Setting address for ${PubResolverName} to PublicResolver ...`);
    const tx2 = await cntractt["setAddr(bytes32,address)"](PubResolverNode, "0xbBA0CfcE06d6581e6FDc6D0aB359C17f3b25850E");
    console.log(`> tx: ${tx2.hash}`);
    await tx2.wait();

  // const checkNode = await cntract.owner(AddrNode);
  // console.log(checkNode);
  // const ipfsHash = 'QmZYmH5iDbD6v3U2ixoVAjioSzvWJszDzYdbeCLquGSpVm'

// const contentH = contentHash.fromIpfs(ipfsHash)
// console.log(contentH);
// const codec = contentHash.getCodec(contentH)
// console.log(codec);
// Get Owner
// const ownner = await cntract.owner(TldNode);
// console.log(ownner);
// Set Subnode Owner
  // const tx = await cntract.setSubnodeOwner(
  //   TldNode,
  //   AddrLable,
  //   "0x11fDc1dD8874c66ce73AA42e92005c71a6ABf7eE",
  // );
  
  // const tx = await cntract.setSubnodeOwner(
  //   ZERO_HASH,
  //   TldLable,
  //   "0xbAe1b2C5eCD83C00Bad64D45492750b978214A61"
  // );
  // console.log("Tx hash:", tx.hash);
  // const tx2 = await cntract.setSubnodeOwner(
  //   TldNode,
  //   AddrLable,
  //   "0x11fDc1dD8874c66ce73AA42e92005c71a6ABf7eE",
  // );
  // console.log("Tx hash:", tx2.hash);
// Set Addr for Name
  // const tx2 = await cntractt["setAddr(bytes32,address)"](
  //   TldNode,
  //   "0xbAe1b2C5eCD83C00Bad64D45492750b978214A61",
  // );
  // console.log("Tx hash:", tx2.hash);

// Function to set Content Hash
//     const tx1 = await cntractt.setContenthash(
//     TldNode,
//     ethers.utils.toUtf8Bytes(contentHash.fromIpfs(ipfsHash)),
//     {
//         ...overrides
//     }
//   );

// function to setAddr
//   const tx2 = await cntractt['setAddr(bytes32,uint256,bytes)'](
//     TldNode,
//     461,
//     ethers.utils.toUtf8Bytes("0x562937835cdD5C92F54B94Df658Fd3b50A68ecD5"),
//     {
//         ...overrides
//     }
//   );
  
  // console.log("Tx hash:", tx2.hash);
// const checkk = await cntract.owner(TldNode);
// console.log(checkk);

    //function to get addr and contentHash
    // const addr = await cntractt['addr(bytes32,uint256)'](TldNode,461);
    // console.log("Your address is ", ethers.utils.toUtf8String(addr))

    // const conH = await cntractt.contenthash(TldNode);
    // const decodedContent = (contentHash.decode(ethers.utils.toUtf8String(conH)));
    // let cidData = contentHash.getCodec(ethers.utils.toUtf8String(conH))
    // if(cidData == "ipfs-ns") {
    //     cidData = "ipfs://" + decodedContent
    // }
    // console.log("Your content CID is ", cidData)



}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
