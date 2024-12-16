//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

// Useful for debugging. Remove when deploying to a live network.
import "hardhat/console.sol";

// Use openzeppelin to inherit battle-tested implementations (ERC20, ERC721, etc)

import "@openzeppelin/contracts/access/Ownable.sol";

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import { Strategy } from "./Strategy.sol";

/**
 * A simple Strategy contract that allows ERC20 transfers to multiple recipients
 * It also allows the owner to withdraw the Ether in the contract
 * @author AlloProtocol
 */
contract YourContract is Strategy, Ownable {
    using SafeERC20 for IERC20;

    event Allocate(address indexed from, address indexed recipient, uint256 amount, address token, bytes data);

    constructor(address owner) Strategy("MinimalStrategy") Ownable(owner) {}

    function allocate(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data
    ) external {
        uint256 length = recipients.length;
        require(length > 0 && length == amounts.length, "Mismatched lengths");
        for (uint256 i = 0; i < length; i++) {
            _allocate(recipients[i], amounts[i], token, data[i]);
        }
    }

    function _allocate(address recipient, uint256 amount, address token, bytes memory data) internal virtual {
        IERC20(token).safeTransferFrom(msg.sender, recipient, amount);
        emit Allocate(msg.sender, recipient, amount, token, data);
    }

    /**
     * Function that allows the contract to receive ETH
     */
    receive() external payable {}
}
