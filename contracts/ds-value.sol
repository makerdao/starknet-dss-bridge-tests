// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity ^0.8.15;

contract DSValue {
    function peek() external pure returns (bytes32, bool) {
        return (bytes32(uint256(1e18)), true);
    }
    function read() external pure returns (bytes32) {
        return bytes32(uint256(1e18));
    }
}
