import { Client } from '@googlemaps/google-maps-services-js';
import env from './env.js';

let mapsClient;

const initGoogleMaps = () => {
  try {
    if (!mapsClient) {
      mapsClient = new Client({
        timeout: 5000, 
      });

      console.log('Google Maps client initialized');
    }

    return mapsClient;
  } catch (error) {
    console.error('Google Maps init error:', error.message);
    process.exit(1);
  }
};

// Helper methods (recommended for clean usage)
export const getGeocode = async (address) => {
  const client = initGoogleMaps();

  const response = await client.geocode({
    params: {
      address,
      key: env.GOOGLE_MAPS_API_KEY,
    },
  });

  return response.data;
};

export const getDistanceMatrix = async (origins, destinations) => {
  const client = initGoogleMaps();

  const response = await client.distancematrix({
    params: {
      origins,
      destinations,
      key: env.GOOGLE_MAPS_API_KEY,
    },
  });

  return response.data;
};

export default initGoogleMaps;