// SPDX-License-Identifier: UNLICENSED
pragma solidity =0.8.12;

import {TickMath} from '../libraries/TickMath.sol';

import {IApeSwapV3SwapCallback} from '../interfaces/callback/IApeSwapV3SwapCallback.sol';

import {IApeSwapV3Pool} from '../interfaces/IApeSwapV3Pool.sol';

contract TestApeSwapV3ReentrantCallee is IApeSwapV3SwapCallback {
    string private constant expectedError = 'LOK()';

    function swapToReenter(address pool) external {
        IApeSwapV3Pool(pool).swap(address(0), false, 1, TickMath.MAX_SQRT_RATIO - 1, new bytes(0));
    }

    function ApeSwapV3SwapCallback(
        int256,
        int256,
        bytes calldata
    ) external override {
        // try to reenter swap
        try IApeSwapV3Pool(msg.sender).swap(address(0), false, 1, 0, new bytes(0)) {} catch (bytes memory error) {
            require(keccak256(error) == keccak256(abi.encodeWithSignature(expectedError)));
        }

        // try to reenter mint
        try IApeSwapV3Pool(msg.sender).mint(address(0), 0, 0, 0, new bytes(0)) {} catch (bytes memory error) {
            require(keccak256(error) == keccak256(abi.encodeWithSignature(expectedError)));
        }

        // try to reenter collect
        try IApeSwapV3Pool(msg.sender).collect(address(0), 0, 0, 0, 0) {} catch (bytes memory error) {
            require(keccak256(error) == keccak256(abi.encodeWithSignature(expectedError)));
        }

        // try to reenter burn
        try IApeSwapV3Pool(msg.sender).burn(0, 0, 0) {} catch (bytes memory error) {
            require(keccak256(error) == keccak256(abi.encodeWithSignature(expectedError)));
        }

        // try to reenter flash
        try IApeSwapV3Pool(msg.sender).flash(address(0), 0, 0, new bytes(0)) {} catch (bytes memory error) {
            require(keccak256(error) == keccak256(abi.encodeWithSignature(expectedError)));
        }

        // try to reenter collectProtocol
        try IApeSwapV3Pool(msg.sender).collectProtocol(address(0), 0, 0) {} catch (bytes memory error) {
            require(keccak256(error) == keccak256(abi.encodeWithSignature(expectedError)));
        }

        require(false, 'Unable to reenter');
    }
}
