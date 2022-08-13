// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyNftMarketplace is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;

  struct Item {
    uint256 tokenId;
    address payable seller;
    address payable owner;
    uint256 price;
  }

  mapping(uint256 => Item) private idToItem;
  address payable owner;

  constructor() ERC721("MyNftMarketplace", "MNM") {
    owner = payable(msg.sender);
  }

  function createToken(string memory tokenURI, uint256 price) public payable {
    require(price > 0, "Price must be at least 1 wei");

    tokenIds.increment();
    uint256 newTokenId = tokenIds.current();

    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);
    _transfer(msg.sender, address(this), newTokenId);

    idToItem[newTokenId] = Item(
      newTokenId,
      payable(msg.sender),
      payable(address(this)),
      price
    );
  }    
      
  function getAllItems() public view returns (Item[] memory) {
    uint itemCount = tokenIds.current();
    Item[] memory items = new Item[](itemCount);

    for (uint i = 0; i < itemCount; i++) {
      Item storage currentItem = idToItem[i + 1];
      items[i] = currentItem;
    }

    return items;
  }
}
