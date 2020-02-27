// @ts-ignore
interface Type {
  translation: string,
  rate: number,
  synonyms:  Array<string>,
}

interface Translation {
  type: string,
  translations: Array<Type>,
}

interface LookUpResult {
  text: string,
  pronunciation: {
    to: string,
    from: string,
    fromUrl: string,
  }
  translations: Array<Translation>,
  from: {
    value: string,
    language: {
      didYouMean: boolean,
      iso: string,
    },
    text: {
      autoCorrected: boolean,
      value: string,
      didYouMean: boolean
    }
  },
  raw: string,
}
