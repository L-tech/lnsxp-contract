// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import "./LNS.sol";

/**
 * A registrar that allocates subdomains to the first person to claim them.
 */
contract FIFSRegistrar {
    LNS lns;
    bytes32 rootNode;

    modifier only_owner(bytes32 label) {
        address currentOwner = lns.owner(
            keccak256(abi.encodePacked(rootNode, label))
        );
        require(currentOwner == address(0x0) || currentOwner == msg.sender);
        _;
    }

    /**
     * Constructor.
     * @param fnsAddr The address of the LNS registry.
     * @param node The node that this registrar administers.
     */
    constructor(LNS fnsAddr, bytes32 node) {
        lns = fnsAddr;
        rootNode = node;
    }

    /**
     * Register a name, or change the owner of an existing registration.
     * @param label The hash of the label to register.
     * @param owner The address of the new owner.
     */
    function register(bytes32 label, address owner) public only_owner(label) {
        lns.setSubnodeOwner(rootNode, label, owner);
    }
}