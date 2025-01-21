// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface ITokenBalance {
    function balanceOf(address account) external returns (uint256);
}

contract TokenGate {
    modifier onlyToken(address token, address account, uint256 amount) {
        require(ITokenBalance(token).balanceOf(account) >= amount, "Insufficient balance");
        _;
    }
}
