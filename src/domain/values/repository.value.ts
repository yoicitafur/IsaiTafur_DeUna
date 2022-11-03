import { IRepositoryEntity } from "../entities/repository.entity";

class RepositoryValue implements IRepositoryEntity {
  uuid: number;
  tribeId: number;
  state: string;
  status: string;

  constructor({ tribeId, state, status }: { tribeId: number; state: string; status: string; }) {
    this.uuid = 1;
    this.tribeId = tribeId;
    this.state = state;
    this.status = status;
  }

}

export { RepositoryValue }
