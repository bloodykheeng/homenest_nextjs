"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { AutoComplete } from "primereact/autocomplete";
import { Password } from "primereact/password";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dialog } from "primereact/dialog";

import { useRouter } from "nextjs-toploader/app";

// Import your services
import { getAllCsos } from "@/services/csos/csos-service";
import { getAllOversightInstitutions } from "@/services/oversight-institutions/oversight-institutions-service";
import { getAllStates } from "@/services/locations/states-service";
import { getAllRegions } from "@/services/locations/regions-service";
import { getAllDistricts } from "@/services/locations/districts-service";
import { getAllWards } from "@/services/locations/wards-service";
import { getAllVillages } from "@/services/locations/villages-service";
import { getAllAreasOfOperation } from "@/services/areas-of-operation/areas-of-operation-service";

import { useQuery } from "@tanstack/react-query";
import useHandleQueryError from "@/hooks/useHandleQueryError";

import { InputMask } from "primereact/inputmask";
import PhotoUploadPicker from "@/components/admin-panel/fileUploadPickers/PhotoUploadPicker";

const requireField = (val: any, ctx: z.RefinementCtx, fieldName: string) => {
  if (!!val === false) {
    ctx.addIssue({
      code: "custom",
      message: `${fieldName} is required`,
    });
    return z.NEVER;
  }
  return val;
};

// ✅ Validation Schema
const formSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    phone: z.string().nullish(),
    email: z.string().email("Please enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(/^[a-zA-Z0-9._-]+$/, "Username can only contain letters, numbers, dots, underscores, or hyphens"),
    password: z.string().trim().optional(), // ✅ make it optional first
    editing: z.boolean().optional().nullable(),
    role: z
      .enum(["System Admin", "WAJIBU Admin", "CSO Reviewer", "Oversight Institution Admin", "Community Accountability Champion"])
      .refine((val) => !!val, { message: "Please select a role" }),
    status: z.enum(["active", "inactive"]),

    // Fields for different roles
    cso: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),
    oversight_institution: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),
    areas_of_operation: z
      .array(
        z.object({
          id: z.number(),
          name: z.string()
        })
      )
      .nullish()
      .optional(),
    state: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),
    region: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),
    district: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),
    ward: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),
    village: z
      .object({ id: z.number(), name: z.string() })
      .nullish()
      .optional(),

    photo: z
      .object({
        file: z.instanceof(File).optional(),
        previewUrl: z.string(),
        status: z.enum(["new", "existing"]),
      })
      .nullish()
      .optional(),
    photo_url: z.string().nullish().optional(),
  })
  .superRefine((data, ctx) => {
    // Phone number validation
    const isValidPhone = /^\d{12}$/.test(data?.phone ?? ""); // Matches exactly 12 digits
    if (!isValidPhone) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          "Invalid phone number format. Please enter a valid 12-digit number, e.g., 255712345678",
      });
    }

    // ✅ Conditionally require password if not editing
    if (
      data?.editing === true &&
      data?.password &&
      data?.password?.length < 8
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters",
      });
    }

    // make password a must when creating
    if (
      (data?.editing === false || !data?.editing) &&
      (data?.password ?? "").length < 8
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["password"],
        message: "Password must be at least 8 characters",
      });
    }

    // Conditional validation based on role
    // Community Accountability Champion requires all location fields + CSO
    if (data.role === "Community Accountability Champion") {
      if (!data.cso) {
        ctx.addIssue({
          code: "custom",
          message: "CSO is required for Community Accountability Champion",
          path: ["cso"],
        });
      }

      if (!data.areas_of_operation || data.areas_of_operation.length === 0) {
        ctx.addIssue({
          code: "custom",
          message: "At least one area of operation is required for Community Accountability Champion",
          path: ["areas_of_operation"],
        });
      }

      if (!data.state) {
        ctx.addIssue({
          code: "custom",
          message: "State is required for Community Accountability Champion",
          path: ["state"],
        });
      }
      if (!data.region) {
        ctx.addIssue({
          code: "custom",
          message: "Region is required for Community Accountability Champion",
          path: ["region"],
        });
      }
      if (!data.district) {
        ctx.addIssue({
          code: "custom",
          message: "District is required for Community Accountability Champion",
          path: ["district"],
        });
      }
      if (!data.ward) {
        ctx.addIssue({
          code: "custom",
          message: "Ward is required for Community Accountability Champion",
          path: ["ward"],
        });
      }
      if (!data.village) {
        ctx.addIssue({
          code: "custom",
          message: "Village is required for Community Accountability Champion",
          path: ["village"],
        });
      }
    }

    // CSO Reviewer requires CSO
    if (data.role === "CSO Reviewer") {
      if (!data.cso) {
        ctx.addIssue({
          code: "custom",
          message: "CSO is required for CSO Reviewer",
          path: ["cso"],
        });
      }
    }

    // Oversight Institution Admin requires oversight institution
    if (data.role === "Oversight Institution Admin") {
      if (!data.oversight_institution) {
        ctx.addIssue({
          code: "custom",
          message: "Oversight Institution is required for Oversight Institution Admin",
          path: ["oversight_institution"],
        });
      }
    }
  });

const defaultValues: FormData = {
  name: "",
  email: "",
  username: "",
  phone: "",
  password: "",
  role: "System Admin" as const,
  status: "active" as const,
  cso: null,
  oversight_institution: null,
  areas_of_operation: null,
  state: null,
  region: null,
  district: null,
  ward: null,
  village: null,
};

// ✅ TypeScript Type for Form Fields
type FormData = z.infer<typeof formSchema>;

const UserForm: React.FC<{
  handleFormSubmit: (FormData: FormData | null) => any;
  formMutation: any;
  initialData?: FormData;
  userId?: string | null
}> = ({ handleFormSubmit, formMutation, initialData, userId }) => {
  const finalInitialData = { ...defaultValues, ...initialData };

  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: finalInitialData,
  });

  const router = useRouter();

  console.log("🚀Form ~ errors:", errors);

  const allValuesInForm = getValues();
  console.log("🚀 ~ allValuesInForm:", allValuesInForm);

  // Get current photo from form state
  const photo = watch("photo");
  // Get existing photo path
  const existingPhoto = watch("photo_url");

  // Watch for dependent field changes
  const selectedRole = watch("role");
  const selectedCso = watch("cso");
  const selectedOversightInstitution = watch("oversight_institution");
  const selectedState = watch("state");
  const selectedRegion = watch("region");
  const selectedDistrict = watch("district");
  const selectedWard = watch("ward");

  // Suggestion states
  const [csoSuggestions, setCsoSuggestions] = useState([]);
  const [oversightInstitutionSuggestions, setOversightInstitutionSuggestions] = useState([]);
  const [areaOfOperationSuggestions, setAreaOfOperationSuggestions] = useState([]);
  const [stateSuggestions, setStateSuggestions] = useState([]);
  const [regionSuggestions, setRegionSuggestions] = useState([]);
  const [districtSuggestions, setDistrictSuggestions] = useState([]);
  const [wardSuggestions, setWardSuggestions] = useState([]);
  const [villageSuggestions, setVillageSuggestions] = useState([]);

  // Queries for cascading dropdowns
  const csosQuery = useQuery({
    queryKey: ["csos"],
    queryFn: getAllCsos,
    enabled: ["CSO Reviewer", "Community Accountability Champion"].includes(selectedRole),
  });
  useHandleQueryError(csosQuery);

  const oversightInstitutionsQuery = useQuery({
    queryKey: ["oversight-institutions"],
    queryFn: getAllOversightInstitutions,
    enabled: ["Oversight Institution Admin"].includes(selectedRole),
  });
  useHandleQueryError(oversightInstitutionsQuery);

  const areasOfOperationQuery = useQuery({
    queryKey: ["areas-of-operation"],
    queryFn: getAllAreasOfOperation,
    enabled: ["Community Accountability Champion"].includes(selectedRole),
  });
  useHandleQueryError(areasOfOperationQuery);


  const statesQuery = useQuery({
    queryKey: ["states"],
    queryFn: getAllStates,
    enabled: ["Community Accountability Champion"].includes(selectedRole),
  });
  useHandleQueryError(statesQuery);

  const regionsQuery = useQuery({
    queryKey: ["regions", selectedState?.id],
    queryFn: () => getAllRegions({ state_id: selectedState?.id }),
    enabled: ["Community Accountability Champion"].includes(selectedRole) && !!selectedState?.id,
  });
  useHandleQueryError(regionsQuery);

  const districtsQuery = useQuery({
    queryKey: ["districts", selectedRegion?.id],
    queryFn: () => getAllDistricts({ region_id: selectedRegion?.id }),
    enabled: ["Community Accountability Champion"].includes(selectedRole) && !!selectedRegion?.id,
  });
  useHandleQueryError(districtsQuery);

  const wardsQuery = useQuery({
    queryKey: ["wards", selectedDistrict?.id],
    queryFn: () => getAllWards({ district_id: selectedDistrict?.id }),
    enabled: ["Community Accountability Champion"].includes(selectedRole) && !!selectedDistrict?.id,
  });
  useHandleQueryError(wardsQuery);

  const villagesQuery = useQuery({
    queryKey: ["villages", selectedWard?.id],
    queryFn: () => getAllVillages({ ward_id: selectedWard?.id }),
    enabled: ["Community Accountability Champion"].includes(selectedRole) && !!selectedWard?.id,
  });
  useHandleQueryError(villagesQuery);

  // ===================================  ✅ Handle Form Submission =============================
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    setPendingData(data);
    setShowConfirmDialog(true);
  };

  //======================= Confirm Submit ================================

  const onConfirmSubmit = (e: any) => {
    e.preventDefault();
    handleFormSubmit(pendingData);
    setShowConfirmDialog(false);
  };

  const onCancelSubmit = (e?: any) => {
    e.preventDefault();
    setShowConfirmDialog(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* BIO */}
        <div className="col-span-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">BIO</h3>
          {/* <div className="w-full h-0.5 bg-gray-300 dark:bg-gray-700 mt-1 mb-3"></div> */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Name */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    className={`w-full ${errors.name ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.name && (
                <small className="p-error">{errors.name.message}</small>
              )}
            </div>

            {/* Email */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    type="email"
                    className={`w-full ${errors.email ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.email && (
                <small className="p-error">{errors.email.message}</small>
              )}
            </div>

            {/* Username */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Username <span className="text-red-500">*</span>
              </label>
              <Controller
                name="username"
                control={control}
                render={({ field }) => (
                  <InputText
                    {...field}
                    placeholder="Enter username (e.g., jdoe)"
                    className={`w-full ${errors.username ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.username && (
                <small className="p-error">{errors.username.message}</small>
              )}
            </div>

            {/* Phone Number */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <InputMask
                    {...field}
                    mask="999999999999" // exactly 12 digits
                    slotChar=""
                    className={`w-full ${errors.phone ? "p-invalid" : ""}`}
                    placeholder="Enter 12-digit phone number"
                  />
                )}
              />
              {errors.phone && (
                <small className="p-error">{errors.phone.message}</small>
              )}
            </div>

            {/* Password */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <Password
                    {...field}
                    toggleMask
                    className={`w-full ${errors.password ? "p-invalid" : ""}`}
                    inputClassName="w-full"
                    pt={{
                      iconField: {
                        root: {
                          style: { width: "100%" },
                        },
                        style: { width: "100%" },
                      },
                      input: {
                        style: { width: "100%" },
                      },
                      root: {
                        style: { width: "100%" },
                      },
                      showIcon: { style: { right: "0.25rem" } },
                      hideIcon: { style: { right: "0.25rem" } },
                    }}
                  />
                )}
              />
              {errors.password && (
                <small className="p-error">{errors.password.message}</small>
              )}
            </div>

            {/* Status */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={[
                      { label: "Active", value: "active" },
                      { label: "Inactive", value: "inactive" },
                    ]}
                    className={`w-full ${errors.status ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.status && (
                <small className="p-error">{errors.status.message}</small>
              )}
            </div>


          </div>
        </div>

        {/* Administration */}
        <div className="col-span-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Administration</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Role */}
            <div className="p-field">
              <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    {...field}
                    options={[
                      { label: "System Admin", value: "System Admin" },
                      { label: "WAJIBU Admin", value: "WAJIBU Admin" },
                      { label: "CSO Reviewer", value: "CSO Reviewer" },
                      { label: "Oversight Institution Admin", value: "Oversight Institution Admin" },
                      { label: "Community Accountability Champion", value: "Community Accountability Champion" },
                    ]}
                    onChange={(e) => {
                      field.onChange(e.value);

                      // Clear all dependent fields when role changes
                      setCsoSuggestions([]);
                      setAreaOfOperationSuggestions([]);
                      setOversightInstitutionSuggestions([]);
                      setStateSuggestions([]);
                      setRegionSuggestions([]);
                      setDistrictSuggestions([]);
                      setWardSuggestions([]);
                      setVillageSuggestions([]);

                      setValue("cso", null);
                      setValue("areas_of_operation", []);
                      setValue("oversight_institution", null);
                      setValue("state", null);
                      setValue("region", null);
                      setValue("district", null);
                      setValue("ward", null);
                      setValue("village", null);
                    }}
                    className={`w-full ${errors.role ? "p-invalid" : ""}`}
                  />
                )}
              />
              {errors.role && (
                <small className="p-error">{errors.role.message}</small>
              )}
            </div>

            {/* CSO - Show for CSO Reviewer and Community Accountability Champion */}
            {(["CSO Reviewer", "Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  CSO <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="cso"
                  control={control}
                  render={({ field }) => {
                    const fetchCsoSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selectedCso = field.value || null;

                      const filtered =
                        csosQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selectedCso?.id
                        ) || [];

                      setCsoSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={csoSuggestions}
                        completeMethod={fetchCsoSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        dropdown
                        disabled={csosQuery?.isPending}
                        placeholder="Search & Select CSO"
                        className={`w-full ${errors.cso ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.cso && (
                  <small className="p-error">
                    {errors?.cso?.message?.toString()}
                  </small>
                )}
                {csosQuery?.isPending && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* Oversight Institution - Show for Oversight Institution Admin */}
            {(["Oversight Institution Admin"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Oversight Institution <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="oversight_institution"
                  control={control}
                  render={({ field }) => {
                    const fetchOversightInstitutionSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selected = field.value || null;

                      const filtered =
                        oversightInstitutionsQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selected?.id
                        ) || [];

                      setOversightInstitutionSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={oversightInstitutionSuggestions}
                        completeMethod={fetchOversightInstitutionSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        dropdown
                        disabled={oversightInstitutionsQuery?.isPending}
                        placeholder="Search & Select Oversight Institution"
                        className={`w-full ${errors.oversight_institution ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.oversight_institution && (
                  <small className="p-error">
                    {errors?.oversight_institution?.message?.toString()}
                  </small>
                )}
                {oversightInstitutionsQuery?.isPending && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* Areas of Operation - Show for Community Accountability Champion */}
            {(["Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Areas of Operation <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="areas_of_operation"
                  control={control}
                  render={({ field }) => {
                    const fetchAreaSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selectedIds = (field.value || []).map((item: any) => item.id);

                      const filtered =
                        areasOfOperationQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            !selectedIds.includes(item.id)
                        ) || [];

                      setAreaOfOperationSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={true}
                        suggestions={areaOfOperationSuggestions}
                        completeMethod={fetchAreaSuggestions}
                        field="name"
                        value={field.value || []}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        dropdown
                        disabled={areasOfOperationQuery?.isPending}
                        placeholder="Search & Select Areas of Operation"
                        className={`w-full ${errors.areas_of_operation ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.areas_of_operation && (
                  <small className="p-error">
                    {errors?.areas_of_operation?.message?.toString()}
                  </small>
                )}
                {areasOfOperationQuery?.isPending && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        {/* Area of Work */}
        <div className="col-span-1 p-4 border border-gray-300 dark:border-gray-700 rounded-md mb-4">
          <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-3">Area of Work</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* State - Show for Community Accountability Champion */}
            {(["Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="state"
                  control={control}
                  render={({ field }) => {
                    const fetchStateSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selected = field.value || null;

                      const filtered =
                        statesQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selected?.id
                        ) || [];

                      setStateSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={stateSuggestions}
                        completeMethod={fetchStateSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);

                          // Clear dependent fields
                          setRegionSuggestions([]);
                          setDistrictSuggestions([]);
                          setWardSuggestions([]);
                          setVillageSuggestions([]);

                          setValue("region", null);
                          setValue("district", null);
                          setValue("ward", null);
                          setValue("village", null);
                        }}
                        dropdown
                        disabled={statesQuery?.isPending}
                        placeholder="Search & Select State"
                        className={`w-full ${errors.state ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.state && (
                  <small className="p-error">
                    {errors?.state?.message?.toString()}
                  </small>
                )}
                {statesQuery?.isPending && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* Region - Show for Community Accountability Champion */}
            {(["Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Region <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="region"
                  control={control}
                  render={({ field }) => {
                    const fetchRegionSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selected = field.value || null;

                      const filtered =
                        regionsQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selected?.id
                        ) || [];

                      setRegionSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={regionSuggestions}
                        completeMethod={fetchRegionSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);

                          // Clear dependent fields
                          setDistrictSuggestions([]);
                          setWardSuggestions([]);
                          setVillageSuggestions([]);

                          setValue("district", null);
                          setValue("ward", null);
                          setValue("village", null);
                        }}
                        dropdown
                        disabled={regionsQuery?.isPending || !selectedState}
                        placeholder="Search & Select Region"
                        className={`w-full ${errors.region ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.region && (
                  <small className="p-error">
                    {errors?.region?.message?.toString()}
                  </small>
                )}
                {regionsQuery?.isPending && selectedState && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* District - Show for Community Accountability Champion */}
            {(["Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  District <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="district"
                  control={control}
                  render={({ field }) => {
                    const fetchDistrictSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selected = field.value || null;

                      const filtered =
                        districtsQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selected?.id
                        ) || [];

                      setDistrictSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={districtSuggestions}
                        completeMethod={fetchDistrictSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);

                          // Clear dependent fields
                          setWardSuggestions([]);
                          setVillageSuggestions([]);

                          setValue("ward", null);
                          setValue("village", null);
                        }}
                        dropdown
                        disabled={districtsQuery?.isPending || !selectedRegion}
                        placeholder="Search & Select District"
                        className={`w-full ${errors.district ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.district && (
                  <small className="p-error">
                    {errors?.district?.message?.toString()}
                  </small>
                )}
                {districtsQuery?.isPending && selectedRegion && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* Ward - Show for Community Accountability Champion */}
            {(["Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Ward <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="ward"
                  control={control}
                  render={({ field }) => {
                    const fetchWardSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selected = field.value || null;

                      const filtered =
                        wardsQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selected?.id
                        ) || [];

                      setWardSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={wardSuggestions}
                        completeMethod={fetchWardSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);

                          // Clear dependent fields
                          setVillageSuggestions([]);
                          setValue("village", null);
                        }}
                        dropdown
                        disabled={wardsQuery?.isPending || !selectedDistrict}
                        placeholder="Search & Select Ward"
                        className={`w-full ${errors.ward ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.ward && (
                  <small className="p-error">
                    {errors?.ward?.message?.toString()}
                  </small>
                )}
                {wardsQuery?.isPending && selectedDistrict && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* Village - Show for Community Accountability Champion */}
            {(["Community Accountability Champion"].includes(selectedRole)) && (
              <div className="p-field">
                <label className="block text-gray-900 dark:text-gray-100 font-medium mb-1">
                  Village <span className="text-red-500">*</span>
                </label>
                <Controller
                  name="village"
                  control={control}
                  render={({ field }) => {
                    const fetchVillageSuggestions = (event: any) => {
                      const query = event.query.toLowerCase();
                      const selected = field.value || null;

                      const filtered =
                        villagesQuery?.data?.data?.data?.filter(
                          (item: any) =>
                            item?.name?.toLowerCase().includes(query) &&
                            item?.id !== selected?.id
                        ) || [];

                      setVillageSuggestions(filtered);
                    };

                    return (
                      <AutoComplete
                        {...field}
                        multiple={false}
                        suggestions={villageSuggestions}
                        completeMethod={fetchVillageSuggestions}
                        field="name"
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.value);
                        }}
                        dropdown
                        disabled={villagesQuery?.isPending || !selectedWard}
                        placeholder="Search & Select Village"
                        className={`w-full ${errors.village ? "p-invalid" : ""}`}
                      />
                    );
                  }}
                />
                {errors.village && (
                  <small className="p-error">
                    {errors?.village?.message?.toString()}
                  </small>
                )}
                {villagesQuery?.isPending && selectedWard && (
                  <ProgressSpinner
                    style={{ width: "10px", height: "10px" }}
                    strokeWidth="4"
                  />
                )}
              </div>
            )}

            {/* Photo Upload */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
              <PhotoUploadPicker
                setValue={setValue}
                photo={photo}
                existingPhoto={existingPhoto}
                fieldName="photo"
                label="User Photo"
              />
            </div>
          </div>
        </div>





        {/* Submit Button */}
        <div className="w-full flex justify-center pt-4">
          <Button
            type="submit"
            label="Submit"
            icon={
              formMutation?.isPending
                ? "pi pi-spin pi-spinner"
                : "pi pi-user-plus"
            }
            className="p-3 text-xl"
            disabled={formMutation?.isPending}
          />
        </div>

      </form>

      <Dialog
        header="Confirm User Creation"
        visible={showConfirmDialog}
        maximizable
        onHide={onCancelSubmit}
        footer={
          <div>
            <Button label="Yes" onClick={onConfirmSubmit} />
            <Button
              label="No"
              onClick={onCancelSubmit}
              className="p-button-secondary"
            />
          </div>
        }
      >
        Are you sure you want to submit this user&apos;s data?
      </Dialog>
    </>
  );
};

export default UserForm;