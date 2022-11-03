import { RegistryStatusEnum, RepositoryStatesEnum } from "../enums";

interface createOrganizationRequestDTO {
  organization: IOrganization;
}

interface createOrganizationResponseDTO {
  message: string;
}

interface editOrganizationRequestDTO {
  organization: IOrganization;
}

interface editOrganizationResponseDTO {
  message: string;
}

interface findOrganizationInfoResponseDTO {
  organization: IOrganization;
}

interface deleteOrganizationResponseDTO {
  message: string;
}

interface IOrganization {
  id?: number;
  name: string;
  status: number;
  tribes: ITribe[];
}

interface ITribe {
  id?: number;
  name: string;
  status: number;
  repositories: IRepository[];
}

interface IRepository {
  id?: number;
  name: string;
  state: RepositoryStatesEnum;
  status: RegistryStatusEnum;
  createdOn?: string;
  metrics: IMetrics;
}

interface IMetrics {
  id?: number;
  coverage: number | string;
  bugs: number;
  vulnerabilities: number;
  hotspot: number;
  codeSmells: number;
}

export {
  IOrganization,
  ITribe,
  IRepository,
  IMetrics,
  createOrganizationRequestDTO,
  createOrganizationResponseDTO,
  editOrganizationRequestDTO,
  editOrganizationResponseDTO,
  findOrganizationInfoResponseDTO,
  deleteOrganizationResponseDTO
}
