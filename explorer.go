package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	"github.com/NebulousLabs/Sia/types"
)

// A structure to store any state of the server. Should remain
// relatively unpopulated, mostly constants which will eventually be
// broken off
type ExploreServerData struct {
	// The explorer must know where to send the API calls
	SiaDaemonUrl string

	// BlockTemplatePath should hold the path to the html template
	// file used to display the block
	BlockTemplatePath string
}

var srv = ExploreServerData{
	SiaDaemonUrl: "http://localhost:9980",
	BlockTemplatePath: "templates/curblock.template",
}

// This function is called when the user requests the home page
// currently. It stores always pulls the latest block from the
// blockchain
func blockGetter(w http.ResponseWriter, r *http.Request) {

	// Do a http request to the sia daemon
	resp, err := http.Get(srv.SiaDaemonUrl+"/consensus/curblock")
	if err != nil {
		http.Error(w, "Could not get block from remote server", 500)
		return
	}

	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)

	// Attepmt to interpret as a block
	var b types.Block

	err = json.Unmarshal(body, &b)
	if err != nil {
		http.Error(w, "Error Parsing block:" + err.Error(), 500)
		return
	}

	w.Write(body)
}

func styleGetter(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./style.css")
}

func main() {
	http.HandleFunc("/", blockGetter)
	http.HandleFunc("/style.css", styleGetter)
	http.ListenAndServe(":9983", nil)
	fmt.Println("Done serving")
}
