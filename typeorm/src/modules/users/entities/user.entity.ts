import { CoreEntity } from 'src/common/entities';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class User extends CoreEntity {
  @Column({
    unique: true,
  })
  public email: string;

  @Column()
  public firstName: string;

  @Column()
  public lastName: string;

  @Column()
  public password: string;
}
