import express from 'express'
import { expressMiddleware } from '@apollo/server/express4';
import gql from 'graphql-tag';

import {readFileSync} from 'fs'
import { ApolloServer } from '@apollo/server';
import { buildSubgraphSchema } from '@apollo/subgraph';
import resolvers from './graphql/resolver';
const app = express()

const PORT = process.env.PORT || 5700

const typeDefs = gql(readFileSync("./graphql/schema.graphql", {
    encoding: "utf-8"
}))

const server = new ApolloServer({
    schema: buildSubgraphSchema({typeDefs, resolvers})
})

await server.start()

app.use('/graphql', express.json(), expressMiddleware(server))

app.listen(PORT, ()=> {
    console.log(`Server is running on PORT ${PORT}`)
})