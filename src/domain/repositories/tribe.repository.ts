import { IRepositoryMetricsParams } from "../../application/interfaces";
import { IRepositoryMetrics } from "../../application/dtos";

interface ITribeRepository {
  findRepositoryMetrics(id: number, params: IRepositoryMetricsParams): Promise<IRepositoryMetrics[]>;
}

export { ITribeRepository }
