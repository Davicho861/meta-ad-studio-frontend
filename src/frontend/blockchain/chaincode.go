// Quantum-Resilient Fortress - Blockchain Chaincode for Data Immutability
// This chaincode is designed for Hyperledger Fabric to provide a secure,
// immutable ledger for critical system events and configurations.

package main

import (
	"fmt"
	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-protos-go/peer"
)

// SimpleChaincode implements a simple chaincode to manage an asset
type SimpleChaincode struct {
}

// Init is called during chaincode instantiation to initialize any data.
func (t *SimpleChaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	// We don't need any initialization for this simple chaincode.
	return shim.Success(nil)
}

// Invoke is called per transaction on the chaincode. Each transaction is
// either a 'put' or a 'get' on the asset created by Init function.
func (t *SimpleChaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()
	if function == "set" {
		return t.set(stub, args)
	} else if function == "get" {
		return t.get(stub, args)
	}
	return shim.Error("Invalid invoke function name. Expecting 'set' or 'get'")
}

// set stores the asset (both key and value) on the ledger.
func (t *SimpleChaincode) set(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}

	err := stub.PutState(args[0], []byte(args[1]))
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to set asset: %s", args[0]))
	}
	return shim.Success(nil)
}

// get returns the value of the specified asset key
func (t *SimpleChaincode) get(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	value, err := stub.GetState(args[0])
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to get asset: %s with error: %s", args[0], err))
	}
	if value == nil {
		return shim.Error(fmt.Sprintf("Asset not found: %s", args[0]))
	}
	return shim.Success(value)
}

// main function starts up the chaincode in the container during instantiate
func main() {
	if err := shim.Start(new(SimpleChaincode)); err != nil {
		fmt.Printf("Error starting SimpleChaincode: %s", err)
	}
}
