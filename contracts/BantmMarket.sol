// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
}

/// @title bantM — World Cup banter markets
/// @notice Pick your team. Stake. Beef on-chain.
///         Generic prediction-market contract managing many markets.
///         Owner creates markets and settles them; users set their tribe, stake, and claim.
contract BantmMarket {
    address public owner;
    IERC20 public immutable stakingToken;
    string[] public teams;

    struct Market {
        string question;
        string[] options;
        uint256 deadline;
        bool settled;
        uint256 winningOption;
        uint256 totalPool;
        mapping(uint256 => uint256) optionTotals;
        mapping(address => mapping(uint256 => uint256)) stakes;
        mapping(address => bool) claimed;
    }

    struct UserProfile {
        uint256 tribe;
        bool tribeSet;
        uint256 totalStaked;
        uint256 totalWon;
    }

    Market[] private markets;
    mapping(address => UserProfile) public profiles;

    event MarketCreated(uint256 indexed marketId, string question, uint256 deadline);
    event Staked(uint256 indexed marketId, address indexed user, uint256 optionIdx, uint256 amount);
    event MarketSettled(uint256 indexed marketId, uint256 winningOption);
    event Claimed(uint256 indexed marketId, address indexed user, uint256 payout);
    event TribeSet(address indexed user, uint256 teamId);

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    constructor(address _stakingToken, string[] memory _teams) {
        owner = msg.sender;
        stakingToken = IERC20(_stakingToken);
        teams = _teams;
    }

    // ---------- user actions ----------

    /// @notice Lock in your fan tribe. One-time.
    function setTribe(uint256 teamId) external {
        require(!profiles[msg.sender].tribeSet, "tribe already set");
        require(teamId < teams.length, "invalid team");
        profiles[msg.sender].tribe = teamId;
        profiles[msg.sender].tribeSet = true;
        emit TribeSet(msg.sender, teamId);
    }

    /// @notice Stake dUSDT on an option in a market. Requires prior approve().
    function stake(uint256 marketId, uint256 optionIdx, uint256 amount) external {
        Market storage m = markets[marketId];
        require(block.timestamp < m.deadline, "staking closed");
        require(!m.settled, "settled");
        require(optionIdx < m.options.length, "invalid option");
        require(amount > 0, "zero amount");

        require(stakingToken.transferFrom(msg.sender, address(this), amount), "transfer failed");

        m.stakes[msg.sender][optionIdx] += amount;
        m.optionTotals[optionIdx] += amount;
        m.totalPool += amount;
        profiles[msg.sender].totalStaked += amount;

        emit Staked(marketId, msg.sender, optionIdx, amount);
    }

    /// @notice After settlement, winning stakers claim their share of the pot.
    function claim(uint256 marketId) external {
        Market storage m = markets[marketId];
        require(m.settled, "not settled");
        require(!m.claimed[msg.sender], "already claimed");

        uint256 userStakeOnWinner = m.stakes[msg.sender][m.winningOption];
        require(userStakeOnWinner > 0, "no winning stake");

        uint256 payout = (userStakeOnWinner * m.totalPool) / m.optionTotals[m.winningOption];
        m.claimed[msg.sender] = true;
        profiles[msg.sender].totalWon += payout;

        require(stakingToken.transfer(msg.sender, payout), "transfer failed");
        emit Claimed(marketId, msg.sender, payout);
    }

    // ---------- owner actions ----------

    function createMarket(
        string calldata question,
        string[] calldata options,
        uint256 deadline
    ) external onlyOwner returns (uint256) {
        require(options.length >= 2, "need >=2 options");
        require(deadline > block.timestamp, "deadline in past");
        uint256 marketId = markets.length;
        markets.push();
        Market storage m = markets[marketId];
        m.question = question;
        for (uint256 i = 0; i < options.length; i++) {
            m.options.push(options[i]);
        }
        m.deadline = deadline;
        emit MarketCreated(marketId, question, deadline);
        return marketId;
    }

    function settleMarket(uint256 marketId, uint256 winningOption) external onlyOwner {
        Market storage m = markets[marketId];
        require(!m.settled, "settled");
        require(winningOption < m.options.length, "invalid option");
        m.settled = true;
        m.winningOption = winningOption;
        emit MarketSettled(marketId, winningOption);
    }

    // ---------- views ----------

    function marketCount() external view returns (uint256) {
        return markets.length;
    }

    function teamCount() external view returns (uint256) {
        return teams.length;
    }

    function getTeams() external view returns (string[] memory) {
        return teams;
    }

    function getMarket(uint256 marketId)
        external
        view
        returns (
            string memory question,
            string[] memory options,
            uint256 deadline,
            bool settled,
            uint256 winningOption,
            uint256 totalPool
        )
    {
        Market storage m = markets[marketId];
        return (m.question, m.options, m.deadline, m.settled, m.winningOption, m.totalPool);
    }

    function getOptionTotals(uint256 marketId) external view returns (uint256[] memory) {
        Market storage m = markets[marketId];
        uint256[] memory totals = new uint256[](m.options.length);
        for (uint256 i = 0; i < m.options.length; i++) {
            totals[i] = m.optionTotals[i];
        }
        return totals;
    }

    function getUserStake(uint256 marketId, address user, uint256 optionIdx)
        external
        view
        returns (uint256)
    {
        return markets[marketId].stakes[user][optionIdx];
    }

    function hasClaimed(uint256 marketId, address user) external view returns (bool) {
        return markets[marketId].claimed[user];
    }
}
