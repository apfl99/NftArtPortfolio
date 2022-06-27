// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Full.sol"; // 컨트랙 참조


contract ArtToken is ERC721Full { //ERC721Full을 openzepplin라이브러리에서 상속
  
    struct Art{
        string author;
        string dateCreated;
        string artName;
    }

    mapping(uint256 => Art) arts; // tokenId(key) -> (author, dateCreated)
    mapping(string => uint256) artIdsCreated; // CID(key) -> tokenId

    // ERC721Full로 넘겨 주기 위한 객체 생성(배포시 deploy_YTT의 name,symbol 사용)
    constructor(string memory name, string memory symbol) ERC721Full(name, symbol) public {}

    // 토큰 발행 
    function mintAT(
        address _sender,
        string memory _CID,
        string memory _artName,
        string memory _author,
        string memory _dateCreated,
        string memory _tokenURI
    )
        public
    {
        require(artIdsCreated[_CID] == 0, "CID has already been created"); //CID가 key 값을 중복 검사 , 에러 메시지
        uint256 tokenId = totalSupply().add(1); // 전체 토큰 개수 + 1을 tokenId로 정의
        arts[tokenId] = Art(_author, _dateCreated, _artName); // tokenId를 키로 구조체 정보 저장
        artIdsCreated[_CID] = tokenId; //CID를 키로 tokenId 저장 => 같은 CID를 가진 토큰 등록 방지

        
        _mint(_sender, tokenId); // 토큰 발행(ERC721, ERC721Enumerable 둘 다에 있음)
                                    // 그러면 어느 컨트랙에 있는 것을 사용?
                                    // solidity 특성상 다중 상속시 C3 Linearization을 따름 -> 맨 오른쪽 컨트랙부터 검색
                                    // ERC721Enumerable에 있는 _mint 

        _setTokenURI(tokenId, _tokenURI); //ERC721MetaData 
                                          //tokenURI - tokenId(key) mapping
                                          //가스비 절감 목적으로 URI를 통해 토큰 핸들링                                     
    }

    // 읽기 전용 함수 tokenId -> author, dateCreated
    function getAT(uint256 _tokenId) public view returns(string memory, string memory, string memory) {
        return (arts[_tokenId].author, arts[_tokenId].dateCreated, arts[_tokenId].artName);
    }

    // CID -> 사용 여부 확인(bool)
    function isTokenAlreadyCreated(string memory _CID) public view returns (bool) {
        return artIdsCreated[_CID] != 0 ? true : false;
    }
}