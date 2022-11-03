import { MetricsModel, OrganizationModel, RepositoryModel, TribeModel } from "../../infrastructure/models";

interface IOrganizationInfoBase {
  organizationInfo: OrganizationModel;
  tribeInfoList: TribeModel[];
  repositoryInfoList: RepositoryModel[];
  metricsInfoList: MetricsModel[];
}

interface IOrganizationsInfoBase {
  organizationInfoList: OrganizationModel[];
  tribeInfoList: TribeModel[];
  repositoryInfoList: RepositoryModel[];
  metricsInfoList: MetricsModel[];
}

export { IOrganizationInfoBase, IOrganizationsInfoBase }
