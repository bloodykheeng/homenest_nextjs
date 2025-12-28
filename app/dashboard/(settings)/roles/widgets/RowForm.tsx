import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// PrimeReact Components
import { TabView, TabPanel } from "primereact/tabview";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { ProgressSpinner } from "primereact/progressspinner";

import { syncPermissionToRoleService } from "@/services/roles/roles-service";
import useHandleMutationError from "@/hooks/useHandleMutationError";
import { RolesSubmissionSchema, Role, Permission } from "./types";

import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";

interface RoleFormProps {
  rolesAndModifiedPermissionData: Role[];
}

const RowForm: React.FC<RoleFormProps> = ({
  rolesAndModifiedPermissionData,
}) => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [formSubmitData, setFormSubmitData] = useState<Role[] | null>(null);

  const queryClient = useQueryClient();

  const primeReactToast = usePrimeReactToast();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<{ roles: Role[] }>({
    resolver: zodResolver(RolesSubmissionSchema),
    defaultValues: { roles: rolesAndModifiedPermissionData },
  });

  const { fields, update } = useFieldArray({
    control,
    name: "roles",
  });

  const watchedValues = watch(); // This will re-render the component when values change
  console.log("🚀 ~ watchedValues:", watchedValues);

  const mutation = useMutation({
    mutationFn: syncPermissionToRoleService,
    onSuccess: () => {
      queryClient.resetQueries({
        queryKey: ["roles-with-modified-permissions"],
      });
      // queryClient.invalidateQueries({ queryKey: ['roles-with-modified-permissions'] });
      primeReactToast.success("Roles and Permissions Synced Successfully");
    },
  });

  useHandleMutationError(mutation.error);

  const handleConfirmOpen = (data: Role[]) => {
    setFormSubmitData(data);
    setOpenConfirmDialog(true);
  };

  const handleConfirmClose = () => {
    setOpenConfirmDialog(false);
  };

  const handleConfirmSubmit = () => {
    if (formSubmitData) {
      mutation.mutate({ roles: formSubmitData });
      setOpenConfirmDialog(false);
    }
  };

  const handleTabSubmit = (data: { roles: Role[] }, role: Role) => {
    const formattedData = [
      {
        role: role.role,
        permissions: role.permissions,
      },
    ];
    console.log("🚀 ~ handleTabSubmit ~ formattedData:", formattedData);

    handleConfirmOpen(formattedData);
  };

  const handlePermissionChange = (
    roleIndex: number,
    permIndex: number,
    checked: boolean
  ) => {
    // Use update method to modify the specific permission
    update(roleIndex, {
      ...fields[roleIndex],
      permissions: fields[roleIndex].permissions.map((perm, index) =>
        index === permIndex ? { ...perm, value: checked } : perm
      ),
    });
  };

  return (
    <>
      <TabView
        activeIndex={selectedTab}
        onTabChange={(e) => setSelectedTab(e.index)}
      >
        {fields.map((role, roleIndex) => (
          <TabPanel key={role.id} header={role.role}>
            <form
              onSubmit={handleSubmit((data) => handleTabSubmit(data, role))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 items-center">
                {role.permissions.map((permission, permIndex) => {
                  // return renderPermissionCheckbox(role, index, permission, permIndex)
                  return (
                    <div key={`${permission.name}-${permIndex}`}>
                      <div className="field-checkbox">
                        <Checkbox
                          inputId={`permission-${roleIndex}-${permIndex}`}
                          checked={permission.value} // Ensure this is always a boolean
                          onChange={(e) => {
                            console.log(
                              `Checkbox changed: roles.${roleIndex}.permissions.${permIndex}.value`,
                              !!e.checked
                            );
                            console.log(
                              "Checkbox changed: 🚀 ~ {role.permissions.map ~ permission:",
                              permission
                            );

                            // setValue(
                            //     `roles.${roleIndex}.permissions.${permIndex}.value`,
                            //     !!e.checked,
                            // );

                            handlePermissionChange(
                              roleIndex,
                              permIndex,
                              !!e.checked
                            );
                          }}
                        />
                        <label
                          htmlFor={`permission-${roleIndex}-${permIndex}`}
                          className="ml-2"
                        >
                          {permission?.name}
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 flex justify-center">
                <Button
                  type="submit"
                  label={
                    mutation.isPending
                      ? `Submitting ${role?.role} Permissions...`
                      : `Submit to Sync ${role?.role} Permissions`
                  }
                  icon={
                    mutation.isPending ? (
                      <ProgressSpinner
                        style={{ width: "20px", height: "20px" }}
                      />
                    ) : undefined
                  }
                  disabled={mutation.isPending}
                  className="p-button-primary"
                  style={{ minWidth: "200px" }}
                />
              </div>
            </form>
          </TabPanel>
        ))}
      </TabView>

      <Dialog
        header="Confirm Submission"
        visible={openConfirmDialog}
        style={{ width: "400px" }}
        onHide={handleConfirmClose}
        footer={
          <div>
            <Button
              label="Cancel"
              icon="pi pi-times"
              onClick={handleConfirmClose}
              className="p-button-text"
            />
            <Button
              label="Confirm"
              icon="pi pi-check"
              onClick={handleConfirmSubmit}
              autoFocus
            />
          </div>
        }
      >
        <p>Are you sure you want to submit?</p>
      </Dialog>
    </>
  );
};

// // Add console logs to help diagnose the issue
// const renderPermissionCheckbox = (role: Role, roleIndex: number, permission: Permission, permIndex: number) => {
//     // Log current value for debugging
//     console.log(`Role ${roleIndex}, Permission ${permIndex}:`,
//         watch(`roles.${roleIndex}.permissions.${permIndex}.value`)
//     );

//     return (
//         <div key={`${permission.name}-${permIndex}`} className="col-span-3 md:col-span-3 lg:col-span-3">
//             <div className="field-checkbox">
//                 <Checkbox
//                     inputId={`permission-${roleIndex}-${permIndex}`}
//                     checked={!!permission.value} // Ensure this is always a boolean
//                     onChange={(e) => {
//                         console.log('Checkbox changed:', e.checked);
//                         setValue(
//                             `roles.${roleIndex}.permissions.${permIndex}.value`,
//                             !!e.checked,
//                             { shouldValidate: true } // Add this to ensure updates
//                         );
//                     }}
//                 />
//                 <label
//                     htmlFor={`permission-${roleIndex}-${permIndex}`}
//                     className="ml-2"
//                 >
//                     {permission?.name}
//                 </label>
//             </div>
//         </div>
//     );
// };

export default RowForm;
