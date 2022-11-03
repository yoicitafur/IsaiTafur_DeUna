import { MetricsModel, OrganizationModel, RepositoryModel, TribeModel } from "src/infrastructure/models";
import { findOrganizationInfoResponseDTO, IMetrics, IOrganization, IRepository, ITribe } from "../dtos/organization.dto";
import { IOrganizationInfoBase } from "../interfaces/organization.interface";

class OrganizationDetailMapper {

  public toTransformData(organizationInfoBase: IOrganizationInfoBase): findOrganizationInfoResponseDTO {
    const { organizationInfo, tribeInfoList, repositoryInfoList, metricsInfoList } = organizationInfoBase;
    const organization: IOrganization = this.getOrganization(organizationInfo, tribeInfoList, repositoryInfoList, metricsInfoList)
    const response: findOrganizationInfoResponseDTO = { organization }

    return response;
  }

  private getOrganization(organizationBase: OrganizationModel, _tribes: TribeModel[], _repositories: RepositoryModel[], _metricsList: MetricsModel[]): IOrganization {
    const organization: IOrganization = {
      id: organizationBase.id_organization,
      name: organizationBase.name,
      status: organizationBase.status,
      tribes: this.getTribes(_tribes, _repositories, _metricsList)
    }

    return organization;
  }

  private getTribes(_tribes: TribeModel[], _repositories: RepositoryModel[], _metricsList: MetricsModel[]): ITribe[] {
    const tribes: ITribe[] = [];
    for (const tribeBase of _tribes) {
      const tribe: ITribe = {
        id: tribeBase.id_tribe,
        name: tribeBase.name,
        status: tribeBase.status,
        repositories: this.getRepositories(tribeBase.id_tribe, _repositories, _metricsList)
      }
      tribes.push(tribe);
    }

    return tribes;
  }

  private getRepositories(tribeId: number, _repositories: RepositoryModel[], _metricsList: MetricsModel[]): IRepository[] {
    const repositories: IRepository[] = [];
    for (const repositoryBase of _repositories) {
      if (repositoryBase.tribe.id_tribe !== tribeId) {
        continue;
      }
      const repository: IRepository = {
        id: repositoryBase.tribe.id_tribe,
        name: repositoryBase.name,
        state: repositoryBase.state,
        status: repositoryBase.status,
        createdOn: repositoryBase.create_time.toISOString(),
        metrics: this.getMetrics(repositoryBase.id_repository, _metricsList)
      }
      repositories.push(repository);
    }

    return repositories;
  }

  private getMetrics(repositoryId: number, _metricsList: MetricsModel[]): IMetrics {
    const metricsBase: MetricsModel = _metricsList.find(m => m.id_repository === repositoryId);
    const metrics: IMetrics = {
      id: metricsBase.id_repository,
      coverage: `${metricsBase.coverage}%`,
      bugs: metricsBase.bugs,
      vulnerabilities: metricsBase.vulnerabilities,
      hotspot: metricsBase.hotspot,
      codeSmells: metricsBase.code_smells
    }

    return metrics;
  }

}

export { OrganizationDetailMapper }
