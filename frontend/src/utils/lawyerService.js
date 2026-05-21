// Function to load nearby lawyers from backend
function loadNearbyLawyers(lat, lng) {
  fetch(`http://localhost:5000/api/lawyers?lat=${lat}&lng=${lng}`)
    .then(res => res.json())
    .then(data => {
      showLawyersOnMap(data);
    })
    .catch(error => {
      console.error('Error loading nearby lawyers:', error);
    });
}

// Function to display lawyers on map (placeholder)
function showLawyersOnMap(lawyers) {
  console.log('Nearby lawyers:', lawyers);
  // Add your map display logic here
}

export { loadNearbyLawyers };