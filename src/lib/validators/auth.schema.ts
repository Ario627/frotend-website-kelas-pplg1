import z, { regex } from "zod";

export const logicSchema = z.object({
  email: z
    .email({ error: "Format email tidak valid" })
    .refine((val) => val.length >= 1, { error: "Email wajib diisi" }),
  password: z
    .string()
    .min(6, { error: "Password minimal 6 karakter" })
    .refine((val) => val.length >= 1, { error: "Password wajib diisi" }),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(3, { error: "Nama minimal 3 karakter" })
    .refine((val) => val.length >= 1, { message: "Nama wajib diisi" })
    .max(100, { error: "Nama maksimal 100 karakter" }),
  email: z
    .email({ error: "Format email tidak valid" })
    .refine((val) => val.length >= 1, { error: "Email wajib diisi" }),
  password: z
    .string()
    .refine((val) => val.length >= 6, { error: "Password minimal 6 karakter" })
    .min(6, { error: "Password minimal 6 karakter" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password harus mengandung huruf besar, huruf kecil, dan angka'),
  confirmPassword: z
    .string()
    .min(1, { error: "Konfirmasi password wajib diisi" }),
  secretCode: z
    .string()
    .optional(),
}).refine((data) => data.password === data.confirmPassword, {
  error: "Password dan konfirmasi password harus sama",
});

export type LoginFormData = z.infer<typeof logicSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
