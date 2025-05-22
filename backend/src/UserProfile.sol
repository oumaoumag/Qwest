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

    function registered(string memory _encryptedName) extenal {
        require(bytes(users[msg.sender].encryptedName).length == 0, "User already registered");
        users[msg.sender] = User(_encryptedName, 0, new string[](0));
        emit UserRegistered(msg.sender, _encryptedName);
    }

    function updatePoints(address _user, uint256 _points) external {
        users[_user].points += _points;
    }

    function addBadge(address _user, uint256 _points) external {
        users[_user].badges.push(_badge);
    }
}