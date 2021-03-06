import {
  Field, ObjectType, Int, Float,
} from 'type-graphql';
import {
  CreateDateColumn, BeforeInsert, BeforeUpdate, BaseEntity,
} from 'typeorm';

import Auth from 'src/util/session/Auth';

@ObjectType()
class BaseDataEntity extends BaseEntity {
    @Field(() => Float)
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @Field(() => Float)
    @CreateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Field(() => Int, { nullable: true })
    @CreateDateColumn({ name: 'created_by', nullable: true })
    createdBy?: number;

    @Field(() => Int, { nullable: true })
    @CreateDateColumn({ name: 'updated_by', nullable: true })
    updatedBy?: number;

    /**
     * Update the updated at and the updated by
     */
    @BeforeInsert()
    @BeforeUpdate()
    protected updateRowAt() {
      this.updatedAt = new Date();
      const data = Auth.sessionOrEmpty();
      this.updatedBy = data ? data.user.id : undefined;
    }

    /**
     * Update the created at and the created by
     */
    @BeforeInsert()
    protected insertRowAt() {
      this.createdAt = new Date();
      const data = Auth.sessionOrEmpty();
      if (data) {
        this.createdBy = data.user.id;
      }
    }
}

export default BaseDataEntity;
