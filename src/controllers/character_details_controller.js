import { Controller } from '@hotwired/stimulus'
import { fetchData } from '../api/apiClient'

export default class extends Controller {
    static targets = ["content"]

    async showCharacterDetails(event) {
        const id = event.target.dataset.id

        try {
            const character = await fetchData(`/character/${id}`)
            this.renderCharacterDetails(character)
        } catch(err){
            this.showError("Failed to load character details")
        }
    }

    async renderCharacterDetails(character) {
        const episodePromises = character.episode.map((episodeUrl) => fetch(episodeUrl).then((res) => res.json()));
        const episodes = await Promise.all(episodePromises);
    
        document.querySelector('#results').innerHTML = `
            <div class="bg-gray-900 p-6 rounded-md shadow-lg text-center m-auto">
                <img src="${character.image}" class="mb-4 rounded-lg w-full" alt="character-avatar"/>
                <h2 class="text-2xl font-bold text-green-400">${character.name}</h2>
                <p class="mt-2 text-gray-400"><strong>Species:</strong> ${character.species}</p>
                <p class="mt-2 text-gray-400"><strong>Gender:</strong> ${character.gender}</p>
                <a href="${character.url}" class="mt-2 text-gray-400 underline hover:text-green-400"><strong>Last location:</strong> ${character.location.name}</a>
                <p class="mt-2 text-gray-400"><strong>Origin:</strong> ${character.origin.name}</p>
                <h3 class="mt-4 text-xl font-semibold text-gray-200">Episodes:</h3>
                <div class="mt-4 mb-4">
                    ${episodes
                        .map(
                            (episode) => `
                            <div class="bg-gray-700 p-4 rounded-lg shadow-md w-full mb-4">
                                <h4 class="text-lg font-bold text-gray-200">${episode.name}</h4>
                                <p class="text-gray-400"><strong>Episode:</strong> ${episode.episode}</p>
                                <p class="text-gray-400"><strong>Air Date:</strong> ${episode.air_date || 'Unknown'}</p>
                            </div>
                        `
                        )
                        .join('')}
                </div>
                <button 
                    class="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                    data-action="click->application#showCharacters">
                    Back to Characters
                </button>
            </div>
        `;
    }
    

    showError(){
        document.querySelector('#results').innerHTML = `<p class="text-red-500">${message}</p>`
    }
}