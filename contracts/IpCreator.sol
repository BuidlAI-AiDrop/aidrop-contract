pragma solidity ^0.8.26;

import {IIPAssetRegistry} from "@story-protocol/protocol-core/contracts/interfaces/registries/IIPAssetRegistry.sol";
import {MBTI} from "./MBTI.sol";

import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract IpCreator is ERC721Holder{
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    MBTI public immutable MBTI_NFT;

    constructor(address _ipAssetRegistry, address _mbtiNft) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
        MBTI_NFT = MBTI(_mbtiNft);
    }

    function mintAndCreateIp(address receiver) external returns (uint256 tokenId, address ipId) {
        tokenId = MBTI_NFT.mintTo(address(this));
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(MBTI_NFT), tokenId);

        MBTI_NFT.transferFrom(address(this), receiver, tokenId);
    }
    
    
}