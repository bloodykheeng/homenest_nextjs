import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import moment from "moment";

// PrimeReact Components
import { Accordion, AccordionTab } from "primereact/accordion";
import { Calendar } from "primereact/calendar";
import { MultiSelect } from "primereact/multiselect";
import { Button } from "primereact/button";
import { Familjen_Grotesk } from "next/font/google";

// Zod Schema for Validation
const AdvancedFilterSchema = z
  .object({
    startDate: z.date().nullish(),
    endDate: z.date().nullish(),
    selectedTargetAudience: z
      .array(
        z.object({
          id: z.number(),
          name: z.string(),
          code: z.string(),
        })
      )
      .nullish(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate) {
        return data.startDate <= data.endDate;
      }
      return true;
    },
    { message: "Start date cannot be after end date", path: ["startDate"] }
  );

// TypeScript Interface
interface AdvancedFilterFormProps {
  onSubmit: (data: z.infer<typeof AdvancedFilterSchema>) => void;
  initialData?: Partial<z.infer<typeof AdvancedFilterSchema>>;
  selectedTargetAudience?: any[];
}

// Target Audience Options
const TargetAudienceOptions = [
  { id: 1, name: "All", code: "all" },
  { id: 2, name: "Groups", code: "groups" },
  { id: 3, name: "Users", code: "users" },
];

const AdvancedFilterForm: React.FC<AdvancedFilterFormProps> = ({
  onSubmit,
  initialData = {},
  selectedTargetAudience = [],
}) => {
  const [accordionActiveIndex, setAccordionActiveIndex] = useState<
    number | number[]
  >();

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof AdvancedFilterSchema>>({
    resolver: zodResolver(AdvancedFilterSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = (data: z.infer<typeof AdvancedFilterSchema>) => {
    onSubmit(data);
    setAccordionActiveIndex(undefined);
  };

  const handleClearFilters = () => {
    reset({
      startDate: null,
      endDate: null,
      // statuses: []
    });

    onSubmit({
      startDate: null,
      endDate: null,
      // statuses: []
    });
  };

  return (
    <div>
      <Accordion
        activeIndex={accordionActiveIndex}
        onTabChange={(e) => {
          e.originalEvent.preventDefault();
          setAccordionActiveIndex(e.index);
        }}
      >
        <AccordionTab header="Filters">
          <form
            onSubmit={handleSubmit(handleFormSubmit)}
            className="grid gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Range */}
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Start Date
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      value={field.value ? moment(field.value).toDate() : null}
                      onChange={(e) => {
                        field.onChange(
                          e.value ? moment(e.value).toDate() : null
                        );
                      }}
                      showTime={false}
                      dateFormat="dd/mm/yy"
                      className={`w-full ${
                        errors.startDate ? "p-invalid" : ""
                      }`}
                      showIcon
                      showButtonBar
                    />
                  )}
                />
                {errors.startDate && (
                  <small className="p-error">{errors.startDate.message}</small>
                )}
              </div>

              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  End Date
                </label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <Calendar
                      {...field}
                      value={field.value ? moment(field.value).toDate() : null}
                      onChange={(e) => {
                        field.onChange(
                          e.value ? moment(e.value).toDate() : null
                        );
                      }}
                      showTime={false}
                      dateFormat="dd/mm/yy"
                      className={`w-full ${errors.endDate ? "p-invalid" : ""}`}
                      showIcon
                      showButtonBar
                    />
                  )}
                />
                {errors.endDate && (
                  <small className="p-error">{errors.endDate.message}</small>
                )}
              </div>

              {/* Target Audience (Optional) */}
              {/* <div className="flex flex-col">
                                <Controller
                                    name="selectedTargetAudience"
                                    control={control}
                                    render={({ field }) => (
                                        <div>
                                            <label
                                                htmlFor="targetAudience"
                                                className="block text-sm font-medium text-gray-700 mb-2"
                                            >
                                                Filter by Target Audience
                                            </label>
                                            <MultiSelect
                                                id="targetAudience"
                                                value={field.value}
                                                options={TargetAudienceOptions}
                                                onChange={(e) => field.onChange(e.value)}
                                                optionLabel="name"
                                                placeholder="Select Target Audience"
                                                display="chip"
                                                className="w-full"
                                            />
                                        </div>
                                    )}
                                />
                            </div> */}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 space-x-4 mt-4">
              <Button
                type="submit"
                label="Apply Filters"
                className="p-button-primary"
              />
              <Button
                type="button"
                label="Clear Filters"
                className="p-button-secondary"
                onClick={handleClearFilters}
              />
            </div>
          </form>
        </AccordionTab>
      </Accordion>
    </div>
  );
};

export default AdvancedFilterForm;
