# Vince Charity Donation DApp

This project demonstrates a decentralized application (DApp) for charity donations using Ethereum blockchain technology. It includes a Solidity smart contract for managing donations and a React-based frontend for interacting with the contract.

## Description

The project consists of two main components:

### Smart Contract (VinceCharityDonation.sol)

The Solidity smart contract `VinceCharityDonation.sol` manages the following functionalities:

- **defineGoal**: Allows the contract owner to set a fundraising goal.
- **contribute**: Enables users to contribute Ether to the charity campaign.
- **extractFunds**: Allows the contract owner to withdraw collected funds after the campaign ends.

### Frontend (index.js)

The frontend is a React application (`index.js`) that interacts with the smart contract through Web3.js. It provides the following features:

- **Connect to MetaMask**: Allows users to connect their MetaMask wallet.
- **View Account Information**: Displays the user's Ethereum account and total contributions.
- **Contribute**: Enables users to contribute to the charity campaign.
- **Extract Funds**: Allows the contract owner to withdraw funds collected.

## Getting Started

### Installing

To get started with this project, you will need to have a Solidity development environment set up. We recommend using Remix, an online Solidity IDE. Follow these steps to install and prepare your environment:

1. **Go to Remix:** Visit the Remix IDE at [Remix](https://remix.ethereum.org/).
2. **Create a new file:** Click on the "+" icon in the left-hand sidebar to create a new file. Save the file with a `.sol` extension (e.g., `VinceCrowdfunding.sol`).
3. **Copy and paste the template code:** If a template code is provided, Copy the code provided and paste it into your new file.

### Executing program

To run this program, use Remix as follows:

1. **Copy the following code into your file:**

```javascript

pragma solidity 0.8.26;

contract VinceCrowdfunding{
    address public projectBeneficiary;
    uint256 public totalRaised;
    uint256 public goalAmount;
    uint256 public campaignDeadline;
    bool public campaignOpen;
    mapping(address => uint256) public pledges;

    event PledgeReceived(address contributor, uint256 amount);
    event CampaignFinalized(address beneficiary, uint256 totalAmountRaised);

    constructor(address _projectBeneficiary, uint256 _goalAmount, uint256 _campaignDurationInMinutes){
        require(_projectBeneficiary != address(0), "Beneficiary address cannot be zero.");
        require(_goalAmount > 0, "Funding goal must be greater than zero.");
        require(_campaignDurationInMinutes > 0, "Duration must be greater than zero.");

        projectBeneficiary = _projectBeneficiary;
        goalAmount = _goalAmount;
        campaignDeadline = block.timestamp + (_campaignDurationInMinutes * 1 minutes);
        campaignOpen = true;
    }

    function pledge() external payable {
        require(campaignOpen, "Campaign is closed.");
        require(block.timestamp <= campaignDeadline, "Campaign deadline has passed.");
        require(msg.value >= 0, "Pledge must be greater than zero.");

        pledges[msg.sender] += msg.value;
        totalRaised += msg.value;

        emit PledgeReceived(msg.sender, msg.value);
    }

    function checkGoalMet() public view returns (bool) {
        return totalRaised >= goalAmount;
    }

     function finalizeCampaign() external {
        require(block.timestamp >= campaignDeadline, "Campaign is still running.");
        require(campaignOpen, "Campaign has already ended.");

        campaignOpen = false;

        if (totalRaised >= goalAmount) {
            bool success = false;
            (success, ) = projectBeneficiary.call{value: totalRaised}("");
            assert(success); // assert transfer was successful
            emit CampaignFinalized(projectBeneficiary, totalRaised);
        } else {
            revert("Funding goal not reached, pledges can be withdrawn by contributors.");
        }
    }

    function withdrawPledge() external {
        require(!campaignOpen, "Campaign is still open.");
        require(totalRaised < goalAmount, "Funding goal was reached, cannot withdraw.");

        uint256 pledgedAmount = pledges[msg.sender];
        require(pledgedAmount > 0, "No pledges to withdraw.");

        pledges[msg.sender] = 0;
        bool success = false;
        (success, ) = payable(msg.sender).call{value: pledgedAmount}("");
        require(success, "Withdrawal failed.");
    }

}

```

2. **Compile the code:** Click on the "Solidity Compiler" tab in the left-hand sidebar. Ensure the "Compiler" option is set to "0.8.26" (or another compatible version), and then click on the "Compile VinceCrowdfunding.sol" button.

3. **Deploy the contract:** Click on the "Deploy & Run Transactions" tab in the left-hand sidebar. Select the "VinceCrowdfunding" contract from the dropdown menu, and then click on the "Deploy" button. Provide the necessary constructor parameters (_projectBeneficiary, _goalAmount, _campaignDurationInMinutes).

4. **Interact with the contract:** Once deployed, interact with the contract by:
- Pledge: Use the pledge function to contribute funds to the campaign. You need to send Ether with the transaction to make a pledge. The code is set for testing purposes only.
- Finalize Campaign: After the campaign deadline, use the finalizeCampaign function to finalize the campaign and handle the raised funds appropriately.
- Withdraw Pledge: If the campaign did not meet its goal, contributors can use the withdrawPledge function to get their money back.
- Check Campaign Deadline: Use the campaignDeadline function to get the timestamp of when the campaign ends.
- Check Goal Met: Use the checkGoalMet function to see if the campaign's funding goal has been reached.
- Check When Campaign Opens: Use the campaignOpen to check if the campaign is open or not.
- Check Goal Amount: Used to track the overall goal amount.
- Check Pledges: Used to track individual contributions.
- Project Beneficiary: Represents the beneficiary of the campaign funds.
- Total Raised: Tracks the cumulative amount of contributions to the campaign.

## Authors

VincyDaniel 
[VincyDaniel](https://www.linkedin.com/in/vince-daniel-del-rosario-815a11205/)

## License

This project is licensed under the VincyDaniel License - see the LICENSE.md file for details
