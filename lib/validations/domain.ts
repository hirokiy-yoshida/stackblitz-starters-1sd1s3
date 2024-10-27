import { z } from 'zod';

export const domainSchema = z.object({
  domain: z.string()
    .min(1, 'ドメインを入力してください')
    .max(255, 'ドメインが長すぎます')
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/,
      '有効なドメインを入力してください'
    ),
});

export type DomainForm = z.infer<typeof domainSchema>;