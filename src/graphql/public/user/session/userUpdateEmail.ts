// eslint-disable-next-line max-classes-per-file
import { __ } from 'i18n';
import {
  Resolver, Mutation, UseMiddleware, Arg, Int, ObjectType,
} from 'type-graphql';

import isAuth from '../../../../util/graphql/isAuth';
import MessageError from '../../../../util/exceptions/MessageError';
import User from '../../../../db/entities/User';
import UserUpdateEmail from '../../../../logic/user/session/UserUpdateEmail';
import MessageResponse from '../../../type/MessageResponse';
import MessageType from '../../../type/MessageType.enum';

@ObjectType()
class UserUpdateEmailResponse extends MessageResponse(User) {}

@Resolver()
class UserUpdateEmailResolver {
  @Mutation(() => UserUpdateEmailResponse)
  @UseMiddleware(isAuth)
  async userUpdateEmail(
    @Arg('userID', () => Int) userID: number,
    @Arg('email', () => String) email: string,
  ): Promise<UserUpdateEmailResponse> {
    const user = await User.findOne(userID);
    if (!user) {
      throw new MessageError(__('The item %s does not exists', `${userID}`));
    }
    const updateEmail = new UserUpdateEmail(user);
    await updateEmail.update(email);
    return {
      data: user,
      message: {
        message: __('The item %s was updated', `${userID}`),
        type: MessageType.success,
      },
    };
  }
}

export default UserUpdateEmailResolver;