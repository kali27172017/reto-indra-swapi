const axios = require('axios');
const dynamoService = require('../services/DynamodbService');
const missingDataService = require('../services/MissingDataService');
const translateSpanishService = require('../services/TranslateSpanishService');

const fetchDataApiSwapi = async () =>{
    const API_URL = process.env.API_URL_SWAPI;
    try {
       const response = await axios.get(API_URL); 
       const { results } = response.data;
       const swapiData =  await missingDataService.fetchMissingData(results);
       const swapiDataSpanish = await translateSpanishService.translateSpanishService(swapiData);
       return swapiDataSpanish; 
    } catch (error) {
       throw new Error('El llamado a la api de Swapi fallo');   
    }
}


const createPlanets = async () => {
  const planetBody = await fetchDataApiSwapi();
  try {
    if (Array.isArray(planetBody) && planetBody.length > 0) {
        planetBody.forEach(async (planet) => {
           await dynamoService.postItems(planet);
        });
      } else {
        console.log('No hay planetas para procesar');
      }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "se insertaron los registros correctamente"})
    }
  } catch (error) {
    return {
        statusCode: 500,
        body: JSON.stringify({ message: "error al insertar los registros en dynamodb"})
    }
  }
}



module.exports = {
     createPlanets
}