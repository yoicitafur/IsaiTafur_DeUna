import { IRepositoryVerificationType } from "../../application/dtos/repository.dto";

interface IRepositoryRepository {
  findRepositoryVerificationTypes(): Promise<IRepositoryVerificationType[]>
}

export { IRepositoryRepository }
