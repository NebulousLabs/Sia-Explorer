package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"
	"net/url"
	"strconv"

	"github.com/NebulousLabs/Sia/modules"
	"github.com/NebulousLabs/Sia/types"
)

// Does an arbitrary request to the server referenced by link, returns as a byte array.
func (es *ExploreServer) apiGet(apiCall string) (response []byte, err error) {
	// Do a http request to the sia daemon
	resp, err := http.Get(es.url + apiCall)
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

// ExplorerState queries the locally running statu
func (es *ExploreServer) apiExplorerState() (explorerStatus modules.ExplorerStatus, err error) {
	stateJSON, err := es.apiGet("/blockexplorer/status")
	if err != nil {
		return
	}

	err = json.Unmarshal(stateJSON, &explorerStatus)

	return
}

// GetBlockData queries a range of blocks from the server, and returns that list
func (es *ExploreServer) apiGetBlockData(start types.BlockHeight, end types.BlockHeight) ([]modules.ExplorerBlockData, error) {
	v := url.Values{}
	v.Set("start", strconv.Itoa(int(start)))
	v.Add("finish", strconv.Itoa(int(end)))
	blocksJson, err := es.apiGet("/blockexplorer/blockdata?" + v.Encode())
	if err != nil {
		return nil, err
	}

	var blocks []modules.ExplorerBlockData

	// Attepmt to interpret as a block
	err = json.Unmarshal(blocksJson, &blocks)

	return blocks, err
}
