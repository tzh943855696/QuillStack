'use server';

import { revalidatePath } from 'next/cache';

export async function publishSiteAction() {
    revalidatePath('/', 'layout');
    return { success: true, message: '网站已成功发布！' };
}
