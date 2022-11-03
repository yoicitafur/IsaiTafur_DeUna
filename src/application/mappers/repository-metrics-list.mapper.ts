import axios, { AxiosResponse } from "axios";
import config from '../../infrastructure/config';
import { MetricsModel, TribeModel } from "../../infrastructure/models";
import { findRepositoryVerificationTypesResponseDTO, IRepositoryVerificationType } from "../dtos/repository.dto";
import { IRepositoryMetrics } from "../dtos/tribe.dto";
import { RepositoryStatesResponseEnum } from "../enums/repository-states-response.enum";
import { RepositoryStatesEnum } from "../enums/repository-states.enum";
import { RepositoryVerificationStatesResponseEnum } from "../enums/repository-verification-states-response.enum";
import { RepositoryVerificationStatesEnum } from "../enums/repository-verification-states.enum";

class RepositoryMetricsListMapper {
  private _config: any;

  constructor() {
    this._config = config;
  }

  public async toTransformData(tribeEntity: TribeModel, repositoryMetricsList: MetricsModel[]): Promise<IRepositoryMetrics[]> {
    const repositories: IRepositoryMetrics[] = [];

    for (const metrics of repositoryMetricsList) {
      const repositoryVerificationState: IRepositoryVerificationType = await this._getRepositoryVerificationState(metrics.repository.id_repository);
      const repository: IRepositoryMetrics = {
        id: metrics.repository.id_repository.toString(),
        name: metrics.repository.name,
        tribe: tribeEntity.name,
        organization: tribeEntity.organization.name,
        coverage: `${metrics.coverage}%`,
        codeSmells: metrics.code_smells,
        bugs: metrics.bugs,
        vulnerabilities: metrics.vulnerabilities,
        hotspots: metrics.hotspot,
        verificationState: this._getNaturalRepositoryVerificationState(repositoryVerificationState.state),
        state: this._getNaturalRepositoryState(metrics.repository.state)
      }
      repositories.push(repository);
    }

    return repositories;
  }

  private async _getRepositoryVerificationState(repositoryId: number): Promise<IRepositoryVerificationType> {
    if (!this._config || !this._config.endpoints || !this._config.endpoints.REPOSITORY_VERIFICATION_STATES) {
      throw new Error('500: Endpoint to get repository verification states is not defined')
    }

    const url: string = `http://${this._config.app.domain}:${this._config.app.port}/${this._config.endpoints.REPOSITORY_VERIFICATION_STATES}`;
    const response: AxiosResponse<findRepositoryVerificationTypesResponseDTO> = await axios.get(url);
    const result: IRepositoryVerificationType = response.data.repositories.find(r => r.id === repositoryId);
    const repositoryVerificationCode: IRepositoryVerificationType = {
      id: repositoryId,
      state: result ? result.state : RepositoryVerificationStatesEnum.ON_HOLD
    }

    return repositoryVerificationCode;
  }

  private _getNaturalRepositoryVerificationState(verificationState: number) {
    const naturalRepositoryVerificationStateObject = {
      [RepositoryVerificationStatesEnum.APPROVED]: RepositoryVerificationStatesResponseEnum.APPROVED,
      [RepositoryVerificationStatesEnum.ON_HOLD]: RepositoryVerificationStatesResponseEnum.ON_HOLD,
      [RepositoryVerificationStatesEnum.VERIFIED]: RepositoryVerificationStatesResponseEnum.VERIFIED
    }

    return naturalRepositoryVerificationStateObject[verificationState];
  }

  private _getNaturalRepositoryState(state: string) {
    const naturalRepositoryStateObject = {
      [RepositoryStatesEnum.ARCHIVED]: RepositoryStatesResponseEnum.ARCHIVED,
      [RepositoryStatesEnum.DISABLED]: RepositoryStatesResponseEnum.DISABLED,
      [RepositoryStatesEnum.ENABLED]: RepositoryStatesResponseEnum.ENABLED
    }

    return naturalRepositoryStateObject[state];
  }

}

export { RepositoryMetricsListMapper }
