"use client";

import React, { useEffect } from "react";
import { useRouter } from "nextjs-toploader/app";

import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { usePrimeReactToast } from "@/providers/PrimeReactToastProvider";
import useHandleMutationError from "@/hooks/useHandleMutationError";

import RowForm from "./widgets/RowForm";
import { postToUpdateUserProfile } from "@/services/users/users-service";
import useAuthContext from "@/providers/AuthProvider";

function EditRecordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const primeReactToast = usePrimeReactToast();
  const { getUserQuery } = useAuthContext();
  const loggedInUserData = getUserQuery?.data?.data;

  // Redirect to home if no user
  useEffect(() => {
    if (!getUserQuery.isPending && !loggedInUserData) {
      router.push("/");
    }
  }, [getUserQuery.isPending, loggedInUserData, router]);

  const editMutation = useMutation({
    mutationFn: postToUpdateUserProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["logged-in-user"] });
      primeReactToast.success("User updated successfully");
      router.push("/dashboard/profile");
    },
  });

  useHandleMutationError(editMutation.error);



  const handleFormSubmit = (data: any) => {

    const formData = new FormData();
    formData.append("name", data?.name || "");
    formData.append("phone", data?.phone || "");
    formData.append("email", data?.email || "");
    // Passwords
    formData.append("current_password", data.current_password || "");
    if (data?.new_password) {
      formData.append("new_password", data.new_password);
    }

    // Gender + Notifications
    if (data?.gender) {
      formData.append("gender", data.gender);
    }

    formData.append("allow_notifications", data?.allow_notifications);

    if (data?.photo?.status === "new" && data.photo?.file) {
      formData.append("photo[file_path]", data.photo.file);
      formData.append("photo[type]", "image");
      formData.append("photo[status]", "new");
    }

    editMutation.mutate(formData);
  };

  const defaultValues = { name: "" };

  return (
    <Card className="shadow-md">
      {getUserQuery.isPending ? (
        <div className="flex justify-center items-center w-full h-64">
          <ProgressSpinner style={{ width: "50px", height: "50px" }} />
        </div>
      ) : getUserQuery.isError ? (
        <div className="flex justify-center items-center w-full h-64 text-red-500">
          Error loading user data.
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <RowForm
            handleFormSubmit={handleFormSubmit}
            formMutation={editMutation}
            initialData={{
              ...defaultValues,
              ...loggedInUserData,
              allow_notifications: loggedInUserData?.allow_notifications || false,
              editing: true,
            }}
          />

          {editMutation.isPending && (
            <div className="absolute inset-0 flex justify-center items-center bg-white/70 z-10">
              <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export default EditRecordPage;
