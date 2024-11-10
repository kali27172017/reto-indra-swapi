const { modelTranslate, modelTranslateResident, modelTranslateFilm } = require('../utils/modelTranslatePlanet');

class TranslateSpanishService {
    
    constructor(){
       this.results = [];
    }

    async translateSpanishService(data){
       this.results = data.map(planet => this.mapTranslateSpanish(planet));
       return this.results;   
    }

    mapTranslateSpanish(planet){
    let objTranslateSpanish = {}
       for(const [key ,value] of Object.entries(planet)){
          const keySpanish = modelTranslate[key];
          if(Array.isArray(value) && value.length > 0){
            objTranslateSpanish[keySpanish] =  this.mapTranslateSpanishSecondLevel(value , key);
          }else{
            objTranslateSpanish[keySpanish] = value;
          }
       }
       return objTranslateSpanish;
    }


    mapTranslateSpanishSecondLevel(data, key){
        if(key === "residents"){
            return this.mapTranslateSpanishSecond(data , modelTranslateResident);
        }

        if(key === "films"){
            return this.mapTranslateSpanishSecond(data , modelTranslateFilm);
        }
    }


    mapTranslateSpanishSecond(data, model){
        return data.map(item => {
            let objTranslateSpanishSecondLevel = {};
            for(const [keys ,value] of Object.entries(item)){
                const keySpanish = model[keys];
                objTranslateSpanishSecondLevel[keySpanish] = value;
           }
           return objTranslateSpanishSecondLevel; 
    })
   }
}


module.exports = new TranslateSpanishService();