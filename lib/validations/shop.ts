import { z } from 'zod';

export const shopSchema = z.object({
  name: z.string()
    .min(1, '店舗名を入力してください')
    .max(100, '店舗名は100文字以内で入力してください'),
  openTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '営業開始時間の形式が正しくありません'),
  closeTime: z.string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, '営業終了時間の形式が正しくありません'),
}).refine(
  (data) => {
    const open = data.openTime.split(':').map(Number);
    const close = data.closeTime.split(':').map(Number);
    const openMinutes = open[0] * 60 + open[1];
    const closeMinutes = close[0] * 60 + close[1];
    return closeMinutes > openMinutes;
  },
  {
    message: '営業終了時間は営業開始時間より後である必要があります',
    path: ['closeTime'],
  }
);

export type ShopForm = z.infer<typeof shopSchema>;