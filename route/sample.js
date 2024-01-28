const express = require('express');
const axios = require('axios');
const https = require('https');
const router = express.Router();

// Instead of using require, use dynamic import for node-fetch
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

//#region Function: Location to Coordinates
async function getLocationCoordinates(location) {
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: location,
        appid: '57dba8ad7712d6516d9135b39240ed4e'
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const { lat, lon } = response.data.coord;
    return { lat, lon };
  } catch (error) {
    console.error('Error fetching location coordinates:', error);
    throw new Error('Unable to retrieve coordinates for the location');
  }
}
//#endregion

//#region Function: Fetch City Image from Unsplash API
async function fetchCityImage(location) {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${location}&orientation=landscape`, {
      headers: {
        Authorization: 'Client-ID gcghIvkzOTGXhN5YL_syJz7oCyuGXmKN7RGUIVMuX8s' // Replace with your actual Unsplash Access Key (Client ID)
      },
      agent: new https.Agent({ rejectUnauthorized: false })
    });

    const data = await response.json();
    if (response.ok) {
      return data.urls.regular;
    } else {
      throw new Error(data.errors[0]);
    }
  } catch (error) {
    throw error;
  }
}

//#region Function City Information from OpenStreetMap
async function getCityInfo(lat, lon) {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
    return response.data;
  } catch (error) {
    console.error('Error fetching city information from OpenStreetMap:', error);
    throw new Error('An error occurred while fetching city information from OpenStreetMap');
  }
}
//#endregion

//#region GET Weeather for 5 days
router.get('/weather', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const { lat, lon } = await getLocationCoordinates(location);

    const response = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
      params: {
        q:location,
        appid: '57dba8ad7712d6516d9135b39240ed4e',
        units: 'metric'
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const forecastData = response.data.list.map(item => ({
      date: item.dt_txt,
      temperature: item.main.temp,
      description: item.weather[0].description
    }));

    res.json({ forecast: forecastData });
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'An error occurred while fetching weather data' });
  }
});
//#endregion

//#region GET CurrentWeather
router.get('/currentweather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        lat,
        lon,
        appid: '57dba8ad7712d6516d9135b39240ed4e',
        units: 'metric'
      },
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    });

    const currentWeatherData = {
      temperature: response.data.main.temp,
      description: response.data.weather[0].description
    };

    res.json({ currentWeather: currentWeatherData });
  } catch (error) {
    console.error('Error fetching current weather data:', error);
    res.status(500).json({ error: 'An error occurred while fetching current weather data' });
  }
});
//#endregion

//#region GET location
router.get('/location', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }

    const { lat, lon } = await getLocationCoordinates(location);

    res.json({ coordinates: { lat, lon } });
  } catch (error) {
    console.error('Error fetching location coordinates:', error);
    res.status(500).json({ error: 'An error occurred while fetching location coordinates' });
  }
});
//#endregion

//#region GET City Image
router.get('/city-image', async (req, res) => {
  try {
    const { location } = req.query;
    if (!location) {
      return res.status(400).json({ error: 'City name parameter is required' });
    }
    
    
    const imageURL = await fetchCityImage(location);
    
   
    res.json({ imageURL });
  } catch (error) {
    console.error('Error fetching city image:', error);
    res.status(500).json({ error: 'An error occurred while fetching city image' });
  }
});
//#endregion



//#region GET City Information
router.get('/city-info', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude parameters are required' });
    }

    const cityInfo = await getCityInfo(lat, lon);

    res.json({ cityInfo });
  } catch (error) {
    console.error('Error fetching city information:', error);
    res.status(500).json({ error: 'An error occurred while fetching city information' });
  }
});
//#endregion

module.exports = router;