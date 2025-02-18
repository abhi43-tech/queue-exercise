import { string } from "joi";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity() 
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true
  })
  username: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  password: string;

  @Column({
    type: 'simple-array',
    nullable: true,
  })  
  subscribe?: number[];
}