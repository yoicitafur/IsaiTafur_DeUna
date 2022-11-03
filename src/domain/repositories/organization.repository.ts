import { createOrganizationRequestDTO, editOrganizationRequestDTO, findOrganizationInfoResponseDTO } from "../../application/dtos";

interface IOrganizationRepository {
  createOrganization(data: createOrganizationRequestDTO): Promise<void>;
  updateOrganization(id: number, data: editOrganizationRequestDTO): Promise<void>;
  findOrganizations(): Promise<findOrganizationInfoResponseDTO[]>;
  findOrganizationById(id: number): Promise<findOrganizationInfoResponseDTO>;
  deleteOrganizationById(id: number): Promise<void>;
}

export { IOrganizationRepository }
