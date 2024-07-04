// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract VinceCharityDonation {
    address payable public contractOwner;
    uint256 public totalContribution;
    uint256 public contributionGoal;

    event ContributionReceived(address indexed contributor, uint256 amount);
    event FundsExtracted(uint256 amount);
    event GoalDefined(uint256 goalAmount);

    constructor() {
        contractOwner = payable(msg.sender);
    }

    function defineGoal(uint256 _goalAmount) external {
        require(msg.sender == contractOwner, "Only the owner can set the goal.");
        require(_goalAmount > 0, "Goal amount must be greater than zero.");

        contributionGoal = _goalAmount;

        emit GoalDefined(_goalAmount);
    }

    function contribute() external payable {
        require(msg.value > 0, "Contribution must be greater than zero.");

        totalContribution += msg.value;

        emit ContributionReceived(msg.sender, msg.value);
    }

    function extractFunds() external {
        require(msg.sender == contractOwner, "Only the owner can withdraw funds.");
        require(totalContribution > 0, "No funds available for withdrawal.");

        uint256 amount = totalContribution;
        totalContribution = 0;

        (bool success, ) = contractOwner.call{value: amount}("");
        require(success, "Withdrawal failed.");

        emit FundsExtracted(amount);
    }
}
