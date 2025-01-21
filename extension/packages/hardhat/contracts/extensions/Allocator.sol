// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {Context} from "@openzeppelin/contracts/utils/Context.sol";

interface IAllocator {
    event Allocate(address indexed from, address indexed to, uint256 amount, address token, bytes data);

    function allocate(address[] calldata recipients, uint256[] calldata amounts, address token, bytes[] calldata data)
        external;

    function distribute(address[] calldata recipients, uint256[] calldata amounts, address token, bytes[] calldata data)
        external;
}

contract Allocator is IAllocator, Context {
    using SafeERC20 for IERC20;

    bytes32 private constant OP_ALLOCATE = keccak256("allocate");
    bytes32 private constant OP_DISTRIBUTE = keccak256("distribute");

    function allocate(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        public
        virtual
    {
        _handleBatch(recipients, amounts, token, data, OP_ALLOCATE);
    }

    function distribute(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        public
        virtual
    {
        _handleBatch(recipients, amounts, token, data, OP_DISTRIBUTE);
    }

    function _handleBatch(
        address[] memory recipients,
        uint256[] memory amounts,
        address token,
        bytes[] memory data,
        bytes32 operation
    ) private {
        uint256 length = recipients.length;
        require(length > 0 && length == amounts.length, "Mismatched lengths");

        for (uint256 i = 0; i < length; i++) {
            bytes memory _data = i < data.length ? data[i] : bytes("");

            if (operation == OP_ALLOCATE) {
                _allocate(recipients[i], amounts[i], token, _data);
            } else if (operation == OP_DISTRIBUTE) {
                _distribute(recipients[i], amounts[i], token, _data);
            } else {
                revert("Invalid operation");
            }
        }
    }

    // Allocate transfers tokens from sender to recipients
    function _allocate(address to, uint256 amount, address token, bytes memory data) internal virtual {
        IERC20(token).safeTransferFrom(_msgSender(), to, amount);
        emit Allocate(_msgSender(), to, amount, token, data);
    }

    // Distribute transfers tokens from the contract to recipients
    function _distribute(address to, uint256 amount, address token, bytes memory data) internal virtual {
        IERC20(token).safeTransfer(to, amount);
        emit Allocate(address(this), to, amount, token, data);
    }
}
