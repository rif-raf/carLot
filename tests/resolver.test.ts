import { describe } from "@jest/globals";
import gql from "graphql-tag";
import {readFileSync} from 'fs'
import { ApolloServer } from "@apollo/server";
import resolvers from "../graphql/resolver";

const typeDefs = gql(readFileSync("./graphql/schema.graphql", {
    encoding: "utf-8"
}))

describe('Resolvers',()=> {
    test('carMake ', async() => {
        const testServer = new ApolloServer({
            typeDefs,
            resolvers
        })

        const response = await testServer.executeOperation({
            query: `query ExampleQuery($carMakeId: ID!) {
                carMake(id: $carMakeId) {
                  makeName
                  makeId
                  vehicleTypes {
                    typeId
                    typeName
                  }
                }
              }`,
            variables: {carMakeId: '66e0daa059b4e20eb00bfdfd'}
        })
        //Unable to set return type in resolver (resort to gettting key)
        expect(response.body['singleResult']).toHaveProperty('data')
    })

    test('carMake error ', async() => {
        const testServer = new ApolloServer({
            typeDefs,
            resolvers
        })

        const response = await testServer.executeOperation({
            query: `query ExampleQuery($carMakeId: ID!) {
                carMake(id: $carMakeId) {
                  makeName
                  makeId
                  vehicleTypes {
                    typeId
                    typeName
                  }
                }
              }`,
            variables: {carMakeId: 'oats'}
        })
        //Unable to set return type in resolver (resort to gettting key)
        expect(response.body['singleResult']).toHaveProperty('errors')

    })

})