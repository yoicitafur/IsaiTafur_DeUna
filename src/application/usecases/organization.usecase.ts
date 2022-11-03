import { IOrganizationRepository } from "../../domain/repositories/organization.repository";
import { createOrganizationRequestDTO, createOrganizationResponseDTO, deleteOrganizationResponseDTO, editOrganizationRequestDTO, editOrganizationResponseDTO, findOrganizationInfoResponseDTO } from "../dtos/organization.dto";

class OrganizationUseCase {

  constructor(private readonly organizationRepository: IOrganizationRepository) {}

  public async createOrganization(data: createOrganizationRequestDTO): Promise<createOrganizationResponseDTO> {
    await this.organizationRepository.createOrganization(data);

    return {
      message: 'Organization has been created successfully'
    };
  }

  public async editOrganization(organizationId: number, data: editOrganizationRequestDTO): Promise<editOrganizationResponseDTO> {
    await this.organizationRepository.updateOrganization(organizationId, data);

    return {
      message: 'Organization has been updated successfully'
    };
  }

  public async getOrganizationInfoList(): Promise<findOrganizationInfoResponseDTO[]> {
    const organizationSet = await this.organizationRepository.findOrganizations();

    return organizationSet;
  }

  public async getOrganizationInfo(organizationId: number): Promise<findOrganizationInfoResponseDTO> {
    const organization = await this.organizationRepository.findOrganizationById(organizationId);

    return organization;
  }

  public async deleteOrganization(organizationId: number): Promise<deleteOrganizationResponseDTO> {
    await this.organizationRepository.deleteOrganizationById(organizationId);

    return {
      message: 'Organization has been deleted successfully'
    };
  }

}

export { OrganizationUseCase }
