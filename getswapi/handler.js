const dynamoService = require('../services/DynamodbService');

const getPlanets = async (event, context) => {
    try {
      const { Items } = await dynamoService.getItems();
      return {
        statusCode: 200,
        body: JSON.stringify({ planets: Items })
      };
    } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error al obtener los planeta revisar:", error })
        };
    }   
}


const getPlanet = async (event, context) => {
    const planetId = event.pathParameters.id;
    let key = {};

    if(planetId){
        key = { id: planetId }  
    }

    try {
      const { Item } = await dynamoService.getItem(key);
        return {
        statusCode: 200,
        body: JSON.stringify({ planet: Item })
      };
    } catch (error) {
        return {
          statusCode: 500,
          body: JSON.stringify({ message: "Error al obtener el planeta:", error })
        };
    }   
}

module.exports = {
    getPlanets,
    getPlanet
}
