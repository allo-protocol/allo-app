// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IRegistry {
    event Register(address indexed project, string metadataURI, bytes data);
    event Approve(address indexed project, string metadataURI, bytes data);

    function register(address project, string memory metadataURI, bytes memory data) external;
}

abstract contract Registry is IRegistry {
    mapping(address => uint8) private projects;

    function register(address project, string memory metadataURI, bytes memory data) public virtual {
        _register(project, metadataURI, data);
        emit Register(project, metadataURI, data);
    }

    function _register(address project, string memory, bytes memory) internal virtual {
        require(projects[project] == 0, "Project already registered");
        projects[project] = 1;
    }

    // MetadataURI can contain application details
    function approve(address project, string memory metadataURI, bytes memory data) public virtual {
        require(projects[project] == 1, "Project already approved or not registered yet");
        _approve(project, metadataURI, data);
        emit Approve(project, metadataURI, data);
    }

    // MetadataURI can contain Review information
    function _approve(address project, string memory metadataURI, bytes memory data) internal virtual {
        projects[project] = 2;
    }
}
