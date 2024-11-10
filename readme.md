# PASOS PARA EJECUTAR EL PROYECTO CONSUMIR API DE SWAPI

# Instalar las dependencias
npm install

# Generar la documentacion de Openapi
serverless openapi generate --output ./openapi/openapi.json


# Correr mis Test
npm test


# Deploy de mis Lambda
# serverless offline start --reloadHandler  (Local)
# GET  | http://localhost:3000/dev/api/v1/planets 
# GET  | http://localhost:3000/dev/api/v1/planets/{id}  
# POST | http://localhost:3000/dev/api/v1/planets  (Inserta la data consumida de la api de Swapi)
# GET  | http://localhost:3000/dev/swagger-ui   (Documentacion)


# sls deploy (Produccion)
# GET - https://levxjpccd0.execute-api.us-east-1.amazonaws.com/api/v1/planets
# GET - https://levxjpccd0.execute-api.us-east-1.amazonaws.com/api/v1/planets/{id}
# POST - https://levxjpccd0.execute-api.us-east-1.amazonaws.com/api/v1/planets  (Inserta la data consumida de la api de Swapi)
# GET - https://levxjpccd0.execute-api.us-east-1.amazonaws.com/api/openapi/openapi.json
# GET - https://levxjpccd0.execute-api.us-east-1.amazonaws.com/api/swagger-ui  (Documentacion)
![alt text](assets/image.png)