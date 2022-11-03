import { RegistryStatusEnum } from "../../application/enums/registry-status.enum"
import { RepositoryStatesEnum } from "../../application/enums/repository-states.enum"
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToOne, JoinColumn } from "typeorm"
import { MetricsModel, TribeModel } from "."

@Entity({ name: 'repository' })
class RepositoryModel {
    @PrimaryGeneratedColumn()
    id_repository: number

    @Column({ type: 'varchar', nullable: false, length: 50 })
    name: string

    @Column({ type: 'varchar', enum: RepositoryStatesEnum, nullable: false, length: 1 })
    state: RepositoryStatesEnum

    @Column({ type: 'timestamptz', nullable: false, default: () => 'now()' })
    create_time: Date;

    @Column({ type: 'varchar', enum: RegistryStatusEnum, nullable: false, length: 1 })
    status: RegistryStatusEnum

    @OneToOne(() => MetricsModel, {
      onDelete: 'CASCADE'
    })
    metrics!: MetricsModel;

    @ManyToOne(() => TribeModel, {
      nullable: false,
      onDelete: 'CASCADE'
    })
    tribe: TribeModel

}


export { RepositoryModel };
