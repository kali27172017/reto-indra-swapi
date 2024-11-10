const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, GetCommand, ScanCommand, PutCommand} = require("@aws-sdk/lib-dynamodb");

class DynamoDBService {
   constructor(){
    const client = new DynamoDBClient({});
    this.dynamoDB = DynamoDBDocumentClient.from(client);
    this.tableName = process.env.TABLE_DYNAMODB;
   }

    async getItem(key) {
     const params = { TableName: this.tableName, Key: key };
     return this.dynamoDB.send(new GetCommand(params));
   }
  
    async getItems(){
     const params = { TableName: this.tableName };
     return this.dynamoDB.send(new ScanCommand(params));  
   }
   
   async postItems(planet){
     const params = { 
        TableName: this.tableName,  
        Item: planet
      }
     return this.dynamoDB.send(new PutCommand(params));  
   }

}



module.exports = new DynamoDBService();