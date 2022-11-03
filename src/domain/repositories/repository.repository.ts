import { IRepositoryVerificationType } from "../../application/dtos";

interface IRepositoryRepository {
  findRepositoryVerificationTypes(): Promise<IRepositoryVerificationType[]>
}

export { IRepositoryRepository }
