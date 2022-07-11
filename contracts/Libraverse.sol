// SPDX-License-Identifier: UNLICENSED
import { ERC1155 } from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import { IERC1155 } from "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
pragma solidity ^0.8.9;

// string tokenOwner = "Libraverse: Must be token creator";

contract Libraverse is ERC1155 {
    address private admin;
    uint256 private nextTokenID;
    mapping(uint => address) private tokenCreators;
    mapping(uint => string) private tokenURIs;

    // constructor() payable {
    // admin = payable(msg.sender);
    constructor(string memory tokenURI) ERC1155(tokenURI) {
        admin = (msg.sender);
        nextTokenID = 1;
    }

    function create(string memory bookURI, uint256 amount) external {
        _mint(_msgSender(), nextTokenID, amount, "");
        tokenURIs[nextTokenID] = bookURI;
        tokenCreators[nextTokenID] = _msgSender();

        nextTokenID++;
    }

    function mint(uint256 tokenID, uint256 amount) external {
        require(tokenCreators[tokenID] == _msgSender(), "Libraverse: Is not token creator");

        _mint(_msgSender(), tokenID, amount, "");
    }

    function uri(uint tokenID) public view virtual override returns (string memory) {
        return tokenURIs[tokenID];
    }
}
