const { getPlanets, getPlanet } = require('../getswapi/handler');
const axios = require('axios');
const missingDataService = require('../services/MissingDataService');
const translateSpanishService = require('../services/TranslateSpanishService');
const { createPlanets } = require('../postswapi/handler'); 
const dynamoService = require('../services/DynamodbService');

jest.mock('../services/DynamodbService', () => ({
  getItems: jest.fn(),
  getItem: jest.fn(),
  postItems: jest.fn() 
}));


jest.mock('axios');
jest.mock('../services/DynamodbService');
jest.mock('../services/MissingDataService');
jest.mock('../services/TranslateSpanishService');

describe('Pruebas para el servicio de planetas', () => {
  
  describe('getPlanets', () => {
    it('debería retornar una lista de planetas con statusCode 200', async () => {
      const mockItems =  [{
        id: "2", agua_superficial: "1", clima: "arid",
        creado: "2014-12-09T13:50:49.641000Z", diametro: "10465",
        gravedad: "1 standard", nombre: "Tatooine", peliculas: [],
        periodo_orbital: "304", periodo_rotacion: "23", poblacion: "200000",
        residentes:[],terreno: "desert"
      }];

      dynamoService.getItems.mockResolvedValue({ Items: mockItems });
      const result = await getPlanets();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).planets).toEqual(mockItems);
    });

    it('debería retornar un statusCode 500 en caso de error', async () => {
      dynamoService.getItems.mockRejectedValue(new Error('Error en DynamoDB'));
      const result = await getPlanets();
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Error al obtener los planetas:');
    });
  });


  describe('getPlanet', () => {
    it('debería retornar un planeta específico con statusCode 200', async () => {
      const mockPlanet = {
        id: "2", agua_superficial: "1", clima: "arid",
        creado: "2014-12-09T13:50:49.641000Z", diametro: "10465",
        gravedad: "1 standard", nombre: "Tatooine", peliculas: [],
        periodo_orbital: "304", periodo_rotacion: "23", poblacion: "200000",
        residentes:[],terreno: "desert"
      }
      
      dynamoService.getItem.mockResolvedValue({ Item: mockPlanet });

      const event = { pathParameters: { id: '1' } };
      const result = await getPlanet(event);

      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).planet).toEqual(mockPlanet);
    });

    it('debería retornar un statusCode 500 en caso de error', async () => {
      dynamoService.getItem.mockRejectedValue(new Error('Error en DynamoDB'));
      const event = { pathParameters: { id: '1' } };
      const result = await getPlanet(event);
      expect(result.statusCode).toBe(500);
      expect(JSON.parse(result.body).message).toBe('Error al obtener el planeta:');
    });
  });


  describe('createPlanets', () => {
    it('debería retornar un mensaje de que se insertaron correctamente con statusCode 200', async () => {
        const mockSwapiResponse = {
            data: {
              results: [
                {
                  nombre: "Tatooine",
                  clima: "arid",
                  poblacion: "200000",
                  terreno: "desert"
                }
              ]
            }
          };
      
          const mockProcessedData = [
            {
              nombre: "Tatooine",
              clima: "arid",
              poblacion: "200000",
              terreno: "desert"
            }
          ];
  
     
      axios.get.mockResolvedValue(mockSwapiResponse);
      missingDataService.fetchMissingData.mockResolvedValue(mockProcessedData);
      translateSpanishService.translateSpanishService.mockResolvedValue(mockProcessedData);
      dynamoService.postItems.mockResolvedValue({});
  
      const result = await createPlanets();
      expect(result.statusCode).toBe(200);
      expect(JSON.parse(result.body).message).toBe('se insertaron los registros correctamente');
  
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(missingDataService.fetchMissingData).toHaveBeenCalledWith(mockSwapiResponse.data.results);
      expect(translateSpanishService.translateSpanishService).toHaveBeenCalledWith(mockProcessedData);
      expect(dynamoService.postItems).toHaveBeenCalledTimes(mockProcessedData.length);
    });
  })
});
