import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity({ name: 'organization' })
class OrganizationModel {
    @PrimaryGeneratedColumn()
    id_organization: number

    @Column({ type: 'varchar', nullable: false, length: 50 })
    name: string

    @Column({ type: 'int', nullable: false })
    status: number

}


export { OrganizationModel };
