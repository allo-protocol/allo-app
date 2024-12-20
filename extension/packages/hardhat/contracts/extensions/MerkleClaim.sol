// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { SafeERC20 } from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IMerkleClaim {
    event MerkleSet(bytes32 root);
    event Claim(address recipient, uint256 amount, address token);

    function setMerkle(bytes32 _root) external;

    function claim(bytes32[] memory proof, address recipient, uint256 amount, address token) external;
}

abstract contract MerkleClaim is IMerkleClaim {
    using SafeERC20 for IERC20;
    bytes32 private root;

    function _setMerkle(bytes32 _root) internal virtual {
        root = _root;
        emit MerkleSet(root);
    }

    function claim(bytes32[] memory proof, address recipient, uint256 amount, address token) public virtual {
        if (_verify(proof, recipient, amount, token)) {
            IERC20(token).safeTransfer(recipient, amount);
            emit Claim(recipient, amount, token);
        }
    }

    function _verify(
        bytes32[] memory proof,
        address recipient,
        uint256 amount,
        address token
    ) internal view returns (bool) {
        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(token, recipient, amount))));
        require(MerkleProof.verify(proof, root, leaf), "Invalid proof");
        return true;
    }
}
