import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm"
import { RepositoryModel } from "."

@Entity({ name: 'metrics' })
class MetricsModel {
    @PrimaryGeneratedColumn()
    id_repository: number

    @Column({ type: 'decimal', nullable: false })
    coverage: number

    @Column({ type: 'int', nullable: false })
    bugs: number

    @Column({ type: 'int', nullable: false })
    vulnerabilities: number

    @Column({ type: 'int', nullable: false })
    hotspot: number

    @Column({ type: 'int', nullable: false })
    code_smells: number

    @OneToOne(() => RepositoryModel, repository => repository.metrics, {
        onDelete: 'CASCADE'
    })
    @JoinColumn()
    repository: RepositoryModel
}


export { MetricsModel };
