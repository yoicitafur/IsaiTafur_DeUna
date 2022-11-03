interface findRepositoryVerificationTypesResponseDTO {
  repositories: IRepositoryVerificationType[];
}

interface IRepositoryVerificationType {
  id: number;
  state: number;
}

export { IRepositoryVerificationType, findRepositoryVerificationTypesResponseDTO }
