import { Resolver, Mutation, Arg } from 'type-graphql';
import ForgotPassword from '../../../logic/user/ForgotPassword';

@Resolver()
class ForgotPasswordResolver {
  @Mutation(() => String)
  async forgotPassword(@Arg('email') email: string): Promise<string> {
    const forgotPassword = new ForgotPassword(email);
    await forgotPassword.getToken();
    return 'Please, review your email';
  }
}

export default ForgotPasswordResolver;
