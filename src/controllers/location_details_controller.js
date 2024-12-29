import { Controller } from '@hotwired/stimulus'
import { fetchData } from '../api/apiClient'

export default class extends Controller {
  static targets = ["content"]

  async showLocationDetails(event) {
    const id = event.target.dataset.id;

    if (!id) {
      console.error("Error: Location ID is missing.");
      this.showError("Invalid location selected.");
      return;
    }

    try {
      const location = await fetchData(`/location/${id}`);
      this.renderLocationDetails(location);
    } catch (err) {
      console.error("Error fetching location details:", err);
      this.showError("Failed to load location details.");
    }
  }

  renderLocationDetails(location, residents = []) {
    const residentsContent = Array.isArray(residents) && residents.length > 0 
        ? residents
            .map(
                (resident) => `
                <div class="bg-gray-700 p-4 rounded-lg shadow-md">
                    <h4 class="text-lg font-bold text-gray-200">${resident.name}</h4>
                    <p class="text-gray-400"><strong>Species:</strong> ${resident.species || 'Unknown'}</p>
                    <p class="text-gray-400"><strong>Gender:</strong> ${resident.gender || 'Unknown'}</p>
                </div>
            `
            )
            .join('')
        : `<p class="text-gray-400">No residents found for this location.</p>`;

    document.querySelector('#results').innerHTML = `
      <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
          <h2 class="text-2xl font-bold text-green-400">${location.name}</h2>
          <p class="text-gray-400 mt-2"><strong>Type:</strong> ${location.type || 'Unknown'}</p>
          <p class="text-gray-400"><strong>Dimension:</strong> ${location.dimension || 'Unknown'}</p>
          <h3 class="text-xl font-semibold text-gray-200 mt-6">Residents:</h3>
          <div class="mt-4">
              ${residentsContent}
          </div>
          <button 
              class="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
              data-action="click->application#showLocations">
              Back to Locations
          </button>
      </div>
    `;
}

  showError(message) {
    document.querySelector('#results').innerHTML = `<p class="text-red-500">${message}</p>`
  }
}
