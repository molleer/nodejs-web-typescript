import GenericTestData from 'src/tests/config/GenericTestData';
import getFakerUser from 'src/db/factories/user.factory';
import UserToken from 'src/logic/user/session/UserToken';
import UserTokenEnum from 'src/logic/user/session/UserTokenEnum';

export default class ActivateEmailTest implements GenericTestData {
  async resolver() {
    // create a user
    const user = getFakerUser();
    await user.save();
    // add token to activate email
    const userToken = new UserToken(user.id);
    const token = await userToken.newToken(48, UserTokenEnum.ACTIVATE_EMAIL);
    return {
      query: `mutation activateEmail($token: String!) {
        activateEmail(token: $token)
      }`,
      variables: {
        token: token.token,
      },
    };
  }

  rules() {
    return {
      activateEmail: 'required|string',
    };
  }
}
