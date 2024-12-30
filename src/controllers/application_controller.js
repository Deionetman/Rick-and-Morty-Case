import { Controller } from "@hotwired/stimulus";
import { fetchData } from "../api/apiClient";

export default class extends Controller {
    static targets = ["content", "results"];

    connect() {
        console.log("Application controller connected");
    }

    showLocations() {
        this.loadContent("location-details", "Explore all locations", "/location");
        console.log("Fetching locations...");
    }

    showEpisodes() {
        this.loadContent("episode-details", "Explore all episodes", "/episode");
        console.log("Fetching episodes...");
    }

    showCharacters() {
        this.loadContent("character-details", "Explore all characters", "/character");
        console.log("Fetching characters...");
    }

    showDimensions() {
        this.loadContent("location-details", "Explore all dimensions", "/location/?dimension");
        console.log("Fetching dimensions...");
    }

    loadContent(controllerName, title, endpoint) {
        if (!this.hasContentTarget) {
            console.error("Error: Content target not found!");
            return;
        }

        this.contentTarget.innerHTML = `
        <div data-controller="${controllerName}" class="flex flex-col justify-center items-center text-center">
            <h2 class="text-2xl font-bold mb-4 text-green-400">${title}</h2>
            <input 
                class="w-full max-w-lg px-4 py-2 rounded-lg bg-gray-700 text-gray-300 border border-gray-600 focus:ring-2 focus:ring-green-500 outline-none mb-6"
                data-action="input->${controllerName}#search" 
                data-${controllerName}-target="input" 
                placeholder="Search..."/>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6"
                id="results" data-${controllerName}-target="results"></div>
        </div>
        ` 

        this.fetchedInitialData(controllerName, endpoint);
    }

    async fetchedInitialData(controllerName, endpoint) {
        try {
            const data = await fetchData(endpoint);
            const resultsContainer = document.querySelector("#results");

            if (data.results && data.results.length > 0) {
                resultsContainer.innerHTML = data.results
                    .map((item) => {
                        const action =
                            endpoint.includes("character") ? "showCharacterDetails" :
                            endpoint.includes("location") ? "showLocationDetails" :
                            endpoint.includes("episode") ? "showEpisodeDetails" : 
                            endpoint.includes("dimension") ? "showLocationDetails" : null

                        return `
                            <div data-controller="${controllerName}" class="result-item bg-gray-700 p-4 rounded-lg shadow-lg">
                                <h3 class="text-lg font-semibold text-gray-200">${item.name}</h3>
                                <button 
                                    class="mt-4 mb-auto px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all"
                                    data-action="click->${controllerName}#${action}" 
                                    data-id="${item.id}">
                                    View Details
                                </button>
                            </div>
                        `;
                    })
                    .join("");
            } else {
                resultsContainer.innerHTML = `<p class="text-gray-400">No results found.</p>`;
            }
        } catch (err) {
            console.error("Error fetching data:", err);
            document.querySelector("#results").innerHTML = `<p class="text-red-500">Failed to load data. Please try again later.</p>`;
        }
    }
}
