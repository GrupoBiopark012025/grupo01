import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  id!: uuid.v4();

  @Property()
  username!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;
}
