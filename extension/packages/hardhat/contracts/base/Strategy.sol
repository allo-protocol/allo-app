// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IStrategy {}

contract Strategy is IStrategy {
    string public strategyName;
    event Initialize(string strategyName);

    constructor(string memory _name) {
        strategyName = _name;
        emit Initialize(strategyName);
    }

    receive() external payable {}
}
