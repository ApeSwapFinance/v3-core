// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.12;

import {IERC20Minimal} from '../interfaces/IERC20Minimal.sol';

import {IApeSwapV3SwapCallback} from '../interfaces/callback/IApeSwapV3SwapCallback.sol';
import {IApeSwapV3Pool} from '../interfaces/IApeSwapV3Pool.sol';

contract ApeSwapV3PoolSwapTest is IApeSwapV3SwapCallback {
    int256 private _amount0Delta;
    int256 private _amount1Delta;

    function getSwapResult(
        address pool,
        bool zeroForOne,
        int256 amountSpecified,
        uint160 sqrtPriceLimitX96
    )
        external
        returns (
            int256 amount0Delta,
            int256 amount1Delta,
            uint160 nextSqrtRatio
        )
    {
        (amount0Delta, amount1Delta) = IApeSwapV3Pool(pool).swap(
            address(0),
            zeroForOne,
            amountSpecified,
            sqrtPriceLimitX96,
            abi.encode(msg.sender)
        );

        (nextSqrtRatio, , , , , , ) = IApeSwapV3Pool(pool).slot0();
    }

    function ApeSwapV3SwapCallback(
        int256 amount0Delta,
        int256 amount1Delta,
        bytes calldata data
    ) external override {
        address sender = abi.decode(data, (address));

        if (amount0Delta > 0) {
            IERC20Minimal(IApeSwapV3Pool(msg.sender).token0()).transferFrom(sender, msg.sender, uint256(amount0Delta));
        } else if (amount1Delta > 0) {
            IERC20Minimal(IApeSwapV3Pool(msg.sender).token1()).transferFrom(sender, msg.sender, uint256(amount1Delta));
        }
    }
}
