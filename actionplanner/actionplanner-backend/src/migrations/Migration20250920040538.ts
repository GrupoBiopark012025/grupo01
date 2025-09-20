import { Migration } from '@mikro-orm/migrations';

export class Migration20250920040538 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" varchar(255) not null, "email" varchar(255) not null, "password" varchar(255) not null, "first_name" varchar(255) null, "last_name" varchar(255) null, "is_active" boolean not null default true, "created_at" timestamptz not null default CURRENT_TIMESTAMP, constraint "user_pkey" primary key ("id"));`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "user" cascade;`);
  }

}
