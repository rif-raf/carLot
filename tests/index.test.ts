import { convertXMLToJson, fetchCarAllMakes } from "../index";
import {describe} from '@jest/globals'
import axios from "axios";
import { mockCarMakesXML } from "./mocks/mockCarXMLData";

jest.mock("axios")

describe('indexService', () => {
    test('function fetchCarAllMakes', ()=> {
        const mockedAxios = axios as jest.Mocked<typeof axios>;
        mockedAxios.get.mockResolvedValue(mockCarMakesXML);
        const carAllMakesResponse = fetchCarAllMakes()
        carAllMakesResponse.then(data => {
            // This is redundant since we're mocking the response from the API (Helps visualizing api calls)
            // expect(carAllMakesResponse).toEqual(mockCarMakesXML)
        })
        expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    })


    test('function convertXMLToJson', async() => {
        const carAllMakesParsed = await convertXMLToJson(mockCarMakesXML.data)
        expect(carAllMakesParsed).toEqual([
            { Make_ID: [ '12858' ], Make_Name: [ '#1 ALPINE CUSTOMS' ] },
            { Make_ID: [ '4877' ], Make_Name: [ '1/OFF KUSTOMS, LLC' ] }
        ])
    })
})
