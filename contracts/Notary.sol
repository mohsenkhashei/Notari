// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Notary {

    struct MyNotaryEntry {
        string fileName;
        uint timestamp; // the time when entry created
        bytes32 checkSum; // hash of the file
        string comments; // simple comment about the file
        bool isSet; // to make sure entry has been set
        address setBy; // the whom the entry created by
    }

    mapping (bytes32 => MyNotaryEntry) public myMapping;

    event NewEntry(bytes32 _checkSum, string _fileName, address indexed _setBy);


    function addEntry(bytes32 _checkSum, string memory _fileName, string memory _comments) public {
        require(!myMapping[_checkSum].isSet, "Entry already set");

        myMapping[_checkSum].isSet = true;
        myMapping[_checkSum].timestamp = block.timestamp;
        myMapping[_checkSum].fileName = _fileName;
        myMapping[_checkSum].comments = _comments;
        myMapping[_checkSum].setBy = msg.sender;

        emit NewEntry(_checkSum, _fileName, msg.sender);
    }

    function entrySet(bytes32 _checkSum) public view returns (string memory, uint, string memory, address) {
        require(myMapping[_checkSum].isSet);
        return (myMapping[_checkSum].fileName, myMapping[_checkSum].timestamp, myMapping[_checkSum].comments, myMapping[_checkSum].setBy); 
    }
}