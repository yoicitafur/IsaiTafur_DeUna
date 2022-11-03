import { IRepositoryVerificationType } from "../../../application/dtos/repository.dto";
import { IRepositoryRepository } from "../../../domain/repositories/repository.repository";

class RepositoryMockRepo implements IRepositoryRepository {

  public async findRepositoryVerificationTypes(): Promise<IRepositoryVerificationType[]> {
    const repositories: IRepositoryVerificationType[] = [
      {
        id: 1,
        state: 604
      },
      {
        id: 2,
        state: 605
      },
      {
        id: 3,
        state: 606
      },
      {
        id: 4,
        state: 606
      },
      {
        id: 5,
        state: 606
      },
      {
        id: 6,
        state: 606
      },
      {
        id: 7,
        state: 606
      },
      {
        id: 8,
        state: 606
      },
      {
        id: 9,
        state: 606
      },
      {
        id: 10,
        state: 606
      },
      {
        id: 11,
        state: 606
      },
      {
        id: 12,
        state: 606
      },
      {
        id: 13,
        state: 606
      },
      {
        id: 14,
        state: 606
      },
      {
        id: 15,
        state: 606
      },
      {
        id: 16,
        state: 606
      },
      {
        id: 17,
        state: 606
      },
      {
        id: 18,
        state: 606
      },
      {
        id: 19,
        state: 606
      }
    ];

    return repositories;
  }

}

export { RepositoryMockRepo }
