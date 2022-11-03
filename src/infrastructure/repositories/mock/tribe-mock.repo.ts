import { RegistryStatusEnum, RepositoryStatesEnum } from "../../../application/enums";
import { MetricsModel, OrganizationModel, TribeModel } from "../../../infrastructure/models";
import { IRepositoryMetricsParams } from "../../../application/interfaces";
import { RepositoryMetricsListMapper } from "../../../application/mappers";
import { ITribeRepository } from "../../../domain/repositories";
import { IRepositoryMetrics } from "../../../application/dtos";

class TribeMockRepo implements ITribeRepository {
  private repositoryMapper: RepositoryMetricsListMapper;

  constructor() {
    this.repositoryMapper = new RepositoryMetricsListMapper();
  }

  private async _findTribeById(id: number): Promise<TribeModel> {
    if (id === 4) {
      return null;
    }

    const organizationEntity: OrganizationModel = new OrganizationModel();
    organizationEntity.id_organization = 1;
    organizationEntity.name = 'Organización de prueba';
    organizationEntity.status = 1;

    const tribeEntity: TribeModel = new TribeModel();
    tribeEntity.id_tribe = id;
    tribeEntity.name = 'Entidad de prueba';
    tribeEntity.status = 1;
    tribeEntity.organization = organizationEntity;

    return tribeEntity;
  }

  public async findRepositoryMetrics(id: number, params: IRepositoryMetricsParams): Promise<IRepositoryMetrics[]> {
    const tribeEntity: TribeModel = await this._findTribeById(id);
    if (!tribeEntity) {
      throw new Error('404: La tribu no se encuentra registrada');
    }

    if (id === 2) {
      return [];
    }

    const metricsSet: MetricsModel[] = [{
      id_repository: 1,
      coverage: 85,
      bugs: 0,
      vulnerabilities: 0,
      hotspot: 1,
      code_smells: 0,
      repository: {
        id_repository: 1,
        name: 'Repositorio de prueba #1',
        state: RepositoryStatesEnum.ENABLED,
        status: RegistryStatusEnum.ACTIVE,
        create_time: new Date(),
        tribe: tribeEntity,
        metrics: null,
      }
    }, {
      id_repository: 2,
      coverage: 96,
      bugs: 0,
      vulnerabilities: 0,
      hotspot: 1,
      code_smells: 0,
      repository: {
        id_repository: 2,
        name: 'Repositorio de prueba #2',
        state: RepositoryStatesEnum.ENABLED,
        status: RegistryStatusEnum.ACTIVE,
        create_time: new Date(),
        tribe: tribeEntity,
        metrics: null,
      }
    }];

    const repositoryMetricsList: IRepositoryMetrics[] = await this.repositoryMapper.toTransformData(tribeEntity, metricsSet);

    return repositoryMetricsList;
  }

}

export { TribeMockRepo }
