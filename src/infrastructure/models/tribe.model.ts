import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm"
import { OrganizationModel } from "."

@Entity({ name: 'tribe' })
class TribeModel {
    @PrimaryGeneratedColumn()
    id_tribe: number

    @Column({ type: 'varchar', nullable: false, length: 50 })
    name: string

    @Column({ type: 'int', nullable: false })
    status: number

    @ManyToOne(() => OrganizationModel, (organization) => organization.id_organization, {
        nullable: false,
        onDelete: 'CASCADE'
    })
    organization: OrganizationModel

}


export { TribeModel };
