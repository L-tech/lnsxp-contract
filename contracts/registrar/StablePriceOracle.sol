//SPDX-License-Identifier: MIT
pragma solidity ~0.8.17;

import "./IPriceOracle.sol";
import "./SafeMath.sol";
import "./StringUtils.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "../ILNSXP.sol";

contract StablePriceOracle is IPriceOracle {
    using StringUtils for *;

    ILNSXP public lnsxp;

    // Rent in base price units by length
    uint256 public immutable price1Letter;
    uint256 public immutable price2Letter; 
    uint256 public immutable price3Letter;
    uint256 public immutable price4Letter;
    uint256 public immutable price5Letter;

    constructor() {
        price1Letter = 100 * 3.17e7;
        price2Letter = 10 * 3.17e7;
        price3Letter = 5 * 3.17e7;
        price4Letter = 2 * 3.17e7;
        price5Letter = 3.17e7;
    }

    function price(
        string calldata name,
        uint256 expires,
        uint256 duration,
          address user
    ) external view override returns (IPriceOracle.Price memory) {
        uint256 len = name.strlen();
        uint256 basePrice;

        if (len >= 5) {
            basePrice = price5Letter * duration;
        } else if (len == 4) {
            basePrice = price4Letter * duration;
        } else if (len == 3) {
            basePrice = price3Letter * duration;
        } else if (len == 2) {
            basePrice = price2Letter * duration;
        } else {
            basePrice = price1Letter * duration;
        }

        string memory userLevel = lnsxp.getUserLevel(user);
        uint256 discountPercentage;
        if (keccak256(abi.encodePacked(userLevel)) == keccak256(abi.encodePacked("Explorer"))) {
            discountPercentage = 10;
        } else if (keccak256(abi.encodePacked(userLevel)) == keccak256(abi.encodePacked("Contributor"))) {
            discountPercentage = 25;
        } else if (keccak256(abi.encodePacked(userLevel)) == keccak256(abi.encodePacked("Advocate"))) {
            discountPercentage = 50;
        } else if (keccak256(abi.encodePacked(userLevel)) == keccak256(abi.encodePacked("Pioneer"))) {
            discountPercentage = 75;
        } else if (keccak256(abi.encodePacked(userLevel)) == keccak256(abi.encodePacked("Visionary"))) {
            discountPercentage = 100;
        } else {
            discountPercentage = 0; // Newcomer or any other level not explicitly mentioned
        }

        // Apply the discount
        uint256 discountedPrice = basePrice - (basePrice * discountPercentage / 100);

        return IPriceOracle.Price({ base: discountedPrice, premium: _premium(name, expires, duration) });
    }

    /**
     * @dev Returns the pricing premium in wei.
     */
    function premium(
        string calldata name,
        uint256 expires,
        uint256 duration
    ) external view returns (uint256) {
        return _premium(name, expires, duration);
    }

    /**
     * @dev Returns the pricing premium in internal base units.
     */
    function _premium(
        string memory, /*name*/
        uint256, /*expires*/
        uint256 /*duration*/
    ) internal view virtual returns (uint256) {
        return 0;
    }

    function supportsInterface(bytes4 interfaceID) public view virtual returns (bool) {
        return interfaceID == type(IERC165).interfaceId || interfaceID == type(IPriceOracle).interfaceId;
    }

    function setLNSXp(ILNSXP _lnsxp) external {
        lnsxp = _lnsxp;
    }
}