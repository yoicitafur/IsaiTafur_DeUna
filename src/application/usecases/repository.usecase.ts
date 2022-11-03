import { IRepositoryRepository } from "../../domain/repositories/repository.repository";
import { findRepositoryVerificationTypesResponseDTO } from "../dtos/repository.dto";

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
