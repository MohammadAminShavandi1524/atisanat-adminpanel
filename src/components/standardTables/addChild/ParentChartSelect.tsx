"use client";

import { useEffect, useState } from "react";

import type { ControllerRenderProps, FieldError } from "react-hook-form";

import { useLocale, useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";

import { getParentCharts, type ParentChart } from "./add-child-chart.api";

import type { ChildChartFormValues } from "./add-child-chart.schema";

interface ParentChartSelectProps {
  field: ControllerRenderProps<ChildChartFormValues, "chart">;
  error?: FieldError;
  onAvailabilityChange?: (hasParents: boolean) => void;
}

const ParentChartSelect = ({
  field,
  error,
  onAvailabilityChange,
}: ParentChartSelectProps) => {
  const t = useTranslations("addStandardTableChild");

  const locale = useLocale();

  const [parents, setParents] = useState<ParentChart[]>([]);

  const [loading, setLoading] = useState(true);

  const [fetchError, setFetchError] = useState(false);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        setFetchError(false);

        const data = await getParentCharts();

        setParents(data);

        onAvailabilityChange?.(data.length > 0);
      } catch (error) {
        console.error("GET PARENT CHARTS ERROR:", error);

        setParents([]);

        setFetchError(true);

        onAvailabilityChange?.(false);
      } finally {
        setLoading(false);
      }
    };

    fetchParents();
  }, [onAvailabilityChange]);

  const options = parents.map((parent) => ({
    label:
      locale === "fa"
        ? parent.name_fa || parent.name_en
        : parent.name_en || parent.name_fa,

    value: String(parent.id),
  }));

  const getPlaceholder = () => {
    if (loading) {
      return t("form.parent.loading");
    }

    if (fetchError) {
      return t("form.parent.error");
    }

    if (parents.length === 0) {
      return t("form.parent.empty");
    }

    return t("form.parent.placeholder");
  };

  return (
    <div>
      <CustomSelect
        label={t("form.parent.label")}
        placeholder={getPlaceholder()}
        value={field.value ? String(field.value) : ""}
        onChange={(value) => field.onChange(Number(value))}
        options={options}
        disabled={loading || fetchError || parents.length === 0}
        error={error}
      />

      {!loading && !fetchError && parents.length === 0 && (
        <p className="text-muted-foreground mt-2 px-1 text-xs leading-5">
          {t("form.parent.emptyDescription")}
        </p>
      )}

      {!loading && fetchError && (
        <p className="text-destructive mt-2 px-1 text-xs leading-5">
          {t("form.parent.fetchError")}
        </p>
      )}
    </div>
  );
};

export default ParentChartSelect;
