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
    function registered(string memory _encryptedName) external {
        require(bytes(users[msg.sender].encryptedName).length == 0, "User already registered");
        users[msg.sender] = User(_encryptedName, 0, new string[](0));
        emit UserRegistered(msg.sender, _encryptedName);
    }

    // Modifies user points
    function updatePoints(address _user, uint256 _points) external {
        users[_user].points += _points;
    }

    // Badge Management - 
    function addBadge(address _user, string memory _badge) external {
        users[_user].badges.push(_badge);
    }
}

contract TaskManager {
    UserProfile public userProfile;

    struct Task {
        uint256 taskId;
        address owner;
        bool completed;
        string dataHash; //  Hash of offchain data for intedrity
        string cid;      //  IPFS CID for offchain data
    }  

    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;

    event TaskCreated(uint256 indexed taskId, address indexed owner, string cid);
    event TaskCompleted(uint256 indexed taskId, address indexed owner);

    constructor(address _userProfileAddress) {
        userProfile = UserProfile(_userProfileAddress);
    }

    function createTask(string memory _dataHash, string memory _cid) external {
        taskCount++;
        tasks[taskCount] = Task(taskCount, msg.sender, false, _dataHash, _cid);
        emit TaskCreated(taskCount, msg.sender, _cid);
    }

    function completeTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        reguire(task.owner == msg.sender, "Not task owner");
        require(!task.completed, "Task already completed");
        task.completed = true;
        userProfile.updatePoints(msg.sender, 10); // Award 10 points
        emit TaskCompleted(_taskId, msg.sender);
    }    
}