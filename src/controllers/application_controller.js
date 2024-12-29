import { Controller } from "@hotwired/stimulus"
import { fetchData } from '../api/apiClient';

export default class extends Controller {
    static targets = ["content"]

    connect() {
        console.log("Application controller connected");
    }

    showLocations(){
        this.loadContent("location", "Explore all locations", "/location")
        console.log("location fetch")
    }

    showEpisodes(){
        this.loadContent("episode", "Explore all episodes", "/episode")
        console.log("episodes fetch")
    }

    showCharacters() {
        this.loadContent("character", "Explore all characters", "/character");
        console.log("character fetch")
    }

    loadContent(controllerName, title, endpoint){
        if (!this.hasContentTarget) {
            console.error("Error: Content target not found!");
            return;
        }

        this.contentTarget.innerHTML = `
        <div data-controller="${controllerName}" class="text-center">
            <h2 class="text-2xl font-bold mb-4 text-green-400">${title}</h2>
            <input 
            class="w-full max-w-lg px-4 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none mb-6"
            data-action="input->${controllerName}#search" placeholder="Search..."/>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            id="results"></div>
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
                    `<div data-controller="character-details location-details" class="result-item bg-gray-700 p-4 rounded-lg shadow-lg">
                        <h3 class="text-lg font-semibold text-gray-200">${item.name}</h3>
                        <button 
                        class="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                        data-action="click->character-details#showDetails" 
                        data-id="${item.id}">
                        View details
                        </button>
                    </div>
                    `
                )
                .join('')
            } else {
                resultsContainer.innerHTML = `<p class="text-gray-400">No results found.</p>`
            }
        } catch(err){
            console.error("Error fetching data:", err)
            document.querySelector("#results").innerHTML = `<p class="text-red-500">Failed to load data. Please try again later.</p>`
        }
    }
}