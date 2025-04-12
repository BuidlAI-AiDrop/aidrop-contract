pragma solidity ^0.8.26;

import {IIPAssetRegistry} from "@story-protocol/protocol-core/contracts/interfaces/registries/IIPAssetRegistry.sol";
import {ILicenseRegistry} from "@story-protocol/protocol-core/contracts/interfaces/registries/ILicenseRegistry.sol";
import {MBTI} from "./MBTI.sol";
import { ILicensingModule } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/ILicensingModule.sol";
import { IPILicenseTemplate } from "@story-protocol/protocol-core/contracts/interfaces/modules/licensing/IPILicenseTemplate.sol";
import { PILFlavors } from "@story-protocol/protocol-core/contracts/lib/PILFlavors.sol";


import { ERC721Holder } from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract IpCreator is ERC721Holder{
    IIPAssetRegistry public immutable IP_ASSET_REGISTRY;
    ILicensingModule public immutable LICENSING_MODULE;
    IPILicenseTemplate public immutable PIL_TEMPLATE;

    MBTI public immutable MBTI_NFT;
    address public immutable ROYALTY_POLICY_LAP;
    address public immutable WIP;

    constructor(address _ipAssetRegistry, address _licensingModule, address _pilTemplate, address _royaltyPolicyLAP, address _wip, address _mbtiNft) {
        IP_ASSET_REGISTRY = IIPAssetRegistry(_ipAssetRegistry);
        LICENSING_MODULE = ILicensingModule(_licensingModule);
        PIL_TEMPLATE = IPILicenseTemplate(_pilTemplate);
        ROYALTY_POLICY_LAP = _royaltyPolicyLAP;
        WIP = _wip;
        MBTI_NFT = MBTI(_mbtiNft);
    }

    function mintAndCreateIp(address receiver, string memory tokenURI) external returns (uint256 tokenId, address ipId, uint256 licenseTermsId) {
        // 1. Mint NFT to this contract
        tokenId = MBTI_NFT.mintTo(address(this), tokenURI);
         // 2. Register IP with Story Protocol
        ipId = IP_ASSET_REGISTRY.register(block.chainid, address(MBTI_NFT), tokenId);

        // 3. register license terms and we can attach them later
        licenseTermsId = PIL_TEMPLATE.registerLicenseTerms(
            PILFlavors.commercialRemix({
                mintingFee:0,
                commercialRevShare:10*10**6,

                royaltyPolicy:ROYALTY_POLICY_LAP,
                currencyToken:WIP
            })
        );

        // 4. attach the license terms to the IP Asset
        LICENSING_MODULE.attachLicenseTerms(
            ipId,
            address(PIL_TEMPLATE),
            licenseTermsId
        );

        // 5. transfer NFT to receiver
        MBTI_NFT.transferFrom(address(this), receiver, tokenId);
    }

    function mintLicenseTokenAndRegisterDerivative(
        address parentIpId,
        uint256 licenseTermsId,
        address receiver
    ) external returns (uint256 childTokenId, address childIpId) {
        // We mint to this contract so that it has permissions
        // to register itself as a derivative of another
        // IP Asset.
        // We will later transfer it to the intended `receiver`
        childTokenId =  MBTI_NFT.mintTo(address(this), "");
        childIpId = IP_ASSET_REGISTRY.register(block.chainid, address(MBTI_NFT), childTokenId);

        // mint a license token from the parent
        uint256 licenseTokenId = LICENSING_MODULE.mintLicenseTokens({
            licensorIpId: parentIpId,
            licenseTemplate: address(PIL_TEMPLATE),
            licenseTermsId: licenseTermsId,
            amount: 1,
            // mint the license token to this contract so it can
            // use it to register as a derivative of the parent
            receiver: address(this),
            royaltyContext: "", // for PIL, royaltyContext is empty string
            maxMintingFee: 0,
            maxRevenueShare: 0
        });

        uint256[] memory licenseTokenIds = new uint256[](1);
        licenseTokenIds[0] = licenseTokenId;

        // register the new child IPA as a derivative
        // of the parent
        LICENSING_MODULE.registerDerivativeWithLicenseTokens({
            childIpId: childIpId,
            licenseTokenIds: licenseTokenIds,
            royaltyContext: "", // empty for PIL
            maxRts: 0
        });

        // transfer the NFT to the receiver so it owns the child IPA
         MBTI_NFT.transferFrom(address(this), receiver, childTokenId);
    }
}