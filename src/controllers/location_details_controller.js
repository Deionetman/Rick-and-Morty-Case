import { Controller } from '@hotwired/stimulus';
import { fetchData } from '../api/apiClient';

export default class extends Controller {
  static targets = ["content", "results", "input"];

  async showLocationDetails(event) {
    const id = event.target.dataset.id;

    try {
      const location = await fetchData(`/location/${id}`);
      const residents = await this.fetchResidents(location.residents);
      this.renderLocationDetails(location, residents);
    } catch (err) {
      console.error("Error fetching location details:", err);
      this.showError("Failed to load location details.");
    }
  }

  async fetchResidents(residentUrls) {
    try {
      const residentPromises = residentUrls.map((url) => fetch(url).then((res) => res.json()));
      return await Promise.all(residentPromises);
    } catch (err) {
      console.error("Error fetching resident details:", err);
      return [];
    }
  }

  async search() {
    const query = this.inputTarget.value.trim();

    if (!query) {
      this.resultsTarget.innerHTML = `<p class="text-gray-400">Please enter a name to search.</p>`;
      return;
    }

    try {
      const response = await fetchData(`/location/?name=${query}`);
      this.renderLocationResults(response.results);
    } catch (error) {
      console.error('Error fetching episode data:', error);
      this.resultsTarget.innerHTML = `<p class="text-red-500">No characters found matching "${query}".</p>`;
    }
  }

  async fetchResidents(residentUrls) {
    if (!Array.isArray(residentUrls) || residentUrls.length === 0) {
      return [];
    }

    try {
      const residentPromises = residentUrls.map((url) => fetch(url).then((res) => res.json()));
      return await Promise.all(residentPromises);
    } catch (err) {
      console.error("Error fetching resident details:", err);
      return [];
    }
  }


  renderLocationResults(locations) {
    if (!Array.isArray(locations) || locations.length === 0) {
      this.resultsTarget.innerHTML = `<p class="text-gray-400">No locations found.</p>`;
      return;
    }

    this.resultsTarget.innerHTML = locations
      .map(
        (location) => `
          <div class="bg-gray-700 p-4 rounded-lg shadow-md">
              <h3 class="text-lg font-semibold text-gray-200">${location.name}</h3>
              <p class="text-gray-400"><strong>Type:</strong> ${location.type || 'Unknown'}</p>
              <p class="text-gray-400"><strong>Dimension:</strong> ${location.dimension || 'Unknown'}</p>
              <button 
                  class="mt-4 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg"
                  data-action="click->location-details#showLocationDetails"
                  data-id="${location.id}">
                  View Details
              </button>
          </div>
      `
      )
      .join("");
  }

  renderResidents(residents) {
    if (!Array.isArray(residents) || residents.length === 0) {
      return `<p class="text-gray-400">No residents found for this location.</p>`;
    }

    return residents
      .map(
        (resident) => `
          <div class="bg-gray-700 p-4 rounded-lg shadow-md mb-4">
              <h4 class="text-lg font-bold text-gray-200">${resident.name}</h4>
              <p class="text-gray-400"><strong>Species:</strong> ${resident.species || 'Unknown'}</p>
              <p class="text-gray-400"><strong>Gender:</strong> ${resident.gender || 'Unknown'}</p>
          </div>
        `
      )
      .join('')
  }

  renderLocationDetails(location, residents) {
    document.querySelector('#results').innerHTML = `
      <div class="bg-gray-900 p-6 rounded-lg shadow-lg text-center">
          <h2 class="text-2xl font-bold text-green-400">${location.name}</h2>
          <p class="text-gray-400 mt-2"><strong>Type:</strong> ${location.type || 'Unknown'}</p>
          <p class="text-gray-400"><strong>Dimension:</strong> ${location.dimension || 'Unknown'}</p>
          <h3 class="text-xl font-semibold text-gray-200 mt-6">Residents:</h3>
          <div class="mt-4">
              ${this.renderResidents(residents)}
          </div>
          <button 
              class="mt-6 px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg"
              data-action="click->application#showLocations">
              Back
          </button>
      </div>
    `;
  }

  showError(message) {
    document.querySelector('#results').innerHTML = `<p class="text-red-500">${message}</p>`;
  }
}