import fastify, { FastifyInstance } from 'fastify';
import pino, { Logger } from 'pino';
import config from './infrastructure/config';
import { DatabaseService } from './infrastructure/db';

class App {
  public app: FastifyInstance;
  private logger: Logger;
  public domain: string = config ? config.app.domain: 'localhost';
  public port: number = parseInt(`${config?.app.port}`, 10) ?? 8080;

  constructor(appInit: { plugins: any; routes: any }) {
    this.logger = pino({
      enabled: (process.env.NODE_ENV !== 'test'),
      transport: {
        target: 'pino-pretty'
      },
      serializers: {
        req: function (res) {
          return {}
        },
        res: function (res) {
          return {
            statusCode: res.statusCode,
            payload: res.payload,
          }
        },
      }
    })
    this.app = fastify({
      logger: this.logger
    });
    this.connectToDatabase()
    this.registerPlugins(appInit.plugins)
    this.registerRoutes(appInit.routes)
  }

  private async connectToDatabase() {
    try {
      await DatabaseService.initialize();
    } catch (err) {
      throw new Error(err.message);
    }
  }

  private registerPlugins(plugins: { forEach: (arg0: (plugin: any) => void) => void }) {
    plugins.forEach((plugin) => {
      this.app.register(plugin);
    })
  }

  public registerRoutes(routes: { forEach: (arg0: (routes: any) => void) => void }) {
    routes.forEach((route) => {
      let router = new route();
      this.app.register(router.routes, {});
    })
  }

  public async listen() {
    try {
      await this.app.listen({ port: this.port, host: this.domain });
    } catch (err) {
      throw new Error(err.message);
    }
  }

  public getInstance(): FastifyInstance {
    return this.app;
  }
}

export default App;
