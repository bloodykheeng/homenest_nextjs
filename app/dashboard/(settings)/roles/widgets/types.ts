import { z } from 'zod';

// Zod schemas for validation
export const PermissionSchema = z.object({
  name: z.string(),
  value: z.boolean()
});

export const RoleSchema = z.object({
  role: z.string(),
  permissions: z.array(PermissionSchema)
});

export const RolesSubmissionSchema = z.object({
  roles: z.array(RoleSchema)
});

// TypeScript interfaces
export interface Permission {
  name: string;
  value: boolean;
}

export interface Role {
  role: string;
  permissions: Permission[];
}