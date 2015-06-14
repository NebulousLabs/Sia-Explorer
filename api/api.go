package api

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"strconv"

	"github.com/NebulousLabs/Sia/types"
	"github.com/NebulousLabs/Sia/modules"
)

// As this modules interacts heavily with the Sia API, which sends
// structs over json, this package uses the simply imports the module
// packgae where those structs are defined in the core sia package

type ApiLink struct {
	url string

	// Port is a string as both http requests and command line arguments are strings
	port string
}

type parameter struct {
	Key string
	Value string
}

// Creates a new instance of the ApiLink class
func New(port string) (link *ApiLink) {
	link = &ApiLink{
		url: "http://localhost:",
		port: port,
	}
	return
}

// Does an arbitrary request to the server referenced by link, returns as a byte array.
func (link *ApiLink) Get (apiCall string) (response []byte, err error) {
	// Do a http request to the sia daemon
	resp, err := http.Get(link.url + link.port + apiCall)
	if err != nil {
		// err is already set
		return
	}

	defer resp.Body.Close()
	response, err = ioutil.ReadAll(resp.Body)

	if resp.StatusCode != 200 {
		err = errors.New("Sia Daemon Returned Non-200: " + string(response))
		return
	}

	return
}

// Wrapper for apiGet to put the parameters into the url string
func (link *ApiLink) Query (apiCall string, parameters []parameter) ([]byte, error) {
	apiCall += "?"
	for i, param := range parameters {
		if i != len(parameters)-1 {
			apiCall += param.Key + "=" + param.Value + "&"
		} else {
			apiCall += param.Key + "=" + param.Value
		}
	}

	return link.Get(apiCall)
}


// ExplorerState queries the locally running statu
func (link *ApiLink) ExplorerState() (explorerStatus modules.ExplorerStatus, err error) {
	stateJSON, err := link.Get("/blockexplorer/status")
	if err != nil {
		return
	}

	err = json.Unmarshal(stateJSON, &explorerStatus)

	return
}

// GetBlockData queries a range of blocks from the server, and returns that list
func (link *ApiLink) GetBlockData (start types.BlockHeight, end types.BlockHeight) ([]modules.ExplorerBlockData, error) {
	blocksJson, err := link.Query("/blockexplorer/blockdata", []parameter{
		parameter{
			Key: "start",
			Value: strconv.Itoa(int(start)),
		},
		parameter{
			Key: "finish",
			Value: strconv.Itoa(int(end)),
		},
	})
	if err != nil {
		return nil, err
	}

	var blocks []modules.ExplorerBlockData

	// Attepmt to interpret as a block
	err = json.Unmarshal(blocksJson, &blocks)

	return blocks, err
}
