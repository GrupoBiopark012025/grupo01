import { Entity, Opt, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryKey()
  id: string = uuidv4();

  @Property()
  @Unique()
  email: string;

  @Property({ hidden: true })
  password: string;

  @Property()
  firstName: string & Opt = '';

  @Property()
  lastName: string & Opt = '';

  @Property({ default: true })
  isActive: boolean & Opt = true;

  @Property({ type: 'datetime', defaultRaw: 'CURRENT_TIMESTAMP' })
  createdAt: Date & Opt = new Date();
}
