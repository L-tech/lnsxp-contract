// SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

interface ILNSXP {
    // Function to mint new tokens; only accessible by accounts with the MINTER_ROLE
    function mint(address to, uint256 amount) external;

    // Function to update the registration controller; only accessible by accounts with the DEFAULT_ADMIN_ROLE
    function updateRegController(address regControllerAddress) external;

    // Function to get the user's level based on their XP
    function getUserLevel(address user) external view returns (string memory);

    // Function to get the amount of XP a user has earned
    function getUserXp(address user) external view returns (uint256);

    function burnUserToken(address user, uint256 percentage) external;
}
