

import axios from "axios";
import { parseString } from 'xml2js'
import lodash from "lodash";
import { eachOfLimit } from "async"
import bluebird from "bluebird";
import { writeFile } from 'fs'
import { MongoClient } from "mongodb"
import { CarMakeResponse, CarMakesXMLInterfaceResponse } from "./models/models";
import * as dotenv from "dotenv"

const {Promise, resolve} = bluebird;
const {chunk} = lodash;
dotenv.config()

//CONSTANTS
const MONGO_CONNECTION_STRING = process.env.mongoConnection
const uri = `mongodb+srv://${MONGO_CONNECTION_STRING}@cluster0.cdz37.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri)

export async function fetchCarAllMakes(){
    try{
        const response = await axios.get<CarMakesXMLInterfaceResponse>('https://vpic.nhtsa.dot.gov/api/vehicles/getallmakes?format=XML')
        return response.data
    } catch(err) {
        console.log("Unable to make API call to /vehicles/getallmakes")
    }
}

export async function convertXMLToJson(carAllMakesResponse: string) {
    const carAllMakesArray =  
        await new Promise<CarMakeResponse[]>(
            (resolve, reject) => parseString(
                carAllMakesResponse.toString(), 
                ( err, results: CarMakesXMLInterfaceResponse) => {
                    if(err) reject(err)
                    resolve(results.Response.Results[0].AllVehicleMakes)
                })
            )

    return carAllMakesArray;    
}

export async function getVehicleType(): Promise<CarMakeResponse[]> {
    try {
        const carAllMakesResponse: CarMakesXMLInterfaceResponse = await fetchCarAllMakes()
        const carAllMakesParsed = await convertXMLToJson(carAllMakesResponse.toString())
        return carAllMakesParsed

        //VERY SLOW... The API has a threshold and if the endpoint is being bombarded with requests, the API fails 
        // const response = await Promise.map(carAllMakesParsed, async (item: any) => {
        //     const response = await axios.get<{data: any[]}>(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${item.Make_ID}?format=xml`)
        //     console.log(response)
        //     return response
        // }, {concurrency: 9}).then((results=> {
        //     let a = '<Results>'
        //     results.map(result => a += result.data)
        //     return a
        // })).catch(err=> {
        //     console.log(err)
        // })

        // const vehicleTypesForMakes: any =await new Promise((resolve, reject) => parseString((response + '</Results>'), (err, results)=> {
        //     console.log(results)
        //     resolve(results)
        // }))

        // writeFile('./junkData.json', JSON.stringify(vehicleTypesForMakes.Results.Response), err => {
        //     console.log(err)
        // })

        // return carAllMakesArray

    } catch (err) {
        console.log('Unable to retrieve all vehicle makes', err)
    }
}

async function mapVehicleCarMakes(carMakeResponseArray: CarMakeResponse[])  {
    const carMakeResponseOutput = carMakeResponseArray.map(carMake => { 
                return  {   makeId: carMake.Make_ID[0], 
                            makeName: carMake.Make_Name[0]}
                })
    return carMakeResponseOutput
}

async function populateDatabase() {
    const carMakeResponseArray = await getVehicleType();
    const carMakeResponseArrayOutput = await mapVehicleCarMakes(carMakeResponseArray);
    try {
        // Current workaround for not having typecasted express handlers
        const db = client.db('sample_mflix');
        console.log('dropping existing database')
        await db.dropCollection('vehicleMakes')
        console.log('vehicleMakes dropped')
        const mongoCollection = await db.collection('vehicleMakes');
        const result = await mongoCollection.insertMany(carMakeResponseArrayOutput)
        console.log('Successfully inserted ', result.acknowledged)
        // Exit process 
        process.exit(0)
    } catch(error) {
        console.log(error)
    }
}

//run method to update database  
populateDatabase()



