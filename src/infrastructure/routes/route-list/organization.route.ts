import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import IRoute from '../route.interface';
import responseHandler from '../../helpers/response.handler'
import { createOrganizationRequestDTO, createOrganizationResponseDTO, deleteOrganizationResponseDTO, editOrganizationRequestDTO, editOrganizationResponseDTO, findOrganizationInfoResponseDTO } from '../../../application/dtos/organization.dto';
import { OrganizationPostgresqlRepo } from '../../repositories/postgresql/organization-postgresql.repo';
import { OrganizationUseCase } from '../../../application/usecases/organization.usecase';

class OrganizationRoutes implements IRoute{
  public prefix_route = '/organizations'
  private organizationUseCase: OrganizationUseCase;

  constructor() {
    this.organizationUseCase = new OrganizationUseCase(new OrganizationPostgresqlRepo());
    this.routes = this.routes.bind(this);
  }

  async routes(fastify: FastifyInstance, options: FastifyPluginOptions, done: any) {

    fastify.post(`/`, async (request, reply) => {
      responseHandler(async () => {
        const newOrganization: createOrganizationRequestDTO = request.body as createOrganizationRequestDTO;
        const response: createOrganizationResponseDTO = await this.organizationUseCase.createOrganization(newOrganization);

        return response;
      }, reply)
      await reply
    });

    fastify.put(`/:organization_id`, async (request, reply) => {
      responseHandler(async () => {
        const organizationId: number = request.params['organization_id'];
        const organization: editOrganizationRequestDTO = request.body as editOrganizationRequestDTO;
        const response: editOrganizationResponseDTO = await this.organizationUseCase.editOrganization(organizationId, organization);

        return response;
      }, reply)
      await reply
    });

    fastify.get(`/`, async (request, reply) => {
      responseHandler(async () => {
        const response: findOrganizationInfoResponseDTO[] = await this.organizationUseCase.getOrganizationInfoList();

        return response;
      }, reply)
      await reply
    });

    fastify.get(`/:organization_id`, async (request, reply) => {
      responseHandler(async () => {
        const organizationId: number = request.params['organization_id'];
        const response: findOrganizationInfoResponseDTO = await this.organizationUseCase.getOrganizationInfo(organizationId);

        return response;
      }, reply)
      await reply
    });

    fastify.delete(`/:organization_id`, async (request, reply) => {
      responseHandler(async () => {
        const organizationId: number = request.params['organization_id'];
        const response: deleteOrganizationResponseDTO = await this.organizationUseCase.deleteOrganization(organizationId)

        return response;
      }, reply)
      await reply
    });

    done()
  }
}

export { OrganizationRoutes }
