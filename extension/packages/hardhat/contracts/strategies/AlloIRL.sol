//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {Allocator} from "../extensions/Allocator.sol";
import {Registry, IRegistry} from "../extensions/Registry.sol";
import {MerkleClaim} from "../extensions/MerkleClaim.sol";
import {Strategy} from "../base/Strategy.sol";

/**
 * A simple Strategy contract for quadratic voting on projects and distribution
 * @author AlloCapital
 */
contract AlloIRL is Strategy, Allocator, Registry, Ownable {
    using SafeERC20 for IERC20;

    address public immutable voteToken;
    address public immutable matchingToken;

    constructor(address owner, address _voteToken, address _matchingToken) Strategy("AlloIRL") Ownable(owner) {
        voteToken = _voteToken;
        matchingToken = _matchingToken;
    }

    function distribute(address[] memory recipients, uint256[] memory amounts, address token, bytes[] memory data)
        public
        override
    {
        require(token == matchingToken, "Must be matching token");
        super.distribute(recipients, amounts, token, data);
    }

    // Only owners can approve projects
    function approve(address project, uint256 id, string memory metadataURI, bytes memory data)
        public
        override
        onlyOwner
    {
        super.approve(project, id, metadataURI, data);
    }

    // We can use the same allocate function if we check that the token is either Voting or Matching
    // If the recipient is the contract address it's funding the matching pool, otherwise it's to a project
    function _allocate(address recipient, uint256 amount, address token, bytes memory) internal override {
        require(token == voteToken || token == matchingToken, "Must be vote token or matching token");
        require(
            recipient == address(this) || projects[recipient][0].status == IRegistry.Status.approved,
            "Project must be approved"
        );
        super._allocate(recipient, amount, token, "");
    }
}

/**
 * A simple vote token contract where anyone can claim 10 votes once
 * @author AlloCapital
 */
contract VoteToken is ERC20 {
    constructor() ERC20("VoteToken", "Vote") {}

    mapping(address => bool) private claimed;

    function mint() public {
        require(!claimed[msg.sender], "Already claimed votes");
        claimed[msg.sender] = true;
        _mint(msg.sender, 10);
    }

    // 1 token = 1 vote - no need for decimals
    function decimals() public pure override returns (uint8) {
        return 0;
    }
}
