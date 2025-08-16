export class I18nService {
  private static instance: I18nService;
  private currentLanguage = 'en';

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  translate(key: string): string {
    return key;
  }
}

export const i18nService = I18nService.getInstance();
