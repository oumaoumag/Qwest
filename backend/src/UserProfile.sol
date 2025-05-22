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
}