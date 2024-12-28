const BASE_URL = 'https://rickandmortyapi.com/api';

export const fetchData = async (endpoint) => {
  const res = await fetch(`${BASE_URL}${endpoint}`);
  if (!res.ok) {
    throw new Error('Fetch failed');
  }
  return res.json();
};