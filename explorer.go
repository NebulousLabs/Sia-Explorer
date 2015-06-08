package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
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

	// Used to store the server muxer
	ServeMux *http.ServeMux
}

// writeJSON writes the object to the ResponseWriter. If the encoding fails, an
// error is written instead.
func writeJSON(w http.ResponseWriter, obj interface{}) {
	if json.NewEncoder(w).Encode(obj) != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func (srv *ExploreServerData) homePage(w http.ResponseWriter, r *http.Request) {
	block, err := srv.apiGetBlock()
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	writeJSON(w, block)
}

// Handles the root page being requested
func (srv *ExploreServerData) RootHandler(w http.ResponseWriter, r *http.Request) {

	if (strings.Contains(r.URL.Path, ".")) {
		srv.ServeMux.ServeHTTP(w, r)
	} else {
		srv.homePage(w, r)
	}
}

func main() {
	// Initilize variables and such
	var srv = ExploreServerData{
		SiaDaemonUrl: "http://localhost:9000",
		BlockTemplatePath: "templates/curblock.template",
		ServeMux: http.NewServeMux(),
	}

	srv.ServeMux.Handle("/", http.FileServer(http.Dir("./")))
	http.HandleFunc("/", srv.RootHandler)
	http.ListenAndServe(":9983", nil)
	fmt.Println("Done serving")
}
