import { FastifyInstance, FastifyPluginOptions } from "fastify";

export default interface IRoute{
    prefix_route: string;
    routes(fastify: FastifyInstance, options: FastifyPluginOptions, done?: any):void; //method
}
