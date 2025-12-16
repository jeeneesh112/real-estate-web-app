import en from './en.json';

export type TranslationKey = string;

class I18n {
  private translations = en;

  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations;
    
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return value as string;
  }
}

export const i18n = new I18n();
