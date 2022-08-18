// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract MyNftMarketplace is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private tokenIds;

  struct Item {
    uint256 tokenId;
    address payable owner;
    uint256 price;
    bool isForSale;
  }

  mapping(uint256 => Item) private idToItem;
  address payable owner;

  constructor() ERC721("MyNftMarketplace", "MNM") {
    owner = payable(msg.sender);
  }

  function createToken(string memory tokenURI, uint256 price) public {
    require(price > 0, "Price must be at least 1 wei");

    tokenIds.increment();
    uint256 newTokenId = tokenIds.current();

    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenURI);

    idToItem[newTokenId] = Item(
      newTokenId,
      payable(msg.sender),
      price,
      true
    );
  }    

  function editItem(uint256 tokenId, uint256 price, bool isForSale) public {
    if (idToItem[tokenId].price != price) {
      idToItem[tokenId].price = price;
    }

    if (idToItem[tokenId].isForSale != isForSale) {
      idToItem[tokenId].isForSale = isForSale;
    }
  }

  function setItemForSale(uint256 tokenId, bool isForSale) public {
    require(isForSale != idToItem[tokenId].isForSale, "Token already has the requested isForSale value");
    idToItem[tokenId].isForSale = isForSale;
  }
      
  function getItemsForSale() public view returns (Item[] memory) {
    uint256 totalItemCount = tokenIds.current();
    uint256 forSaleCount = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].isForSale) {
        forSaleCount += 1;
      }
    }

    Item[] memory items = new Item[](forSaleCount);

    for (uint256 i = 0; i < forSaleCount; i++) {
      Item storage currentItem = idToItem[i + 1];
      if (currentItem.isForSale) {
        items[i] = currentItem;
      }
    }

    return items;
  }

  function getOwnedItems() public view returns (Item[] memory) {
    uint256 totalItemCount = tokenIds.current();
    uint256 ownedCount = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].owner == msg.sender) {
        ownedCount += 1;
      }
    }

    Item[] memory items = new Item[](ownedCount);

    for (uint256 i = 0; i < ownedCount; i++) {
      Item storage currentItem = idToItem[i + 1];
      if (currentItem.owner == msg.sender) {
        items[i] = currentItem;
      }
    }

    return items;
  }

  function buyToken(uint256 tokenId) public payable {
    uint price = idToItem[tokenId].price;
    address payable seller = idToItem[tokenId].owner;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");
    
    idToItem[tokenId].isForSale = false;
    idToItem[tokenId].owner = payable(msg.sender);
    _transfer(seller, msg.sender, tokenId);
    payable(seller).transfer(msg.value);
  }
}
