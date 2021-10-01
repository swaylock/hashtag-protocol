// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/token/ERC721/Extensions/IERC721MetadataUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165StorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/math/SafeMathUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
//import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "hardhat/console.sol";

import {HashtagAccessControls} from "./HashtagAccessControls.sol";

/**
 * @title Hashtag Protocol contract
 * @notice Core smart contract of the protocol that governs the creation of hashtag tokens
 * @author Hashtag Protocol
 */
contract HashtagProtocol is ERC721Upgradeable, ERC165StorageUpgradeable, UUPSUpgradeable {
    using AddressUpgradeable for address;
    using StringsUpgradeable for uint256;
    using SafeMathUpgradeable for uint256;

    event NewBaseURI(string baseURI);

    event MintHashtag(uint256 indexed tokenId, string displayHashtag, address indexed publisher, address creator);

    event HashtagReset(uint256 indexed tokenId, address indexed owner);

    event HashtagRenewed(uint256 indexed tokenId, address indexed caller);

    event OwnershipTermLengthUpdated(uint256 originalOwnershipLength, uint256 updatedOwnershipLength);

    event RenewalPeriodUpdated(uint256 originalRenewalPeriod, uint256 updatedRenewalPeriod);

    // @notice ERC165 interface for ERC721
    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;

    // @notice ERC165 interface for ERC721 Metadata
    bytes4 private constant _INTERFACE_ID_ERC721_METADATA = 0x5b5e139f;

    // @notice ERC165 interface for ERC721 Metadata
    bytes4 private constant _INTERFACE_ID_ERC165 = 0x01ffc9a7;

    // @notice Token name
    //string public name;

    // @notice Token symbol
    //string public symbol;

    // Token name
    //string private _name;

    // Token symbol
    //string private _symbol;
    string public constant NAME = "HTP: HASHTAG Registry";
    string public constant VERSION = "0.2.0";

    /// @notice minimum time in seconds that a hashtag is owned
    uint256 public ownershipTermLength;

    // baseURI for looking up tokenURI for a token
    string public baseURI;

    /// @notice current tip of the hashtag tokens (and total supply) as minted consecutively
    uint256 public tokenPointer;

    /// @notice core Hashtag protocol account
    address payable public platform;

    /// @notice minimum hashtag length
    uint256 public hashtagMinStringLength;

    /// @notice maximum hashtag length
    uint256 public hashtagMaxStringLength;

    /// @notice access controls smart contract
    HashtagAccessControls public accessControls;

    // @notice Function selector for ERC721Receiver.onERC721Received
    // 0x150b7a02
    //bytes4 constant internal ERC721_RECEIVED = bytes4(keccak256("onERC721Received(address,address,uint256,bytes)"));

    /// @notice Definition of a Hashtag which bundles associated metadata
    struct Hashtag {
        address originalPublisher;
        address creator;
        string displayVersion;
    }
    // Mapping of tokenId => owner
    //mapping(uint256 => address) internal owners;

    // Mapping of tokenId => approved address
    //mapping(uint256 => address) internal approvals;

    // Mapping of owner => number of tokens owned
    //mapping(address => uint256) internal balances;

    // Mapping of owner => operator => approved
    // mapping(address => mapping(address => bool)) internal operatorApprovals;

    /// @notice lookup of Hashtag info from token ID
    mapping(uint256 => Hashtag) public tokenIdToHashtag;

    /// @notice lookup of (lowercase) Hashtag string to token ID
    mapping(string => uint256) public hashtagToTokenId;

    /// @notice Last time a token was interacted with
    mapping(uint256 => uint256) public tokenIdToLastTransferTime;

    modifier onlyAdmin() {
        require(accessControls.isAdmin(_msgSender()), "Caller must be admin");
        _;
    }

    function initialize(HashtagAccessControls _accessControls, address payable _platform) public initializer {
        // Initialize access controls.
        accessControls = _accessControls;
        // Set platform address.
        platform = _platform;

        ownershipTermLength = 730 days;
        baseURI = "https://api.hashtag-protocol.io/";
        hashtagMinStringLength = 3;
        hashtagMaxStringLength = 32;

        __ERC721_init("Hashtag Protocol", "HASHTAG");
        _registerInterface(_INTERFACE_ID_ERC165);
        _registerInterface(_INTERFACE_ID_ERC721);
        _registerInterface(_INTERFACE_ID_ERC721_METADATA);
    }

    // Ensure that only address with admin role can upgrade.
    function _authorizeUpgrade(address) internal override onlyAdmin {}

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Upgradeable, ERC165StorageUpgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    /// Minting

    function mint(
        string calldata _hashtag,
        address payable _publisher,
        address _creator
    ) external payable returns (uint256 _tokenId) {
        require(accessControls.isPublisher(_publisher), "Mint: The publisher must be whitelisted");

        // Perform basic hashtag validation
        string memory lowerHashtagToMint = _assertHashtagIsValid(_hashtag);

        // generate the new hashtag token id
        tokenPointer = tokenPointer.add(1);
        uint256 tokenId = tokenPointer;

        // mint the token, transferring it to the platform.
        _safeMint(platform, tokenId);

        // Store HASHTAG data in state.
        tokenIdToHashtag[tokenId] = Hashtag({
            displayVersion: _hashtag,
            originalPublisher: _publisher,
            creator: _creator
        });

        // Store a reverse lookup.
        hashtagToTokenId[lowerHashtagToMint] = tokenId;

        emit MintHashtag(tokenId, _hashtag, _publisher, _creator);

        return tokenId;
    }

    /**
     * @notice Renews a hash tag by setting its last transfer time to be now
     * @dev Can only be called by token owner
     * @param _tokenId The identifier for an NFT
     */
    function renewHashtag(uint256 _tokenId) external {
        require(_msgSender() == ownerOf(_tokenId), "renewHashtag: Invalid sender");

        tokenIdToLastTransferTime[_tokenId] = block.timestamp;

        emit HashtagRenewed(_tokenId, _msgSender());
    }

    /**
     * @notice Recycling a hashtag i.e. transferring ownership back to the platform due to stale ownership
     * @dev Token must exist, be not already be owned by platform and time of TX must be greater than lastTransferTime
     * @param _tokenId The identifier for the hashtag being recycled
     */
    function recycleHashtag(uint256 _tokenId) external {
        require(_exists(_tokenId), "recycleHashtag: Invalid token ID");
        require(ownerOf(_tokenId) != platform, "recycleHashtag: Already owned by the platform");

        uint256 lastTransferTime = tokenIdToLastTransferTime[_tokenId];
        require(
            lastTransferTime.add(ownershipTermLength) < block.timestamp,
            "recycleHashtag: Token not eligible for recycling yet"
        );

        _transfer(ownerOf(_tokenId), platform, _tokenId);

        emit HashtagReset(_tokenId, _msgSender());
    }

    /// Public administration write functions

    /**
     * @notice Admin method for updating the base token URI of a hashtag
     * @param newBaseURI Base URI for all tokens
     */
    function setBaseURI(string calldata newBaseURI) public onlyAdmin {
        baseURI = newBaseURI;
        emit NewBaseURI(baseURI);
    }

    /**
     * @notice Admin method for updating the max string length of a hashtag
     * @param _hashtagMaxStringLength max length
     */
    function setHashtagMaxStringLength(uint256 _hashtagMaxStringLength) public onlyAdmin {
        hashtagMaxStringLength = _hashtagMaxStringLength;
        //emit HashtagMaxStringLengthUpdated(hashtagMaxStringLength, _hashtagMaxStringLength);
    }

    /**
     * @notice Admin method for updating the ownership length for all hashtag tokens i.e. a global param
     * @param _ownershipTermLength New length in unix epoch seconds
     */
    function setOwnershipTermLength(uint256 _ownershipTermLength) public onlyAdmin {
        emit OwnershipTermLengthUpdated(ownershipTermLength, _ownershipTermLength);
        ownershipTermLength = _ownershipTermLength;
    }

    /**
     * @notice Admin functionality for updating the address that receives the commission on behalf of the platform
     * @param _platform Address that receives minted NFTs
     */
    function setPlatform(address payable _platform) external onlyAdmin {
        platform = _platform;
    }

    /**
     * @notice Admin functionality for updating the access controls
     * @param _accessControls Address of the access controls contract
     */
    function updateAccessControls(HashtagAccessControls _accessControls) external onlyAdmin {
        require(address(_accessControls) != address(0), "HashtagProtocol.updateAccessControls: Cannot be zero");
        accessControls = _accessControls;
    }

    //function approve(address _approved, uint256 _tokenId) public virtual override {
    //  address owner = ownerOf(_tokenId);
    //  require(_msgSender() == owner || isApprovedForAll(owner, _msgSender()), "ERC721_INVALID_SENDER");
    //
    //  approvals[_tokenId] = _approved;
    //  emit Approval(owner, _approved, _tokenId);
    //}

    // function setApprovalForAll(address _operator, bool _approved) public virtual override {
    //   operatorApprovals[_msgSender()][_operator] = _approved;
    //   emit ApprovalForAll(_msgSender(), _operator, _approved);
    // }

    //function balanceOf(address owner) public view virtual override returns (uint256) {
    //  require(owner != address(0), "ERC721: balance query for the zero address");
    //  return balances[owner];
    //}

    /// Public read functions

    //function ownerOf(uint256 _tokenId) public view virtual override returns (address) {
    //  address owner = owners[_tokenId];
    //  if (owner == address(0) && tokenIdToHashtag[_tokenId].creator != address(0)) {
    //    return platform;
    //  }
    //
    //  require(owner != address(0), "ERC721: owner query for nonexistent token");
    //  return owner;
    //}

    // function getApproved(uint256 _tokenId) public view override returns (address) {
    //   require(_exists(_tokenId), "ERC721: approved query for nonexistent token");
    //   return approvals[_tokenId];
    // }

    // function isApprovedForAll(address _owner, address _operator) public view override returns (bool) {
    //   return operatorApprovals[_owner][_operator];
    // }

    /**
     * @notice Returns the commission addresses related to a token
     * @param _tokenId ID of a hashtag
     * @return _platform Platform commission address
     * @return _owner Address of the owner of the hashtag
     */
    function getPaymentAddresses(uint256 _tokenId)
        public
        view
        returns (address payable _platform, address payable _owner)
    {
        return (platform, payable(ownerOf(_tokenId)));
    }

    /**
     * @notice Returns creator of a token
     * @param _tokenId ID of a hashtag
     * @return _creator creator of the hashtag
     */
    function getCreatorAddress(uint256 _tokenId) public view returns (address _creator) {
        return tokenIdToHashtag[_tokenId].creator;
    }

    //**
    //* @notice Transfer ownership of an NFT -- THE CALLER IS RESPONSIBLE
    //*         TO CONFIRM THAT `_to` IS CAPABLE OF RECEIVING NFTS OR ELSE
    //*         THEY MAY BE PERMANENTLY LOST
    //* @dev Throws unless `msg.sender` is the current owner, an authorized
    //*      operator, or the approved address for this NFT. Throws if `_from` is
    //*      not the current owner. Throws if `_to` is the zero address. Throws if
    //*      `_tokenId` is not a valid NFT.
    //* @param _from The current owner of the NFT
    //* @param _to The new owner
    //* @param _tokenId The NFT to transfer
    //*/
    //function transferFrom(
    //  address _from,
    //  address _to,
    //  uint256 _tokenId
    //) public override {
    //  require(_to != address(0), "ERC721: transfer to the zero address");
    //  require(_to != platform, "ERC721_CANNOT_TRANSFER_TO_PLATFORM");
    //
    //  address owner = ownerOf(_tokenId);
    //  require(_from == owner, "ERC721: transfer of token that is not own");
    //
    //  address spender = _msgSender();
    //  address approvedAddress = getApproved(_tokenId);
    //
    //  if (owner == platform) {
    //    require(
    //      spender == owner ||
    //        accessControls.isSmartContract(spender) ||
    //        isApprovedForAll(owner, spender) ||
    //        approvedAddress == spender,
    //      "ERC721: transfer caller is not owner nor approved"
    //    );
    //  } else {
    //    require(
    //      spender == owner || isApprovedForAll(owner, spender) || approvedAddress == spender,
    //      "ERC721: transfer caller is not owner nor approved"
    //    );
    //  }
    //
    //  _transferFrom(_tokenId, approvedAddress, _to, _from);
    //}

    /// Internal

    function isContract(address account) internal view returns (bool) {
        // According to EIP-1052, 0x0 is the value returned for not-yet created accounts
        // and 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470 is returned
        // for accounts without code, i.e. `keccak256('')`
        bytes32 codehash;
        bytes32 accountHash = 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470;
        // solhint-disable-next-line no-inline-assembly
        assembly {
            codehash := extcodehash(account)
        }
        return (codehash != accountHash && codehash != 0x0);
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    //function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    //  require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
    //  return string(abi.encodePacked(baseURI, StringsUpgradeable.toString(tokenId)));
    //}

    /**
     * @notice Existence check on a HASHTAG token
     * @param tokenId token ID
     * @return true if exists
     */
    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }

    /**
     * @notice Private method used for validating a hashtag before minting
     * @dev A series of assertions are performed reverting the transaction for any validation violations
     * @param _hashtag Proposed hashtag string
     */
    function _assertHashtagIsValid(string memory _hashtag) private view returns (string memory) {
        bytes memory hashtagStringBytes = bytes(_hashtag);
        require(
            hashtagStringBytes.length >= hashtagMinStringLength && hashtagStringBytes.length <= hashtagMaxStringLength,
            "Invalid format: Hashtag must not exceed length requirements"
        );

        require(hashtagStringBytes[0] == 0x23, "Must start with #");

        string memory hashtagKey = _lower(_hashtag);
        require(hashtagToTokenId[hashtagKey] == 0, "Hashtag validation: Hashtag already owned.");

        uint256 alphabetCharCount = 0;
        // start from first char after #
        for (uint256 i = 1; i < hashtagStringBytes.length; i++) {
            bytes1 char = hashtagStringBytes[i];

            // Generally ensure that the character is alpha numeric
            bool isInvalidCharacter = !(char >= 0x30 && char <= 0x39) && //0-9
                !(char >= 0x41 && char <= 0x5A) && //A-Z
                !(char >= 0x61 && char <= 0x7A);
            //a-z

            require(
                !isInvalidCharacter,
                "Invalid character found: Hashtag may only contain characters A-Z, a-z, 0-9 and #"
            );

            // Should the char be alphabetic, increment alphabetCharCount
            if ((char >= 0x41 && char <= 0x5A) || (char >= 0x61 && char <= 0x7A)) {
                alphabetCharCount = alphabetCharCount.add(1);
            }
        }

        // Ensure alphabetCharCount is at least 1
        require(alphabetCharCount >= 1, "Invalid format: Hashtag must contain at least 1 alphabetic character.");

        return hashtagKey;
    }

    /**
     * @notice Converts a string to its lowercase equivalent
     * @param _base String to convert
     * @return string Lowercase version of string supplied
     */
    function _lower(string memory _base) private pure returns (string memory) {
        bytes memory bStr = bytes(_base);
        bytes memory bLower = new bytes(bStr.length);
        for (uint256 i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((bStr[i] >= 0x41) && (bStr[i] <= 0x5A)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    // /**
    //  * @notice Internal method for handling token transfer flow, has special case handling for platform transfers as
    //  *         to not change its balance which is always set to zero by design
    //  * @param _tokenId The identifier for an NFT
    //  * @param _approvedAddress The approval address, can set set to zero address
    //  * @param _to Who will be receiving the token after transfer
    //  * @param _from Who is transferring the token
    //  */
    // function _transferFrom(
    //   uint256 _tokenId,
    //   address _approvedAddress,
    //   address _to,
    //   address _from
    // ) private {
    //   if (_approvedAddress != address(0)) {
    //     approvals[_tokenId] = address(0);
    //   }
    //
    //   owners[_tokenId] = _to;
    //
    //   if (_from != platform) {
    //     balances[_from] = balances[_from].sub(1);
    //   }
    //
    //   // Ensure last transfer time is set to now
    //   tokenIdToLastTransferTime[_tokenId] = block.timestamp;
    //
    //   if (_to != platform) {
    //     balances[_to] = balances[_to].add(1);
    //   }
    //
    //   emit Transfer(_from, _to, _tokenId);
    // }

    function _baseURI() internal view override(ERC721Upgradeable) returns (string memory) {
        return baseURI;
    }
}
