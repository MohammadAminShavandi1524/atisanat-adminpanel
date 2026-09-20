"use client";

import type { ControllerRenderProps, FieldError } from "react-hook-form";

import { useTranslations } from "next-intl";

import { CustomSelect } from "@/components/ui/custom-select";

import type { ChildChartFormValues } from "./add-child-chart.schema";

interface ChartSizeSelectProps {
  field: ControllerRenderProps<ChildChartFormValues, "size">;

  error?: FieldError;
}

const ChartSizeSelect = ({ field, error }: ChartSizeSelectProps) => {
  const t = useTranslations("addStandardTableChild");

  return (
    <CustomSelect
      label={t("form.size.label")}
      placeholder={t("form.size.placeholder")}
      value={field.value || ""}
      onChange={field.onChange}
      options={[
        {
          label: "A3",
          value: "A3",
        },
        {
          label: "A4",
          value: "A4",
        },
        {
          label: "A5",
          value: "A5",
        },
      ]}
      error={error}
      labelClassName="text-[14px] font-semibold"
      triggerClassName="border-border bg-secondary-bg h-13 rounded-lg"
      dropdownClassName="border-border rounded-lg"
    />
  );
};

export default ChartSizeSelect;
