// eslint-disable-next-line max-classes-per-file
import { __ } from 'i18n';
import {
  Resolver, Mutation, UseMiddleware, Arg, ObjectType,
} from 'type-graphql';

import MessageResponse from 'src/graphql/type/MessageResponse';
import MessageType from 'src/graphql/type/MessageType.enum';
import Auth from 'src/util/session/Auth';
import isAuth from 'src/util/graphql/isAuth';
import UserUpdatePassword from 'src/logic/user/session/UserUpdatePassword';
import User from 'src/db/entities/User';

@ObjectType()
class ProfileUpdatePasswordResponse extends MessageResponse(User) {}

@Resolver()
export default class ProfileUpdatePasswordResolver {
  @Mutation(() => ProfileUpdatePasswordResponse)
  @UseMiddleware(isAuth)
  async profileUpdatePassword(
    @Arg('password', () => String) password: string,
    @Arg('newPassword', () => String) newPassword: string,
  ): Promise<ProfileUpdatePasswordResponse> {
    const { user } = Auth.session();
    const updatePassword = new UserUpdatePassword(user);
    await updatePassword.update(newPassword, password);
    return {
      data: user,
      message: {
        message: __('The item %s was updated', ''),
        type: MessageType.success,
      },
    };
  }
}
