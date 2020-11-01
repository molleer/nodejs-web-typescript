import {
  Resolver, Mutation, UseMiddleware, Arg, Int,
} from 'type-graphql';
import { __ } from 'i18n';

import isAuth from '../../../util/graphql/isAuth';
import MessageError from '../../../util/exceptions/MessageError';
import User from '../../../db/entities/User';
import UserUpdatePassword from '../../../logic/user/UserUpdatePassword';

@Resolver()
class UserUpdatePasswordResolver {
  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async userUpdatePassword(
    @Arg('userID', () => Int) userID: number,
    @Arg('password', () => String) password: string,
  ): Promise<User> {
    const user = await User.findOne(userID);
    if (!user) {
      throw new MessageError(__('The item %s does not exists', `${userID}`));
    }
    const updateEmail = new UserUpdatePassword(user);
    await updateEmail.update(password);
    return user;
  }
}

export default UserUpdatePasswordResolver;
