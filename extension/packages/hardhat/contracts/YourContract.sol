//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { Allocator } from "./extensions/Allocator.sol";
import { Registry } from "./extensions/Registry.sol";
import { Strategy } from "./Strategy.sol";

/**
 * A simple Strategy contract that allows ERC20 transfers to multiple recipients
 * @author AlloCapital
 */
contract YourContract is Strategy, Allocator, Registry, Ownable {
    using SafeERC20 for IERC20;

    constructor(address owner) Strategy("MinimalStrategy") Ownable(owner) {}
}
