import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';
import columns from './BaseTableColumns/columns';

class UserToken1601940113364 implements MigrationInterface {
    private readonly tableName = 'user_token';

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.createTable(new Table({
        name: this.tableName,
        columns: [
          {
            name: 'user_token_id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'integer',
          },
          {
            name: 'token',
            type: 'varchar',
          },
          {
            name: 'type',
            type: 'varchar',
          },
          {
            name: 'used_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'expired_at',
            type: 'datetime',
          },
          ...columns,
        ],
      }), true);

      await queryRunner.createForeignKey(this.tableName, new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['user_id'],
        referencedTableName: 'user',
        onDelete: 'RESTRICT',
      }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropTable(this.tableName);
    }
}

export default UserToken1601940113364;
