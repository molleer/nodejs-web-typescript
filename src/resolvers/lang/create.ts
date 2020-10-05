import {
  Resolver, Mutation, Arg,
} from 'type-graphql';

import Lang from '../../db/entities/Lang';
import { LangInput, rules } from '../input/LangInput';
import { getFieldErrors } from '../../util/validatorjs';
import ValidatorError from '../../util/exceptions/ValidatorError';

@Resolver()
class LangCreateResolver {
  @Mutation(() => Lang)
  async langCreate(@Arg('options') options: LangInput): Promise<Lang> {
    const errors = await getFieldErrors(options, rules);
    if (errors) {
      throw new ValidatorError(errors);
    }

    const lang = new Lang();
    lang.langID = options.langID;
    lang.name = options.name;
    lang.localname = options.localname;
    lang.isBlocked = options.isBlocked ?? false;
    lang.active = options.active ?? false;
    await lang.save();

    return lang;
  }
}

export default LangCreateResolver;
