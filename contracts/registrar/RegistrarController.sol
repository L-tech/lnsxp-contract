//SPDX-License-Identifier: MIT
pragma solidity >=0.8.17;

import "./Registrar.sol";
import "./IPriceOracle.sol";
import "./interfaces/IRegistrarController.sol";
import "./interfaces/IResolver.sol";
import "./interfaces/IReverseRegistrar.sol";
import "../ILNSXP.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./StringUtils.sol";

error NameNotAvailable(string name);
error DurationTooShort(uint256 duration);
error ResolverRequiredWhenDataSupplied();
error InsufficientValue();
error Unauthorised(bytes32 node);

/**
 * @dev A registrar controller for registering and renewing names at fixed cost.
 */
contract RegistrarController is IRegistrarController, Ownable, IERC165 {
    using StringUtils for *;
    using Address for address;
    using SafeERC20 for IERC20;

    ILNSXP public lnsxp;

    uint256 public constant MIN_REGISTRATION_DURATION = 29 days;
    // namehash("link")
    bytes32 private constant LINK_NODE = 0x0e451ab80a411882dde5df2cc62010c3a4eb1b610bc7bfe8ebb3b5b7382fb6d1;
    uint64 private constant MAX_EXPIRY = type(uint64).max;
    IRegistrar public immutable base;
    IReverseRegistrar public immutable reverseRegistrar;
    IPriceOracle public prices;
    mapping (address => string[]) public lnsLookupTable;

    event NameRegistered(
        string name,
        bytes32 indexed label,
        address indexed owner,
        uint256 baseCost,
        uint256 premium,
        uint256 expires
    );
    event NameRenewed(string name, bytes32 indexed label, uint256 cost, uint256 expires);

    constructor(
        IRegistrar _base,
        IPriceOracle _prices,
        IReverseRegistrar _reverseRegistrar
    ) {
        base = _base;
        prices = _prices;
        reverseRegistrar = _reverseRegistrar;
    }

    function valid(string memory name) public pure override returns (bool) {
        return name.strlen() >= 3;
    }

    function available(string memory name) public view override returns (bool) {
        bytes32 label = keccak256(bytes(name));
        return valid(name) && base.available(uint256(label));
    }

    function nameExpires(string memory name) external view override returns (uint256) {
        bytes32 label = keccak256(bytes(name));
        return base.nameExpires(uint256(label));
    }

    function rentPrice(string memory name, uint256 duration)
        public
        view
        override
        returns (IPriceOracle.Price memory price)
    {
        bytes32 label = keccak256(bytes(name));
        price = prices.price(name, base.nameExpires(uint256(label)), duration, msg.sender);
    }
    function burnXpToken(address user, uint8 percentage) public {
        lnsxp.burnUserToken(user, percentage);
    }

    function register(
        string calldata name,
        address _owner,
        uint256 duration,
        address resolver,
        bytes[] calldata data,
        bool reverseRecord
    ) public payable override {
        if (!available(name)) {
            revert NameNotAvailable(name);
        }
        if (duration < MIN_REGISTRATION_DURATION) {
            revert DurationTooShort(duration);
        }
        if (data.length > 0 && resolver == address(0)) {
            revert ResolverRequiredWhenDataSupplied();
        }

        IPriceOracle.Price memory price = rentPrice(name, duration);
        uint256 totalPrice = price.base + price.premium;
        if (msg.value < totalPrice) {
            revert InsufficientValue();
        }


        uint256 expires = base.register(name, _owner, duration, resolver);

        bytes32 label = keccak256(bytes(name));
        if (data.length > 0) {
            _setRecords(resolver, label, data);
        }

        if (reverseRecord) {
            _setReverseRecord(name, resolver, msg.sender);
        }
        if (lnsLookupTable[msg.sender].length == 0) {
            lnsLookupTable[msg.sender] = new string[](1);
            lnsLookupTable[msg.sender][0] = name;
        } else {
            lnsLookupTable[msg.sender].push(name);
        }
        emit NameRegistered(name, label, _owner, price.base, price.premium, expires);

        if (msg.value > totalPrice) {
            payable(msg.sender).transfer(msg.value - totalPrice);
        }
        lnsxp.mint(msg.sender, 1000);
    }

    function grantXpPoint(address user, uint256 point) external {
        lnsxp.mint(user, point);
    }

    function renew(string calldata name, uint256 duration) external payable override {
        IPriceOracle.Price memory price = rentPrice(name, duration);
        if (msg.value < price.base) {
            revert InsufficientValue();
        }
        uint256 expires;
        bytes32 label = keccak256(bytes(name));
        expires = base.renew(uint256(label), duration);

        if (msg.value > price.base) {
            payable(msg.sender).transfer(msg.value - price.base);
        }
        lnsxp.mint(msg.sender, 1000);

        emit NameRenewed(name, label, msg.value, expires);
    }

    function setPriceOracle(IPriceOracle _prices) external onlyOwner {
        prices = _prices;
    }

    function setLNSXp(ILNSXP _lnsxp) external onlyOwner {
        lnsxp = _lnsxp;
    }

    function getNames(address _address) external view returns (string[] memory) {
        return lnsLookupTable[_address];
    }

    function withdraw() external {
        payable(owner()).transfer(address(this).balance);
    }

    function withdrawERC20(
        IERC20 token,
        address to,
        uint256 amount
    ) external onlyOwner {
        token.safeTransfer(to, amount);
    }

    function supportsInterface(bytes4 interfaceID) external pure returns (bool) {
        return interfaceID == type(IERC165).interfaceId || interfaceID == type(IRegistrarController).interfaceId;
    }

    /* Internal functions */

    function _setRecords(
        address resolverAddress,
        bytes32 label,
        bytes[] calldata data
    ) internal {
        bytes32 nodehash = keccak256(abi.encodePacked(LINK_NODE, label));
        IResolver resolver = IResolver(resolverAddress);
        resolver.multicallWithNodeCheck(nodehash, data);
    }

    function _setReverseRecord(
        string memory name,
        address resolver,
        address _owner
    ) internal {
        reverseRegistrar.setNameForAddr(msg.sender, _owner, resolver, string.concat(name, ".link"));
    }
}