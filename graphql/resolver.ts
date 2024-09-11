import axios from "axios";
import db from "../connection"

import { ObjectId } from "mongodb";
import { parseString } from 'xml2js'
import { CarMakeTypeMongo, VehicleTypeResponse } from "../models/models";

const resolvers = {
    CarMake: {
        id: (parent) => parent.id ?? parent._id
    },
    Query: {
        async carMake(_, {id}) {
            let collection = await db.collection<CarMakeTypeMongo>('vehicleMakes')
            let query = {makeId: id}
            const carMake =  await collection.findOne(query)
            const response = await axios.get(`https://vpic.nhtsa.dot.gov/api/vehicles/GetVehicleTypesForMakeId/${carMake.makeId}?format=xml`) 
            
            //Make additional api call to get Vehicle Type Data 
            const vehicleTypes: VehicleTypeResponse[] = await new Promise((resolve, reject) => parseString(response.data.toString(), (err, res) => {
                if(err) reject(err)
                resolve(res.Response.Results[0].VehicleTypesForMakeIds as VehicleTypeResponse[])
            }))
            
            const vehicleTypesMapped = vehicleTypes.map(vehicleType => { 
                return {
                    typeId: vehicleType.VehicleTypeId[0], 
                    typeName: vehicleType.VehicleTypeName[0]} 
                })
            
            carMake.vehicleTypes = vehicleTypesMapped
            console.log(carMake)
            return carMake
        },
        async carMakes(context) {
            let collection = await db.collection('vehicleMakes')
            const carMakes = await collection.find({}).toArray()
            return carMakes
        }
    }
}

export default resolvers

