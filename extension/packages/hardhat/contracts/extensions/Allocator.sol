// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

interface IAllocator {
    event Allocate(address indexed from, address indexed recipient, uint256 amount, address token, bytes data);

    function allocate(
        address[] calldata recipients,
        uint256[] calldata amounts,
        address token,
        bytes[] calldata data
    ) external;
}

abstract contract Allocator is IAllocator, Context {
    using SafeERC20 for IERC20;

    function allocate(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data
    ) public virtual {
        uint256 length = recipients.length;
        require(length > 0 && length == amounts.length, "Mismatched lengths");
        for (uint256 i = 0; i < length; i++) {
            bytes memory _data = i < data.length ? data[i] : bytes("");

            _allocate(recipients[i], amounts[i], token, _data);
            emit Allocate(_msgSender(), recipients[i], amounts[i], token, data[i]);
        }
    }

    function _allocate(address recipient, uint256 amount, address token, bytes memory) internal virtual {
        IERC20(token).safeTransferFrom(_msgSender(), recipient, amount);
    }
}
