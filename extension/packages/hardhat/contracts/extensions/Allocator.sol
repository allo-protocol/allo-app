// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { Context } from "@openzeppelin/contracts/utils/Context.sol";

interface IAllocator {
    event Allocate(address indexed from, address indexed recipient, uint256 amount, address token, bytes data);

    event Withdraw(address indexed from, address indexed recipient, uint256 amount, address token, bytes data);

    function allocate(
        address[] calldata recipients,
        uint256[] calldata amounts,
        address token,
        bytes[] calldata data
    ) external;

    function withdraw(
        address[] calldata recipients,
        uint256[] calldata amounts,
        address token,
        bytes[] calldata data
    ) external;
}

contract Allocator is IAllocator, Context {
    using SafeERC20 for IERC20;

    function allocate(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data
    ) public virtual {
        _handleBatch(recipients, amounts, token, data, true);
    }

    function withdraw(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data
    ) public virtual {
        _handleBatch(recipients, amounts, token, data, false);
    }

    function _handleBatch(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data,
        bool isAllocating
    ) private {
        uint256 length = recipients.length;
        require(length > 0 && length == amounts.length, "Mismatched lengths");

        for (uint256 i = 0; i < length; i++) {
            bytes memory _data = i < data.length ? data[i] : bytes("");
            if (isAllocating) {
                _allocate(recipients[i], amounts[i], token, _data);
            } else {
                _withdraw(recipients[i], amounts[i], token, _data);
            }
        }
    }

    function _allocate(address recipient, uint256 amount, address token, bytes memory data) internal virtual {
        IERC20(token).safeTransferFrom(_msgSender(), recipient, amount);
        emit Allocate(_msgSender(), recipient, amount, token, data);
    }

    function _withdraw(address recipient, uint256 amount, address token, bytes memory data) internal virtual {
        IERC20(token).safeTransfer(recipient, amount);
        emit Withdraw(_msgSender(), recipient, amount, token, data);
    }
}
