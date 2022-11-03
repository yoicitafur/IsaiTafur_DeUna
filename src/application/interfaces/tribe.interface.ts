import { RepositoryStatesEnum } from "../enums";

interface ITribeDetail {
  id: number;
  name: string;
  status: number;
  organizationId: number;
}

interface IRepositoryMetricsParams {
  from: Date;
  to: Date;
  state: RepositoryStatesEnum;
  coverageAbove: number;
}

export { ITribeDetail, IRepositoryMetricsParams }
