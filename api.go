package main

import (
	"encoding/json"
	"errors"
	"io/ioutil"
	"net/http"

	"github.com/NebulousLabs/Sia/types"
)

// Does an arbitrary request to the server referenced at srv, returns as a byte array.
func (srv *ExploreServerData) apiGet (api_call string) (response []byte, err error) {
	// Do a http request to the sia daemon
	resp, err := http.Get(srv.SiaDaemonUrl+api_call)
	if err != nil {
		return
	}
	if resp.StatusCode != 200 {
		err = errors.New("Sia Daemon Returned Non-200 code")
		return
	}


	defer resp.Body.Close()
	response, err = ioutil.ReadAll(resp.Body)

	// Returns error if there is one
	return
}

// Wrapper around apiGet that parses into a block object
func (srv *ExploreServerData) apiGetBlock() (b types.Block, err error) {
	blockJson, err := srv.apiGet("/blockexplorer/currentblock")
	if err != nil {
		return
	}

	// Attepmt to interpret as a block
	err = json.Unmarshal(blockJson, &b)

	// Returs the error if there is one too
	return
}
