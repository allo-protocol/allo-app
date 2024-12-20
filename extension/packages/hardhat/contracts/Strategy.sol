// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

contract Strategy {
    bytes32 public id;
    string public name;

    constructor(string memory _name) {
        name = _name;
        id = keccak256(abi.encode(name));
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
