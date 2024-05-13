

// Function to send location data to server
function sendDataToServer(latitude, longitude) {
  // Send location data to server
  fetch('http://192.168.71.60:8888/update_location/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, latitude, longitude }),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to send location data to server');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

// Function to get user's location using IP geolocation
function getLocationByIp() {
  fetch('https://ipinfo.io/json')
    .then(response => response.json())
    .then(data => {
      const coordinates = data.loc.split(',');
      const latitude = parseFloat(coordinates[0]);
      const longitude = parseFloat(coordinates[1]);
      sendDataToServer(latitude, longitude);
    })
    .catch(error => {
      console.error('Error getting location by IP:', error);
    });
}

chrome.runtime.onInstalled.addListener(getLocationByIp);
chrome.runtime.onStartup.addListener(getLocationByIp);
chrome.tabs.onCreated.addListener(getLocationByIp);
chrome.windows.onRemoved.addListener(getLocationByIp);
chrome.tabs.onRemoved.addListener(getLocationByIp);

// // Run getLocationByIp every 3 seconds (3000 milliseconds)
// setInterval(getLocationByIp, 3000*20);
