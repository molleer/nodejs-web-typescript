import {
  Controller, Param, Get,
} from 'routing-controllers';
import Lang from '../../db/entities/Lang';
import Paginate from '../../util/db/paginate';
import MessageError from '../../util/exceptions/MessageError';

@Controller()
export default class LangController {
  @Get('/langs')
  getAll() {
    return (new Paginate(Lang.createQueryBuilder())).get();
  }

  @Get('/langs/:langID')
  async getOne(@Param('langID') langID: string) {
    const lang = await Lang.findOne(langID);
    if (!lang) {
      throw new MessageError(`The lang ${langID} doesn't exists`);
    }
    return lang;
  }
}
