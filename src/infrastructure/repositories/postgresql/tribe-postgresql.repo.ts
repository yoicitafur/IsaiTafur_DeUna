import { Between, MoreThan, Repository } from "typeorm";
import { DatabaseService } from "../../db";
import { ITribeRepository } from "../../../domain/repositories";
import { MetricsModel, TribeModel } from "../../models";
import { RepositoryMetricsListMapper } from "../../../application/mappers";
import { IRepositoryMetricsParams } from "../../../application/interfaces";
import { IRepositoryMetrics } from "../../../application/dtos";

class TribePostgresqlRepo implements ITribeRepository {
  private tribeRepo: Repository<TribeModel>;
  private metricsRepo: Repository<MetricsModel>;
  private repositoryMapper: RepositoryMetricsListMapper;

  constructor() {
    this.tribeRepo = DatabaseService.getRepository(TribeModel);
    this.metricsRepo = DatabaseService.getRepository(MetricsModel);
    this.repositoryMapper = new RepositoryMetricsListMapper();
  }

  private async _findTribeById(id: number): Promise<TribeModel> {
    const tribeEntity: TribeModel = await this.tribeRepo.findOne({
      where: {
        id_tribe: id
      },
      relations: { organization: true }
    })

    return tribeEntity;
  }

  public async findRepositoryMetrics(id: number, params: IRepositoryMetricsParams): Promise<IRepositoryMetrics[]> {
    const tribeEntity: TribeModel = await this._findTribeById(id);
    if (!tribeEntity) {
      throw new Error('404: La tribu no se encuentra registrada');
    }

    const metricsSet: MetricsModel[] = await this.metricsRepo.find({
      where: {
        coverage: MoreThan(params.coverageAbove),
        repository: {
          tribe: tribeEntity,
          create_time: Between(params.from, params.to),
          state: params.state,
        }
      },
      relations: {
        repository: true
      }
    });

    const repositoryMetricsList: IRepositoryMetrics[] = await this.repositoryMapper.toTransformData(tribeEntity, metricsSet);

    return repositoryMetricsList;
  }

}

export { TribePostgresqlRepo }
