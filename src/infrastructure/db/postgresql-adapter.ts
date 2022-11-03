import { DataSource } from "typeorm";
import config from '../config';
import { URL } from "url";
import { MetricsModel, OrganizationModel, RepositoryModel, TribeModel } from "../models";

const dbUrl = new URL(config.db.postgresql.connectionString);
const routingId = dbUrl.searchParams.get("options");
dbUrl.searchParams.delete("options");

export const DatabaseService: DataSource = new DataSource(
  {
    type: 'cockroachdb',
    url: dbUrl.toString(),
    ssl: true,
    synchronize: config.db.postgresql.synchronize ?? false,
    extra: {
      options: routingId
    },
    entities: [OrganizationModel, TribeModel, RepositoryModel, MetricsModel]
  }
)
