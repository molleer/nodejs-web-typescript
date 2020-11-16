import Text from '~src/db/entities/Text';
import TextInputCreate from '~src/graphql/input/TextInputCreate';

export default class TextsUpdate {
  private readonly translationID: number;

  constructor(translationID: number) {
    this.translationID = translationID;
  }

  async save(texts: TextInputCreate[]) {
    const textPromises = [];
    for (let i = 0; i < texts.length; i += 1) {
      const text = texts[i];
      textPromises.push(this.saveText(text));
    }
    await Promise.all(textPromises);
  }

  private async saveText(text: TextInputCreate) {
    const textEntity = await Text.findOne({
      where: {
        translationID: this.translationID,
        langID: text.langID,
      },
    });
    if (textEntity) {
      textEntity.text = text.text;
      await textEntity.save();
    } else {
      const newText = new Text();
      newText.text = text.text;
      newText.langID = text.langID;
      newText.translationID = this.translationID;
      await newText.save();
    }
  }
}
