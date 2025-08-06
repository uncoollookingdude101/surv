import { z } from "zod";

export const zGetPlayerIpParams = z.object({
    name: z.string(),
    use_account_slug: z.boolean().default(false),
    game_id: z.string().optional(),
});

export const zBanIpParams = z.object({
    ips: z.union([
        z
            .string()
            .min(1)
            .transform((v) => [v]),
        z.array(z.string()).min(1),
    ]),
    is_encoded: z.boolean().default(false),
    permanent: z.boolean().default(false),
    ban_associated_account: z.boolean().default(true),
    ip_ban_duration: z.number().default(7),
    ban_reason: z.string().default("Cheating"),
    executor_id: z.string().default("admin"),
});

export const zBanAccountParams = z.object({
    slug: z.string(),
    ban_reason: z.string().default("Cheating"),
    executor_id: z.string().default("admin"),
    ban_associated_ips: z.boolean().default(true),
    ip_ban_duration: z.number().default(7),
    ip_ban_permanent: z.boolean().default(false),
});

export const zUnbanIpParams = z.object({
    ip: z.string(),
    is_encoded: z.boolean().default(true),
});

export const zUnbanAccountParams = z.object({
    slug: z.string(),
});

export const zSetMatchDataNameParams = z.object({
    current_name: z.string(),
    new_name: z.string(),
});

export const zSetAccountNameParams = z.object({
    new_name: z.string(),
    current_slug: z.string(),
});

export const zFindDiscordUserSlugParams = z.object({
    discord_user: z.string(),
});
