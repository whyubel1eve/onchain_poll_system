// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Poll is Ownable(msg.sender) {
    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(bytes32 => bool) public hasVoted;
    mapping(string => Candidate[]) public eventList;

    function createPollEvent(
        string memory id,
        string[] memory initialCandidates
    ) public {
        Candidate[] storage candidates = eventList[id];

        for (uint i = 0; i < initialCandidates.length; i++) {
            candidates.push(
                Candidate({
                    id: candidates.length + 1,
                    name: initialCandidates[i],
                    voteCount: 0
                })
            );
        }
    }

    function verify(
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address originalSigner
    ) public pure returns (bool) {
        address signer = ecrecover(hash, v, r, s);
        return signer == originalSigner;
    }

    function vote(
        string memory eventId,
        uint candidateId,
        bytes32 hash,
        uint8 v,
        bytes32 r,
        bytes32 s,
        address originalSigner
    ) public {
        Candidate[] storage candidates = eventList[eventId];
        require(
            candidateId > 0 && candidateId <= candidates.length,
            "Invalid candidate ID."
        );
        require(verify(hash, v, r, s, originalSigner), "Verify failed.");
        require(!hasVoted[hash], "the token has been used.");

        hasVoted[hash] = true;

        candidates[candidateId - 1].voteCount++;
    }

    function getCandidateCount(
        string memory eventId
    ) public view returns (uint) {
        Candidate[] memory candidates = eventList[eventId];
        return candidates.length;
    }

    function getCandidate(
        string memory eventId,
        uint candidateId
    ) public view returns (uint, string memory, uint) {
        Candidate[] memory candidates = eventList[eventId];
        require(
            candidateId > 0 && candidateId <= candidates.length,
            "Invalid candidate ID."
        );
        Candidate memory candidate = candidates[candidateId - 1];
        return (candidate.id, candidate.name, candidate.voteCount);
    }
}
