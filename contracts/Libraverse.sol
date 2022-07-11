// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Libraverse {
    address payable public admin;

    constructor() payable {
        admin = payable(msg.sender);
    }
}
