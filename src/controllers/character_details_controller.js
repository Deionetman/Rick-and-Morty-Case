import { Controller } from '@hotwired/stimulus'
import { fetchData } from '../api/apiClient'

export default class extends Controller {
    static targets = ["content"]

    async showCharacterDetails(event) {
        const id = event.target.dataset.id
        console.log("Fetching details for character ID:", id);

        try {
            const character = await fetchData(`/character/${id}`)
            this.renderCharacterDetails(character)
        } catch(err){
            console.log("Error fetching character details:", err)
            this.showError("Failed to load character details")
        }
    }

    renderCharacterDetails(character){
        document.querySelector('#results').innerHTML = `
        <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center m-auto">
            <h2 class="text-2xl font-bold text-green-400">${character.name}</h2>
            <p class="mt-2 text-gray-400"><strong>Species:</strong> ${character.species}</p>
            <p class="mt-2 text-gray-400"><strong>Gender:</strong> ${character.gender}</p>
            <p class="mt-2 text-gray-400"><strong>Last location:</strong> ${character.location.name}</p>
            <p class="mt-2 text-gray-400"><strong>Origin:</strong> ${character.origin.name}</p>
            <button 
                class="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
                data-action="click->application#showCharacters">
                Back to Characters
            </button>
        </div>
        `
    }

    showError(){
        document.querySelector('#results').innerHTML = `<p class="text-red-500">${message}</p>`
    }
}