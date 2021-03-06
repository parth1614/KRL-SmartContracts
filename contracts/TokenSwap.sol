// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./KRL.sol";
import "./BlueMonsterCoin.sol";

contract TokenSwap {
    IERC20 public BMC;
    IERC20 public KRL;
    mapping(address=>uint256) public KRLbalance;
    mapping(address=>uint256) public BMCbalance;

    address payable admin;
    //ratioAX is the percentage of how much TokenA is worth of TokenX i.e. 40 KRL is equal to 1 BMC
    uint256 ratioAX = 40;
    bool AcheaperthenX;
    uint256 fees;

    constructor(address _KRL, address _BMC) {
        admin = payable(msg.sender);
        KRL = IERC20(_KRL);
        BMC = IERC20(_BMC);
        //due to openzeppelin implementation, transferFrom function implementation expects _msgSender() to be the beneficiary from the caller
        // but in this use cae we are using this contract to transfer so its always checking the allowance of SELF
        KRL.approve(address(this), BMC.totalSupply());
        BMC.approve(address(this), KRL.totalSupply());
    }

    modifier onlyAdmin() {
        payable(msg.sender) == admin;
        _;
    }

    function setFees(uint256 _Fees) public onlyAdmin {
        fees = _Fees;
    }

    function swapKRL(uint256 amountKRL) public returns (uint256) {
        //check if amount given is not 0
        // check if current contract has the necessary amout of Tokens to exchange
        require(amountKRL > 0, "amountTKA must be greater then zero");
        require(
            KRL.balanceOf(msg.sender) >= amountKRL,
            "sender doesn't have enough Tokens"
        );

        uint256 exchangeKRL = uint256(mul(amountKRL, ratioAX));
        uint256 exchangeAmount = exchangeKRL -
            uint256((mul(exchangeKRL, fees)) / 100);
        require(
            exchangeAmount > 0,
            "exchange Amount must be greater then zero"
        );

        require(
            BMC.balanceOf(address(this)) > exchangeAmount,
            "currently the exchange doesnt have enough BMC Tokens, please retry later :=("
        );

        KRL.transferFrom(msg.sender, address(this), amountKRL);
        BMC.approve(address(msg.sender), exchangeAmount);
        BMC.transferFrom(
            address(this),
            address(msg.sender),
            exchangeAmount
        );
        return exchangeAmount;
    }

    function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require(y == 0 || (z = x * y) / y == x, "ds-math-mul-overflow");
    }
}
