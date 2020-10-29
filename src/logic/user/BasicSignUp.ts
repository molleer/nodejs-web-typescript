import { arg, validateClass } from 'validatorjs-decorator/dist';
import User from '../../db/entities/User';
import Email from '../../util/email/Email';
import UserName from './UserName';
import UserToken from './UserToken';
import UserTokenEnum from './UserTokenEnum';

@validateClass()
class BasicSignUp {
  private readonly firstName: string;

  private readonly lastName: string;

  private readonly email: string;

  private readonly password: string;

  public constructor(
    @arg('firstName', 'required|string') firstName: string,
    @arg('lastName', 'required|string') lastName: string,
    @arg('email', 'required|email') email: string,
    @arg('password', 'required|min:4|strict_password') password: string,
  ) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
  }

  async save() {
    const user = new User();
    user.email = this.email;
    user.firstName = this.firstName;
    user.lastName = this.lastName;
    user.password = this.password;
    await user.save();

    const userToken = new UserToken(user.userID);
    const link = await userToken.tokenLink(48, UserTokenEnum.ACTIVATE_EMAIL);
    const name = (new UserName(user)).getFullName();
    const email = new Email('emails.activateAccount');
    await email.send({ to: this.email }, { name, link });
    return user;
  }
}

export default BasicSignUp;