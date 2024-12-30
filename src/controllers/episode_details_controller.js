import { Controller } from '@hotwired/stimulus'
import { fetchData } from '../api/apiClient'

export default class extends Controller {
    static targets = ["content", "input", "results"]

    async showEpisodeDetails(event){
        const id = event.target.dataset.id

        try {
            const episode = await fetchData(`/episode/${id}`)
            const characters = await this.fetchCharacters(episode.characters)
            this.renderEpisodeDetails(episode, characters)
        } catch(err){
            console.log('Error fetching episode details:', err)
            this.showError("Failed to load episode details.")
        }
    }

    async search() {
        const query = this.inputTarget.value.trim();
    
        if (!query) {
            this.resultsTarget.innerHTML = `<p class="text-gray-400">Please enter a name to search for episodes.</p>`;
            return;
        }
    
        try {
            const response = await fetchData(`/episode/?name=${query}`);
            this.renderEpisodeResults(response.results);
        } catch (error) {
            console.error('Error fetching episode data:', error);
            this.resultsTarget.innerHTML = `<p class="text-red-500">No characters found matching "${query}".</p>`;
        }
    }

    async fetchCharacters(characterUrls){
        try {
            const characterPromises = characterUrls.map((url) => fetch(url).then((res) => res.json()))
            return await Promise.all(characterPromises)
        } catch(err){
            console.error("Error fetching character details", err)
            return []
        }
    }

    renderEpisodeResults(episodes) {
        this.resultsTarget.innerHTML = episodes
            .map(
                (episode) => `
                <div class="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h3 class="text-lg font-semibold text-gray-200">${episode.name}</h3>
                    <p class="text-gray-400"><strong>Air Date:</strong> ${episode.air_date || 'Unknown'}</p>
                    <p class="text-gray-400"><strong>Episode:</strong> ${episode.episode || 'Unknown'}</p>
                    <button 
                        class="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
                        data-action="click->episode-details#showEpisodeDetails"
                        data-id="${episode.id}">
                        View Details
                    </button>
                </div>
            `
            )
            .join("");
    }
    
    renderCharacters(characters){
        if(!Array.isArray(characters) || characters.length === 0){
            return `<p class="text-gray-400">No characters found for this episode.</p>`
        }

        return characters
            .map(
                (character) => `
                <div class="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
                    <h4 class="text-lg font-bold text-gray-200">${character.name}</h4>
                    <p class="text-gray-400"><strong>Species:</strong> ${character.species || 'Unknown'}</p>
                    <p class="text-gray-400"><strong>Gender:</strong> ${character.gender || 'Unknown'}</p>
                </div>
            `
        ).join("")
    }

    renderEpisodeDetails(episode, characters) {

        document.querySelector('#results').innerHTML = 
        `
            <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
                <h2 class="text-2xl font-bold text-green-400">${episode.name}</h2>
                <p class="text-gray-400 mt-2"><strong>Episode:</strong> ${episode.episode || 'Unknown'}</p>
                <p class="text-gray-400"><strong>Air Date:</strong> ${episode.air_date || 'Unknown'}</p>
                <h3 class="text-xl font-semibold text-gray-200 mt-6">Characters:</h3>
                <div class="mt-4">
                    ${this.renderCharacters(characters)}
                </div>
                <button 
                    class="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                    data-action="click->application#showEpisodes">
                    Back
                </button>
            </div>
        `;
    }
    
    showError(message){
        document.querySelector('#results').innerHTML = `<p class="text-red-500">${message}</p>`
    }
}