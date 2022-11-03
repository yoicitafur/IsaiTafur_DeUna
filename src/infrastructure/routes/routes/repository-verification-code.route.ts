import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import IRoute from '../route.interface';
import responseHandler from '../../helpers/response.handler'
import { RepositoryUseCase } from '../../../application/usecases/repository.usecase';
import { findRepositoryVerificationTypesResponseDTO } from '../../../application/dtos/repository.dto';
import { RepositoryMockRepo } from '../../repositories/mock/repository-mock.repo';

class RepositoryRoutes implements IRoute{
  public prefix_route = '/repository-verification-codes'
  private repositoryUseCase: RepositoryUseCase;

  constructor() {
    this.repositoryUseCase = new RepositoryUseCase(new RepositoryMockRepo());
    this.routes = this.routes.bind(this);
  }

  async routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: any) {

    fastify.get(`/`, async (request, reply) => {
      responseHandler(async () => {
        const response: findRepositoryVerificationTypesResponseDTO = await this.repositoryUseCase.getVerificationCodes();

        return response;
      }, reply)
      await reply
    });

    done()
  }
}

export { RepositoryRoutes }
