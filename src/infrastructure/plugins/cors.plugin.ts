import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import fastifyPlugin from 'fastify-plugin'

const corsPlugin = (fastify: FastifyInstance, opts: FastifyPluginOptions, done: any) => {

    fastify.register(require('fastify-cors'), {
        origin: "*",
        methods: ["GET", "POST","PUT", "DELETE"]
    });

    done()
}

export default fastifyPlugin(corsPlugin)
