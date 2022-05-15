// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";

import "../contracts/Notary.sol";

contract NotaryTest {
    function testAddAndRead() public {
        Notary notaryContract = Notary(DeployedAddresses.Notary());
        notaryContract.addEntry(0x571ae3370f84d2c6c4f6cb857146f32bcdb3bdaf14d105f30b5dd93efde17a44, "test", "test");

        string memory fileName;
        uint timestamp;
        string memory comments;
        address sender;
        (fileName, timestamp, comments, sender) = notaryContract.entrySet(0x571ae3370f84d2c6c4f6cb857146f32bcdb3bdaf14d105f30b5dd93efde17a44);
        Assert.equal(fileName, "test", "Test should be the filename");

        Assert.equal(sender, address(this), "the same address for this valler should be the address who created the hash");
    }


    function testExceptions() public {
        address notaryAddress = address(DeployedAddresses.Notary());
        bool transactionSentSuccessful = notaryAddress.call(abi.encodePacked(bytes4(keccak256("entrySet(bytes32)")), 0x571ae3370f84d2c6c4f6cb857146f32bcdb3bdaf14d105f30b5dd93efde17a45));
        Assert.equal(transactionSentSuccessful, false, "the transaction should fail");
    }
} 