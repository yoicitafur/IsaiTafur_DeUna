import { In, Repository } from "typeorm";
import { DatabaseService } from "../../../infrastructure/db";
import { IOrganizationRepository } from "../../../domain/repositories";
import { OrganizationDetailMapper, OrganizationListMapper } from "../../../application/mappers";
import { MetricsModel, OrganizationModel, RepositoryModel, TribeModel } from "../../../infrastructure/models";
import { createOrganizationRequestDTO, editOrganizationRequestDTO, findOrganizationInfoResponseDTO, IRepository, ITribe } from "../../../application/dtos";

class OrganizationPostgresqlRepo implements IOrganizationRepository {
  private organizationRepo: Repository<OrganizationModel>;
  private tribeRepo: Repository<TribeModel>;
  private repositoryRepo: Repository<RepositoryModel>;
  private metricsRepo: Repository<MetricsModel>;
  private organizationListMapper: OrganizationListMapper;
  private organizationDetailMapper: OrganizationDetailMapper;

  constructor() {
    this.organizationRepo = DatabaseService.getRepository(OrganizationModel);
    this.tribeRepo = DatabaseService.getRepository(TribeModel);
    this.repositoryRepo = DatabaseService.getRepository(RepositoryModel);
    this.metricsRepo = DatabaseService.getRepository(MetricsModel);
    this.organizationListMapper = new OrganizationListMapper();
    this.organizationDetailMapper = new OrganizationDetailMapper();
  }

  public async createOrganization(data: createOrganizationRequestDTO): Promise<void> {
    await DatabaseService.transaction(async (transactionalEntityManager) => {
      const { organization } = data;
      const tribes: ITribe[] = organization.tribes;

      const organizationEntity: OrganizationModel = new OrganizationModel();
      organizationEntity.name = organization.name;
      organizationEntity.status = organization.status;
      const organizationSavedResult: OrganizationModel = await transactionalEntityManager.save(organizationEntity);

      for (const tribe of tribes) {
        const tribeEntity: TribeModel = new TribeModel();
        tribeEntity.organization = organizationSavedResult;
        tribeEntity.name = tribe.name;
        tribeEntity.status = tribe.status;
        const tribeSavedResult: TribeModel = await transactionalEntityManager.save(tribeEntity);

        const repositories: IRepository[] = tribe.repositories;
        if (repositories.length > 0) {
          for (const repository of repositories) {
            const repositoryEntity: RepositoryModel = new RepositoryModel();
            repositoryEntity.tribe = tribeSavedResult;
            repositoryEntity.name = repository.name;
            repositoryEntity.state = repository.state;
            repositoryEntity.status = repository.status;
            const repositorySavedResult = await transactionalEntityManager.save(repositoryEntity);

            const metricsEntity: MetricsModel = new MetricsModel();
            metricsEntity.repository = repositorySavedResult;
            metricsEntity.bugs = repository.metrics.bugs;
            metricsEntity.code_smells = repository.metrics.codeSmells;
            metricsEntity.coverage = repository.metrics.coverage as number;
            metricsEntity.hotspot = repository.metrics.hotspot;
            metricsEntity.vulnerabilities = repository.metrics.vulnerabilities;
            await transactionalEntityManager.save(metricsEntity);
          }
        }
      }

    });
  }

  public async updateOrganization(id: number, data: editOrganizationRequestDTO): Promise<void> {
    const { organization } = data;

    const organizationEntity: OrganizationModel = await this.organizationRepo.findOneBy({ id_organization: id });
    organization.name = organization.name;
    organization.status = organization.status;

    const tribes: ITribe[] = organization.tribes;
    const tribeEntities: TribeModel[] = await this.tribeRepo.find({
      where: {
        organization: organizationEntity
      }
    });
    const repositoryEntities: RepositoryModel[] = [];
    const metricsEntities: MetricsModel[] = [];

    for (const tribeEntity of tribeEntities) {
      const _tribe: ITribe = tribes.find(t => t.id === tribeEntity.id_tribe);
      if (_tribe) {
        tribeEntity.name = _tribe.name;
        tribeEntity.status = _tribe.status;

        const repositoryEntitiesOfThisTribe: RepositoryModel[] = await this.repositoryRepo.find({
          where: {
            tribe: tribeEntity
          }
        });

        if (repositoryEntitiesOfThisTribe.length > 0) {
          for (const repositoryEntity of repositoryEntitiesOfThisTribe) {
            const _repository: IRepository = _tribe.repositories.find(r => r.id === repositoryEntity.id_repository);
            if (_repository) {
              repositoryEntity.name = _repository.name;
              repositoryEntity.state = _repository.state;
              repositoryEntity.status = _repository.status;
              repositoryEntities.push(repositoryEntity);

              const metricsEntityOFThisRepository: MetricsModel = await this.metricsRepo.findOne({
                where: {
                  id_repository: _repository.id
                }
              });

              if (metricsEntityOFThisRepository) {
                metricsEntityOFThisRepository.bugs = _repository.metrics.bugs;
                metricsEntityOFThisRepository.code_smells = _repository.metrics.codeSmells;
                metricsEntityOFThisRepository.coverage = _repository.metrics.coverage as number;
                metricsEntityOFThisRepository.hotspot = _repository.metrics.hotspot;
                metricsEntityOFThisRepository.vulnerabilities = _repository.metrics.vulnerabilities;
                metricsEntities.push(metricsEntityOFThisRepository);
              }
            }
          }
        }
      }
    }


    await DatabaseService.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.save(organizationEntity);
      await transactionalEntityManager.save(tribeEntities);
      await transactionalEntityManager.save(repositoryEntities);
      await transactionalEntityManager.save(metricsEntities);
    });

  }

  public async findOrganizations(): Promise<findOrganizationInfoResponseDTO[]> {
    const organizations: OrganizationModel[] = await this.organizationRepo.find({});
    const tribes: TribeModel[] = await this.tribeRepo.find({ relations: { organization: true } });
    const repositories: RepositoryModel[] = await this.repositoryRepo.find({ relations: { tribe: true } });
    const metrics: MetricsModel[] = await this.metricsRepo.find({});

    const organizationInfoList: findOrganizationInfoResponseDTO[] = this.organizationListMapper.toTransformData({
      organizationInfoList: organizations,
      tribeInfoList: tribes,
      repositoryInfoList: repositories,
      metricsInfoList: metrics
    });

    return organizationInfoList;
  }

  public async findOrganizationById(id: number): Promise<findOrganizationInfoResponseDTO> {
    const organization: OrganizationModel = await this.organizationRepo.findOneBy({ id_organization: id });
    const tribes: TribeModel[] = await this.tribeRepo.find({
      where: {
        organization: {
          id_organization: id
        }
      },
      relations: { organization: true }
    });
    const repositories: RepositoryModel[] = await this.repositoryRepo.find({
      where: {
        tribe: {
          id_tribe: In(tribes.map(t => t.id_tribe))
        }
      },
      relations: { tribe: true }
    });
    const metrics: MetricsModel[] = await this.metricsRepo.find({
      where: {
        repository: {
          id_repository: In(repositories.map(r => r.id_repository))
        }
      },
      relations: { repository: true }
    });

    const organizationInfo: findOrganizationInfoResponseDTO = this.organizationDetailMapper.toTransformData({
      organizationInfo: organization,
      tribeInfoList: tribes,
      repositoryInfoList: repositories,
      metricsInfoList: metrics
    });

    return organizationInfo;
  }

  public async deleteOrganizationById(id: number): Promise<void> {
    await this.organizationRepo.delete({ id_organization: id })
  }

}

export { OrganizationPostgresqlRepo }
