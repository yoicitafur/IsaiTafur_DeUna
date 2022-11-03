import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import IRoute from './route.interface';
import * as RouteSet from './routes';

class Routes {
    public prefix_route = ''

    public async routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: any) {
        /* Read all routes */
        for (const key in RouteSet) {
            const route: IRoute = new RouteSet[key]();
            fastify.register(route.routes, { prefix: route.prefix_route });
        }
    }
}

export default Routes;
