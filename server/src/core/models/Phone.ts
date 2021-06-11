import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
} from 'typeorm'



@Entity()
export default class Phone extends BaseEntity {


    @PrimaryGeneratedColumn()
    id!: string

    @Column({ nullable: false })
    name!: string

    @Column({ nullable: false })
    price!: number

    @CreateDateColumn()
    createdAt!: string

    @UpdateDateColumn()
    updatedAt!: string

    public toJSON(): Phone {
        const json: Phone = Object.assign({}, this)
        return json
    }
}
