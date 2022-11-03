import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import IRoute from '../route.interface';
import responseHandler, { responseSender } from '../../helpers/response.handler';
import { TribeUseCase } from '../../../application/usecases/tribe.usecase';
import { downloadRepositoryMetricsByTribeResponseDTO, findRepositoriesMetricsOfATribeResponseDTO } from '../../../application/dtos/tribe.dto';
import { TribePostgresqlRepo } from '../../../infrastructure/repositories/postgresql/tribe-postgresql.repo';
import { ITribeRepository } from '../../../domain/repositories/tribe.repository';
import { TribeMockRepo } from '../../../infrastructure/repositories/mock/tribe-mock.repo';
import parseResponse from '../../../infrastructure/helpers/response.parser';

class TribeRoutes implements IRoute{
  public prefix_route = '/tribes'
  private tribeUseCase: TribeUseCase;
  private tribeRepository: ITribeRepository;

  constructor() {
    if (process.env.NODE_ENV !== 'test') {
      this.tribeRepository = new TribePostgresqlRepo()
    } else {
      this.tribeRepository = new TribeMockRepo();
    }
    this.tribeUseCase = new TribeUseCase(this.tribeRepository);
    this.routes = this.routes.bind(this);
  }

  async routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: any) {

    fastify.get(`/:tribe_id/repository-metrics`, async (request, reply) => {
      responseHandler(async () => {
        const tribeId: number = Number(request.params['tribe_id']);
        const response: findRepositoriesMetricsOfATribeResponseDTO = await this.tribeUseCase.getRepositoryMetricsList(tribeId);

        return response;
      }, reply)
      await reply
    });

    fastify.get(`/:tribe_id/repository-metrics/download`, async (request, reply) => {
      try {
        const tribeId: number = Number(request.params['tribe_id']);
        const response: downloadRepositoryMetricsByTribeResponseDTO = await this.tribeUseCase.downloadRepositoryMetricsList(tribeId);
        reply.header('Content-disposition', 'attachment; filename=repository-report.csv');
        reply.header('Content-Type', 'text/csv');
        reply.send(response.csvString);
      } catch (error) {
        responseSender(parseResponse(error), reply)
      }
    });

    done()
  }
}

export { TribeRoutes }
