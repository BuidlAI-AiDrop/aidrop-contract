pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MBTI is ERC721, ERC721URIStorage, Ownable {
    uint256 private _currentTokenId = 0;//Token ID here will start from 1
    string private _baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory baseTokenURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
         _baseTokenURI = baseTokenURI;
    }

   /**
     * @dev Mints a token to an address with a tokenURI.
     * @param _to address of the future owner of the token
     * @param _tokenURI URI for the token metadata
     */
    function mintTo(address _to, string memory _tokenURI) public {
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);
        _incrementTokenId();
    }

    /**
     * @dev Mints a token to an address using the base URI.
     * @param _to address of the future owner of the token
     */
    function mintTo(address _to) public returns (uint256 tokenId) {
        tokenId = _getNextTokenId();
        _mint(_to, tokenId);
        _incrementTokenId();

    }

    /**
     * @dev Updates the base URI for token metadata
     * @param baseTokenURI new base URI
     */
    function setBaseURI(string memory baseTokenURI) public onlyOwner {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev See {IERC721Metadata-tokenURI}.
     */
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    /**
     * @dev calculates the next token ID based on value of _currentTokenId
     * @return uint256 for the next token ID
     */
    function _getNextTokenId() private view returns (uint256) {
        return _currentTokenId+1;
    }

    /**
     * @dev increments the value of _currentTokenId
     */
    function _incrementTokenId() private {
        _currentTokenId++;
    }

    /**
     * @dev Base URI for computing {tokenURI}.
     */
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
    return super.supportsInterface(interfaceId);
}
}