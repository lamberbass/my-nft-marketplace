// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

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

  event TokenCreated (
    uint256 indexed tokenId,
    address owner,
    uint256 price
  );

  constructor() ERC721("MyNftMarketplace", "MNM") {}

  function createToken(string memory tokenUri, uint256 price) external {
    require(price > 0, "Price must be at least 1 wei");

    tokenIds.increment();
    uint256 newTokenId = tokenIds.current();

    _mint(msg.sender, newTokenId);
    _setTokenURI(newTokenId, tokenUri);

    idToItem[newTokenId] = Item(
      newTokenId,
      payable(msg.sender),
      price,
      true
    );

    emit TokenCreated(newTokenId, msg.sender, price);
  }    

  function editItem(uint256 tokenId, uint256 price, bool isForSale) external {
    require(msg.sender == idToItem[tokenId].owner, "Only owner can edit token");

    if (idToItem[tokenId].price != price) {
      idToItem[tokenId].price = price;
    }

    if (idToItem[tokenId].isForSale != isForSale) {
      idToItem[tokenId].isForSale = isForSale;
    }
  }
      
  function getItemsForSale() external view returns (Item[] memory) {
    uint256 totalItemCount = tokenIds.current();
    uint256 forSaleCount = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].isForSale && idToItem[i + 1].owner != msg.sender) {
        forSaleCount += 1;
      }
    }

    Item[] memory items = new Item[](forSaleCount);
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].isForSale && idToItem[i + 1].owner != msg.sender) {
          Item storage currentItem = idToItem[i + 1];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
    }

    return items;
  }

  function getOwnedItems() external view returns (Item[] memory) {
    uint256 totalItemCount = tokenIds.current();
    uint256 ownedCount = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].owner == msg.sender) {
        ownedCount += 1;
      }
    }

    Item[] memory items = new Item[](ownedCount);
    uint256 currentIndex = 0;

    for (uint256 i = 0; i < totalItemCount; i++) {
      if (idToItem[i + 1].owner == msg.sender) {
          Item storage currentItem = idToItem[i + 1];
          items[currentIndex] = currentItem;
          currentIndex += 1;
        }
    }

    return items;
  }

  function buyToken(uint256 tokenId) external payable {
    uint price = idToItem[tokenId].price;
    address payable seller = idToItem[tokenId].owner;
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");
    
    idToItem[tokenId].isForSale = false;
    idToItem[tokenId].owner = payable(msg.sender);
    _transfer(seller, msg.sender, tokenId);
    seller.transfer(msg.value);
  }
}
