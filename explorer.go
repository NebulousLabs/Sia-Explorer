package main

import (
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

// A structure to store any state of the server. Should remain relatively
// unpopulated, mostly constants which will eventually be broken off
type ExploreServer struct {
	url    string
	router *mux.Router
	logger *log.Logger
}

// writeJSON writes the object to the ResponseWriter. If the encoding fails,
// an error is written instead.
func writeJSON(w http.ResponseWriter, obj interface{}) {
	if json.NewEncoder(w).Encode(obj) != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
	}
}

func main() {
	// Parse command line flags for port numbers
	apiPort := flag.String("a", "9980", "API port")
	hostPort := flag.String("p", "9983", "HTTP host port")
	flag.Parse()

	logFile, err := os.OpenFile(filepath.Join("./", "explorer.log"), os.O_WRONLY|os.O_CREATE|os.O_APPEND, 0660)

	// Initialize the server
	var es = &ExploreServer{
		url:    "http://localhost:" + *apiPort,
		router: mux.NewRouter().StrictSlash(true),
		logger: log.New(logFile, "", log.Ldate|log.Ltime|log.Lmicroseconds|log.Lshortfile),
	}

	// Initialize the router that handles the API
	es.NewAPIRouter()

	es.router.PathPrefix("/").Handler(http.FileServer(http.Dir("./client/src/")))
	err = http.ListenAndServe(":"+*hostPort, es.router)
	if err != nil {
		fmt.Println("Error when serving:", err)
		os.Exit(1)
	}
	fmt.Println("Done serving")
}
