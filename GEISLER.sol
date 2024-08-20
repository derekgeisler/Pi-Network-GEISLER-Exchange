pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract PiSwap {
    using SafeMath for uint256;

    IERC20 public piToken;
    mapping(address => mapping(address => uint256)) public liquidity;
    mapping(address => uint256) public totalLiquidity;

    constructor(address _piToken) {
        piToken = IERC20(_piToken);
    }

    function addLiquidity(address token, uint256 amount) external {
        require(IERC20(token).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        liquidity[msg.sender][token] = liquidity[msg.sender][token].add(amount);
        totalLiquidity[token] = totalLiquidity[token].add(amount);
    }

    function removeLiquidity(address token, uint256 amount) external {
        require(liquidity[msg.sender][token] >= amount, "Insufficient liquidity");
        liquidity[msg.sender][token] = liquidity[msg.sender][token].sub(amount);
        totalLiquidity[token] = totalLiquidity[token].sub(amount);
        require(IERC20(token).transfer(msg.sender, amount), "Transfer failed");
    }

    function swap(address fromToken, address toToken, uint256 amount) external {
        require(totalLiquidity[fromToken] > 0 && totalLiquidity[toToken] > 0, "Insufficient liquidity");
        uint256 exchangeRate = totalLiquidity[toToken].div(totalLiquidity[fromToken]);
        uint256 receivedAmount = amount.mul(exchangeRate);
        
        require(IERC20(fromToken).transferFrom(msg.sender, address(this), amount), "Transfer failed");
        require(IERC20(toToken).transfer(msg.sender, receivedAmount), "Transfer failed");
    }
}
