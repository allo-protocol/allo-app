//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";

import { Allocator } from "./extensions/Allocator.sol";
import { Registry } from "./extensions/Registry.sol";
import { Strategy } from "./base/Strategy.sol";

/**
 * A simple Strategy contract that allows ERC20 transfers to multiple recipients
 * @author AlloCapital
 */
contract SimpleGrants is Strategy, Allocator, Registry, Ownable {
    constructor(address owner) Strategy("SimpleGrants") Ownable(owner) {}

    function register(address project, string memory metadataURI, bytes memory data) public override {
        _register(project, metadataURI, data);
        _approve(project, "", ""); // Auto-approve projects
    }
}
