import express from "express";
import {ApolloServer} from "apollo-server-express";
import { schema } from "./schema";
import { context } from "./context";
import { ApolloServerPluginLandingPageLocalDefault } from "apollo-server-core";

const startApolloServer = async () =>{
    const server = new ApolloServer({
        schema, 
        context,
        introspection: true,                                      // 1
        plugins: [ApolloServerPluginLandingPageLocalDefault()],});
    const app = express();
    await server.start();
    server.applyMiddleware({app});
    const port = process.env.PORT || '4000'
    app.listen({port: port},()=> console.log(`Server is running at http://localhost:4000${server.graphqlPath} `))
}
startApolloServer();
