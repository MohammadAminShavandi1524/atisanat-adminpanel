import { getCities, getProvincesList } from "@code-plate/iran-cities";

export type ResumeLocale = "fa" | "en";

export interface LocationOption {
  value: string;
  label: string;
}

const normalize = (value: string) => value.trim().toLowerCase();

export const getProvinceOptions = (locale: ResumeLocale): LocationOption[] =>
  getProvincesList().map((province) => ({
    value: province.en,
    label: locale === "fa" ? province.fa : province.en,
  }));

export const getCityOptions = (
  province: string,
  locale: ResumeLocale,
): LocationOption[] => {
  if (!province?.trim()) return [];

  const matchingProvince = getProvincesList().find(
    (item) => normalize(item.en) === normalize(province),
  );

  if (!matchingProvince) return [];

  return getCities(matchingProvince.en).map((city) => ({
    value: city.en,
    label: locale === "fa" ? city.fa : city.en,
  }));
};

export const getProvinceLabel = (
  province: string | null | undefined,
  locale: ResumeLocale,
): string => {
  if (!province?.trim()) return "";

  return (
    getProvinceOptions(locale).find(
      (option) => normalize(option.value) === normalize(province),
    )?.label ?? province
  );
};

export const getCityLabel = (
  province: string | null | undefined,
  city: string | null | undefined,
  locale: ResumeLocale,
): string => {
  if (!city?.trim()) return "";

  return (
    getCityOptions(province ?? "", locale).find(
      (option) => normalize(option.value) === normalize(city),
    )?.label ?? city
  );
};
