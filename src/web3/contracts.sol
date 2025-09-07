// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title PlanetaryScaleAuditLedger
 * @dev A smart contract for creating an immutable, decentralized audit trail.
 * This contract logs critical events from the AI/ML, Edge, and Serverless infrastructure.
 */
contract PlanetaryScaleAuditLedger {

    // ==========================================================================
    // State Variables
    // ==========================================================================

    address public owner;
    uint256 public eventCounter;

    // ==========================================================================
    // Structs and Enums
    // ==========================================================================

    enum EventType {
        ModelTraining,
        EdgeDeployment,
        ServerlessInvocation,
        SecurityAlert,
        ComplianceCheck
    }

    struct AuditEvent {
        uint256 id;
        uint256 timestamp;
        address originator;
        EventType eventType;
        string metadata; // JSON string with event details
    }

    // ==========================================================================
    // Mappings and Events
    // ==========================================================================

    mapping(uint256 => AuditEvent) public auditLog;
    event NewAuditEvent(uint256 indexed id, address indexed originator, EventType indexed eventType, string metadata);

    // ==========================================================================
    // Modifiers
    // ==========================================================================

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this action.");
        _;
    }

    // ==========================================================================
    // Constructor
    // ==========================================================================

    constructor() {
        owner = msg.sender;
        eventCounter = 0;
    }

    // ==========================================================================
    // Public Functions
    // ==========================================================================

    /**
     * @dev Records a new audit event to the blockchain.
     * @param _eventType The type of event being recorded.
     * @param _metadata A JSON string containing details about the event.
     */
    function recordEvent(EventType _eventType, string memory _metadata) public {
        // In a real-world scenario, you would have role-based access control (RBAC) here
        // to ensure only authorized services can record events.
        
        eventCounter++;
        auditLog[eventCounter] = AuditEvent({
            id: eventCounter,
            timestamp: block.timestamp,
            originator: msg.sender,
            eventType: _eventType,
            metadata: _metadata
        });

        emit NewAuditEvent(eventCounter, msg.sender, _eventType, _metadata);
    }

    /**
     * @dev Retrieves an audit event by its ID.
     * @param _id The ID of the event to retrieve.
     * @return The details of the audit event.
     */
    function getEvent(uint256 _id) public view returns (AuditEvent memory) {
        require(_id > 0 && _id <= eventCounter, "Event ID out of bounds.");
        return auditLog[_id];
    }

    /**
     * @dev Returns the total number of audit events recorded.
     * @return The current value of eventCounter.
     */
    function getEventCount() public view returns (uint256) {
        return eventCounter;
    }
}
