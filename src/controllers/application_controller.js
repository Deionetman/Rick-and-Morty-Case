import { Controller } from "@hotwired/stimulus"
import { fetchData } from '../api/apiClient';

export default class extends Controller {
    static targets = ["content"]

    connect() {
        console.log("Application controller connected");
    }

    showLocations(){
        this.loadContent("location", "Explore all locations", "/location")
    }

    showEpisodes(){
        this.loadContent("episode", "Explore all episodes", "/episode")
    }

    showCharacters() {
        this.loadContent("dimensions", "Explore all dimensions", "/character");
    }

    showCharacterInfo(event){
        const id = event.target.dataset.id
        this.loadContent("character", "Character info", `/character/${id}`)
    }

    loadContent(controllerName, title, endpoint){

        if (!this.hasContentTarget) {
            console.error("Error: Content target not found!");
            return;
        }

        this.contentTarget.innerHTML = `
        <div data-controller="${controllerName}" class="flex justify-center items-center flex-col">
            <h2>${title}</h2>
            <input data-action="input->${controllerName}#search" placeholder="Search..."/>
            <div id="results"></div>
        </div>
        `

        this.fetchedData(endpoint)
    }

    async fetchedData(endpoint){
        try {
            const data = await fetchData(endpoint)

            const resultsContainer = document.querySelector('#results')

            if(data.results && data.results.length > 0){
                resultsContainer.innerHTML = data.results
                .map((item) => 
                    `<div class="result-item">
                        <h3>${item.name}</h3>
                        <button 
                            data-action="click->application#showCharacterInfo" 
                            data-id="${item.id}">
                            View details
                        </button>
                    </div>
                    `
                )
                .join('')
            } else {
                resultsContainer.innerHTML = "No results found."
            }
        } catch(err){
            console.error("Error fetching data:", err)
            document.querySelector("#results").innerHTML = "Failed to load data.";
        }
    }
}