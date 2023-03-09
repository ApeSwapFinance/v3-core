// SPDX-License-Identifier: BUSL-1.1
pragma solidity =0.8.12;

import {UniswapV3Pool} from './UniswapV3Pool.sol';

contract poolHash {
    bytes32 public constant INIT_CODE_PAIR_HASH = keccak256(abi.encodePacked(type(UniswapV3Pool).creationCode));
}
