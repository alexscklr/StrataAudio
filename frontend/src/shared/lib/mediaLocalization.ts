import i18n from "@/i18n";

export type SupportedLocale = "de" | "en";

export const readRelation = <T>(relation: T | T[] | null | undefined): T | null => {
  if (!relation) {
    return null;
  }

  return Array.isArray(relation) ? (relation[0] ?? null) : relation;
};

export const resolveLocale = (): SupportedLocale => (i18n.language?.toLowerCase().startsWith("en") ? "en" : "de");

export const localizedText = (
  deValue: string | null | undefined,
  enValue: string | null | undefined,
  locale: SupportedLocale
): string => {
  if (locale === "en") {
    return enValue ?? deValue ?? "";
  }

  return deValue ?? enValue ?? "";
};

export const localizedNullableText = (
  deValue: string | null | undefined,
  enValue: string | null | undefined,
  locale: SupportedLocale
): string | null => {
  const value = localizedText(deValue, enValue, locale);
  return value.length > 0 ? value : null;
};
