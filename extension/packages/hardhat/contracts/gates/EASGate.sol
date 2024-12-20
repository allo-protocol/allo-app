// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IEASIndexer {
    function getSchemaAttesterRecipientAttestationUIDCount(
        bytes32 schemaUID,
        address attester,
        address account
    ) external returns (uint256);
}

contract EASGate {
    bytes32 public schemaUID;
    address public attester;
    IEASIndexer public easIndexerAddress;

    constructor(address _easIndexerAddress) {
        easIndexerAddress = IEASIndexer(_easIndexerAddress);
    }

    modifier onlyEAS(
        address account,
        bytes32 _schemaUID,
        address _attester
    ) {
        require(
            // TODO: This will likely return revoked attestations also.
            // If so we need to check easRegistry.getAttestation(id).revoked == false
            easIndexerAddress.getSchemaAttesterRecipientAttestationUIDCount(schemaUID, attester, account) > 0,
            "EAS Attestation not found for account"
        );
        _;
    }
}
