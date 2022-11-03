import { IRepositoryRepository } from "../../domain/repositories";
import { findRepositoryVerificationTypesResponseDTO } from "../dtos";

class RepositoryUseCase {

  constructor(private readonly repositoryRepository: IRepositoryRepository) {}

  public async getVerificationCodes(): Promise<findRepositoryVerificationTypesResponseDTO> {
    const repositories = await this.repositoryRepository.findRepositoryVerificationTypes();

    return {
      repositories
    };
  }
}

export { RepositoryUseCase }
