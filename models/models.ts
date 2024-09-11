export interface CarMakeResponse {
    Make_ID: String[]
    Make_Name: String[]
}

export interface CarMakeTypeMongo {
    makeId: String
    makeName: String
    vehicleTypes: VehicleTypeMongo[] 
}

export interface VehicleTypeResponse {
    VehicleTypeId: String[]
    VehicleTypeName: String[]
}

export interface VehicleTypeMongo{
    typeId: String
    typeName: String
}

//JSON response type after parsing XML
export interface CarMakesXMLInterfaceResponse {
    Response: {
        Results: VehicleMakesXMLInterface[]
    }
}
export interface VehicleMakesXMLInterface {
    AllVehicleMakes: CarMakeResponse[]
}

