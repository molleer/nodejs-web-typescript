// eslint-disable-next-line max-classes-per-file
import { __ } from 'i18n';
import {
  Resolver, Mutation, Arg, UseMiddleware, ObjectType,
} from 'type-graphql';
import { getManager } from 'typeorm';

import MessageResponse from 'src/graphql/type/MessageResponse';
import MessageType from 'src/graphql/type/MessageType.enum';
import Lang from 'src/db/entities/Lang';
import isAuth from 'src/util/graphql/isAuth';
import Validate from 'src/util/validatorjs/validateGraphQL';

@ObjectType()
class LangCreateResponse extends MessageResponse(Lang) {}

const { tablePath } = getManager().getRepository(Lang).metadata;
@Resolver()
class LangCreateResolver {
  @Mutation(() => LangCreateResponse)
  @UseMiddleware(isAuth)
  @Validate({
    id: `required|string|unique:${tablePath},id`,
    name: 'required|string',
    localname: 'required|string|min:1',
    active: 'boolean',
    isBlocked: 'boolean',
  })
  async langCreate(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Arg('localname') localname: string,
    @Arg('active', { nullable: true, defaultValue: false }) active: boolean,
    @Arg('isBlocked', { nullable: true, defaultValue: false }) isBlocked: boolean,
  ): Promise<LangCreateResponse> {
    const lang = new Lang();
    lang.id = id;
    lang.name = name;
    lang.localname = localname;
    lang.isBlocked = isBlocked ?? false;
    lang.active = active ?? false;
    await lang.save();
    return {
      data: lang,
      message: {
        message: __('The item %s was created', `${id}`),
        type: MessageType.success,
      },
    };
  }
}

export default LangCreateResolver;
