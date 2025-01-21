// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

interface IRegistry {
    enum Status {
        pending,
        approved
    }

    struct Registration {
        Status status;
        bytes data; // Data can contain information that can be accessed later
    }

    event Register(address indexed project, uint256 indexed index, string metadataURI, bytes data);
    event Approve(address indexed project, uint256 indexed index, string metadataURI, bytes data);

    function register(address project, string memory metadataURI, bytes memory data) external;
}

contract Registry is IRegistry {
    mapping(address => mapping(uint256 => Registration)) public projects;
    mapping(address => uint256) private indexes;

    // MetadataURI can contain details about project / application / campaign
    function register(address project, string memory metadataURI, bytes memory data) public virtual {
        _register(project, metadataURI, data);
    }

    // MetadataURI can contain review details
    function approve(address project, uint256 index, string memory metadataURI, bytes memory data) public virtual {
        _approve(project, index, metadataURI, data);
    }

    // Register project / application / campaign
    function _register(address project, string memory metadataURI, bytes memory data) internal virtual {
        uint256 index = indexes[project]++;
        require(projects[project][index].status == Status.pending, "Project already registered");

        // When index is 0 we interpret it as the project registration.
        // This way we have a simple and flexible way to handle
        // project registration, applications, creation of campaigns etc.
        projects[project][index] = Registration(Status.pending, data);
        emit Register(project, index, metadataURI, data);
    }

    // MetadataURI can contain Review information
    function _approve(address project, uint256 index, string memory metadataURI, bytes memory data) internal virtual {
        require(projects[project][index].status == Status.pending, "Project already approved or not registered yet");
        projects[project][index] = Registration(Status.approved, data);
        emit Approve(project, index, metadataURI, data);
    }
}
