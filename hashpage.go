package main

import (
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/NebulousLabs/Sia/crypto"
	"github.com/NebulousLabs/Sia/types"
)

// Redefine the structs sent by the blockexplorer here. As they are
// sent through the modules module and the api as an interface{}, they
// are only defined in the blockexplorer module of Sia, which should
// not be imported from an external program
type (
	responseData struct {
		ResponseType string
	}

	blockData struct {
		Block  types.Block
		Height types.BlockHeight
	}

	txData struct {
		Tx       types.Transaction
		ParentID types.BlockID
		TxNum    int
	}

	fcInfo struct {
		Contract  crypto.Hash
		Revisions []crypto.Hash
		Proof     crypto.Hash
	}

	outputTransactions struct {
		OutputTx crypto.Hash
		inputTx  crypto.Hash
	}
)

// hashPage handles the delegation of the pages depending on the hash type
func (es *ExploreServer) hashPageHandler(w http.ResponseWriter, r *http.Request) {
	var hash crypto.Hash
	var d []byte
	_, err := fmt.Sscanf(r.FormValue("h"), "%x", &d)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}
	if len(d) < crypto.HashSize {
		http.Error(w, "Provided hash not long enough", 400)
		return
	}

	copy(hash[:], d[:crypto.HashSize])

	itemJSON, err := es.apiGetHash(hash)

	// Now decode the json and figure out which display function
	// to dispatch it to.
	var rd responseData
	err = json.Unmarshal(itemJSON, &rd)
	if err != nil {
		http.Error(w, err.Error(), 400)
		return
	}

	fmt.Printf("Type of response: %s\n", rd.ResponseType)

	switch rd.ResponseType {
	case "Block":
		es.blockPage(w, itemJSON)
		return
	case "Transaction":
		es.txPage(w, itemJSON)
		return
	default:
		//fmt.Printf("Unrecognized value:\n%s", item)
		http.Error(w, "Siad returned: "+string(itemJSON), 500)
	}
}

// blockPage formats information about a block for viewing
func (es *ExploreServer) blockPage(w http.ResponseWriter, blockJSON []byte) {
	var b blockData
	err := json.Unmarshal(blockJSON, &b)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	blockSummaries, err := es.apiGetBlockData(b.Height, b.Height+1)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// Parse the header template
	page, err := parseTemplate("header.template", "Block "+string(b.Height))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	parsed, err := parseTemplate("block.template", blockRoot{
		Block:  b.Block,
		Height: b.Height,
		Target: blockSummaries[0].Target,
		Size:   blockSummaries[0].Size,
	})
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	page = append(page, parsed...)

	// Parse the footer template
	parsed, err = parseTemplate("footer.template", "Block "+string(b.Height))
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	page = append(page, parsed...)

	w.Write(page)
}

// txPage formats information about a transaction in a format suitable
// for human viewing
func (es *ExploreServer) txPage(w http.ResponseWriter, txJSON []byte) {
	var t txData
	err := json.Unmarshal(txJSON, &t)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// Parse the header template
	page, err := parseTemplate("header.template", "Transaction")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// Parse the main transaction template
	parsed, err := parseTemplate("transaction.template", t)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	page = append(page, parsed...)

	// Parse the footer template
	parsed, err = parseTemplate("footer.template", "Transaction")
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
	page = append(page, parsed...)

	w.Write(page)
}
