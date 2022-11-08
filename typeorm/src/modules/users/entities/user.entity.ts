import { Expose } from 'class-transformer';
import { CoreEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';
import { UserRole } from '../enums';

@Entity({ name: 'users' })
export class User extends CoreEntity {
  @Expose()
  @Column({
    unique: true,
  })
  public email: string;

  @Expose()
  @Column()
  public firstName: string;

  @Expose()
  @Column()
  public lastName: string;

  @Column()
  public password: string;

  @Expose()
  @Column({
    type: 'simple-enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  public role: UserRole;
}
