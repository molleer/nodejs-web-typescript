// eslint-disable-next-line max-classes-per-file
import {
  Resolver, Mutation, Arg, ObjectType, Int,
} from 'type-graphql';
import { __ } from 'i18n';

import MessageType from 'src/graphql/type/MessageType.enum';
import TextInputBase from '../../input/TextInputCreate';
import MessageResponse from 'src/graphql/type/MessageResponse';
import Translation from 'src/db/entities/Translation';
import TranslationUpdate from 'src/logic/translation/TranslationUpdate';
import TextsUpdateEmpty from 'src/logic/translation/TextsUpdateEmpty';
import MessageError from 'src/util/exceptions/MessageError';
import roles from 'src/logic/role/role.enum';
import isAuthRolesGraphQL from 'src/util/graphql/isAuthRolesGraphQL';
import Auth from 'src/util/session/Auth';
import { isSuperAdmin } from 'src/logic/userRole/verifyRolesUser';

@ObjectType()
class TranslationUpdateResponse extends MessageResponse(Translation) {}

@Resolver()
export default class TranslationUpdateResolver {
  @isAuthRolesGraphQL([roles.superAdmin, roles.admin])
  @Mutation(() => TranslationUpdateResponse)
  async translationUpdate(
    @Arg('id', () => Int) id: number,
    @Arg('texts', () => [TextInputBase]) texts: TextInputBase[],
    @Arg('code', { nullable: true }) code: string,
    @Arg('isBlocked', { nullable: true }) isBlocked: boolean,
  ): Promise<TranslationUpdateResponse> {
    const translation = await Translation.findOne(id);
    if (!translation) {
      throw new MessageError(__('The item %s does not exists', `${id}`));
    }

    if (translation.isBlocked && !isSuperAdmin(Auth.session().user.roles)) {
      await (new TextsUpdateEmpty(translation.id)).save(texts);
      return {
        data: translation,
        message: {
          message: __('Only empty texts were updated in the item %s', `${translation.id}`),
          type: MessageType.warning,
        },
      };
    }

    const translationUpdated = await (new TranslationUpdate(
      translation,
      texts,
    )).save({ code, isBlocked });

    return {
      data: translationUpdated,
      message: {
        message: __('The item %s was updated', `${translationUpdated.id}`),
        type: MessageType.success,
      },
    };
  }
}
