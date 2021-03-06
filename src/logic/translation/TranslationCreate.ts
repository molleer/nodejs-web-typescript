import { v4 as uuidv4 } from 'uuid';

import Translation from 'src/db/entities/Translation';
import TextsCreate from './TextsCreate';
import TextInputCreate from '../../graphql/input/TextInputCreate';

interface TranslationCreateSave {
  code?: string;
  isBlocked?: boolean;
}

export default class TranslationCreate {
  private texts: TextInputCreate[];

  public constructor(texts: TextInputCreate[]) {
    this.texts = texts;
  }

  async save(options: TranslationCreateSave = {}): Promise<Translation> {
    const translation = await this.saveTranslation(options);
    await (new TextsCreate(translation.id)).save(this.texts);
    return translation;
  }

  private async saveTranslation(options: TranslationCreateSave) {
    const { code, isBlocked = false } = options;
    const translation = new Translation();
    translation.code = code ?? uuidv4();
    translation.isBlocked = isBlocked;
    await translation.save();
    return translation;
  }
}
