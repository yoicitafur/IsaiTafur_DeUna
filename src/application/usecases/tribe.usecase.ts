import moment from "moment";
import { Parser } from "json2csv";
import { RepositoryStatesEnum } from "../enums";
import { IRepositoryMetricsParams } from "../interfaces";
import { ITribeRepository } from "../../domain/repositories";
import { downloadRepositoryMetricsByTribeResponseDTO, findRepositoriesMetricsOfATribeResponseDTO, IRepositoryMetrics } from "../dtos";

class TribeUseCase {

  constructor(private readonly tribeRepository: ITribeRepository) {}

  public async getRepositoryMetricsList(tribeId: number): Promise<findRepositoriesMetricsOfATribeResponseDTO> {
    const repositoryMetrics: IRepositoryMetrics[] = await this._getRepositoryMetricsById(tribeId);
    if (repositoryMetrics.length === 0) {
      throw new Error('404: La tribu no tiene repositorios que cumplan con la cobertura necesaria');
    }

    return {
      repositories: repositoryMetrics
    };
  }

  public async downloadRepositoryMetricsList(tribeId: number): Promise<downloadRepositoryMetricsByTribeResponseDTO> {
    const repositoryMetrics: IRepositoryMetrics[] = await this._getRepositoryMetricsById(tribeId);
    if (repositoryMetrics.length === 0) {
      throw new Error('404: La tribu no tiene repositorios que cumplan con la cobertura necesaria');
    }

    const fields = [{
      label: 'Repository ID',
      value: 'id'
    }, {
      label: 'Repository Name',
      value: 'name'
    }, {
      label: 'Tribe Name',
      value: 'tribe'
    }, {
      label: 'Organization Name',
      value: 'organization'
    }, {
      label: 'Coverage',
      value: 'coverage'
    }, {
      label: 'Code Smells',
      value: 'codeSmells'
    }, {
      label: 'Bugs',
      value: 'bugs'
    }, {
      label: 'Vulnerabilities',
      value: 'vulnerabilities'
    }, {
      label: 'Hotspots',
      value: 'hotspots'
    }, {
      label: 'Repository Verification State',
      value: 'verificationState'
    }, {
      label: 'Repository State',
      value: 'state'
    }];

    const json2csvParser = new Parser({ fields });
    const csvString: string = json2csvParser.parse(repositoryMetrics);

    const csvData: downloadRepositoryMetricsByTribeResponseDTO = {
      csvString
    };

    return csvData;
  }

  private async _getRepositoryMetricsById(tribeId: number): Promise<IRepositoryMetrics[]> {
    const params: IRepositoryMetricsParams = {
      from: moment().startOf('year').toDate(),
      to: moment().endOf('year').toDate(),
      state: RepositoryStatesEnum.ENABLED,
      coverageAbove: 75
    };
    const repositoryMetrics: IRepositoryMetrics[] = await this.tribeRepository.findRepositoryMetrics(tribeId, params);

    return repositoryMetrics;
  }

}

export { TribeUseCase }
