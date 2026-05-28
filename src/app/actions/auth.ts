'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  const expectedUser = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'password';

  if (!username || !password) {
    return { error: 'Please enter both username and password.' };
  }

  if (username === expectedUser && password === expectedPassword) {
    // Generate a simple token (in a real app, this should be a JWT or session ID)
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    
    // Set cookie
    (await cookies()).set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return { success: true };
  }

  return { error: 'Invalid username or password.' };
}

export async function logoutAction() {
  (await cookies()).delete('admin_token');
  redirect('/login');
}
