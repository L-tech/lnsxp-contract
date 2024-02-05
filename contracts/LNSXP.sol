// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract LNSXP is ERC20, ERC20Burnable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    struct Level {
        string name;
        uint256 minXP;
        uint256 maxXP;
    }

    Level[] public levels;
    mapping(address => uint256) xpTokenEarned;

    constructor(address defaultAdmin, address regController)
        ERC20("LNSXP", "LXP")
    {
        _grantRole(DEFAULT_ADMIN_ROLE, defaultAdmin);
        _grantRole(DEFAULT_ADMIN_ROLE, regController);
        _grantRole(MINTER_ROLE, regController);
        _grantRole(MINTER_ROLE, defaultAdmin);
        levels.push(Level("Newcomer", 0, 999));
        levels.push(Level("Explorer", 1000, 4999));
        levels.push(Level("Contributor", 5000, 9999));
        levels.push(Level("Advocate", 10000, 19999));
        levels.push(Level("Pioneer", 20000, 49999));
        levels.push(Level("Visionary", 50000, type(uint256).max));
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount * 10 ** decimals());
        xpTokenEarned[to] += amount;
    }

    function updateRegController(address regControllerAddress) public onlyRole(DEFAULT_ADMIN_ROLE) {
        _grantRole(DEFAULT_ADMIN_ROLE, regControllerAddress);
        _grantRole(MINTER_ROLE, regControllerAddress);
    }

    function burnUserToken(address user, uint256 percentage) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(percentage <= 100, "Invalid percentage");
        uint256 balance = balanceOf(user);
        uint256 amountToBurn = balance * percentage / 100;

        _burn(user, amountToBurn);
    }

    function getUserLevel(address user) public view returns (string memory) {
        uint256 userXP = xpTokenEarned[user];
        for (uint256 i = 0; i < levels.length; i++) {
            if (userXP >= levels[i].minXP && userXP <= levels[i].maxXP) {
                return (levels[i].name);
            }
        }
        return ("Level not found.");
    }

    function getUserXp(address user) public view returns (uint256) {
        return balanceOf(user);
    }
}
