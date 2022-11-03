import { IRepositoryMetricsParams } from "../../application/interfaces/tribe.interface";
import { IRepositoryMetrics } from "../../application/dtos/tribe.dto";

interface ITribeRepository {
  findRepositoryMetrics(id: number, params: IRepositoryMetricsParams): Promise<IRepositoryMetrics[]>;
}

export { ITribeRepository }
