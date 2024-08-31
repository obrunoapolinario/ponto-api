import { z } from "zod";

const envSchema = z.object({
	NODE_ENV: z.enum(["production", "development", "test"]).default("development"),
	ALLOWED_ORIGINS: z.string(),
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
