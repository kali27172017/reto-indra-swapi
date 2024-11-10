const axios = require('axios');


class MissingDataService {
  
  constructor(){
    this.results = [];
  }

  async fetchMissingData(data){
     let planetsFilter = await this.mappingDataPlanet(data);
     let planetsAddId = this.addPlanetId(planetsFilter)
     let planetsWithFilms = await this.mapPlanetsWithFilms(planetsAddId);
     this.results = await this.mapPlanetWithResidents(planetsWithFilms);
     return this.results;
  }

  addPlanetId(data){
     return data.map(planet => {
        let url = planet.url.split('/').filter(Boolean);
        let id = url[url.length -1];
        return {
            id,
            name: planet.name,
            rotation_period: planet.rotation_period,
            orbital_period: planet.orbital_period,
            diameter: planet.diameter,
            climate: planet.climate,
            gravity: planet.gravity,
            terrain: planet.terrain,
            surface_water: planet.surface_water,
            population: planet.population,
            residents: planet.residents,
            films: planet.films,
            created: planet.created,
          };

     })
  }


  async  fetchFilmData(filmUrls) {
    if(filmUrls.length > 0){
        const filmData = await Promise.all(filmUrls.map(async (url) => {
            const response = await axios.get(url);
            const { title, director } = await response.data;
            return  { title, director };
          }));
        return filmData;
    }
    return [];
  }


  async  fetchResidentData(ResidentUrls) {
    if(ResidentUrls.length > 0){
        const residentData = await Promise.all(ResidentUrls.map(async (url) => {
            const response = await axios.get(url);
            const { name, gender } = await response.data;
            return  { name, gender };
          }));
        return residentData;
    }
    return [];
  }


  async mapPlanetsWithFilms(data){
    return Promise.all(data.map(async(planet) => {
        const films = await this.fetchFilmData(planet.films);
        return{
            ...planet,
            films
        }
    }))
  }


  async mapPlanetWithResidents(data){
    return Promise.all(data.map(async(planet) => {
       const residents = await this.fetchResidentData(planet.residents);
       return{
        ...planet,
        residents
       } 
    }))
  }

  async mappingDataPlanet(data) {
    return data.map(this.filterPlanetData);
  }


  filterPlanetData(planet) {
    const { name, rotation_period, orbital_period, diameter, climate, gravity, terrain, surface_water, population, 
        residents, films, created, url } = planet;
    return { name, rotation_period, orbital_period, diameter, climate, gravity, terrain, surface_water, population, 
        residents, films, created, url };
  }
  

}


module.exports = new MissingDataService();