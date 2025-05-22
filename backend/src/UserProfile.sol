//  SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract UserProfile {
    struct User {
        string encryptedName;  // Encrypted with user's wallet-derived key
        uint256 points;
        string[] badges;
    }

    mapping(address => User) public users;

    event UserRegistered(address indexed user, string encryptedName);

    // User Registration
    function registered(string memory _encryptedName) extenal {
        require(bytes(users[msg.sender].encryptedName).length == 0, "User already registered");
        users[msg.sender] = User(_encryptedName, 0, new string[](0));
        emit UserRegistered(msg.sender, _encryptedName);
    }

    // Modifies user points
    function updatePoints(address _user, uint256 _points) external {
        users[_user].points += _points;
    }

    // Badge Management - 
    function addBadge(address _user, uint256 _points) external {
        users[_user].badges.push(_badge);
    }
}

contract TaskManager {
    UserProfile public userProfile;

    sruct Task {
        uint256 taskId;
        address owner;
        bool completed;
        string dataHash; //  Hash of offchain data for intedrity
        string cid;      //  IPFS CID for offchain data
    }  

    
}