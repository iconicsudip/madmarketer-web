'use client';

import { useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { loginAction } from '@/app/actions/auth';
import styles from './Login.module.css';

type LoginState = {
  error?: string;
  success?: boolean;
};

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.push('/admin');
    }
  }, [state?.success, router]);

  return (
    <div className={styles.container}>
      <div className={styles.bgBlob}></div>
      
      <motion.div 
        className={styles.card}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={styles.header}>
          <h1 className={styles.title}>Admin Login</h1>
          <p className={styles.subtitle}>Enter your credentials to access the dashboard</p>
        </div>

        {state?.error && (
          <motion.div 
            className={styles.error}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {state.error}
          </motion.div>
        )}

        <form action={formAction} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="username" className={styles.label}>Username</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              className={styles.input}
              placeholder="Enter username"
              required 
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              className={styles.input}
              placeholder="Enter password"
              required 
            />
          </div>

          <button type="submit" className={styles.button} disabled={isPending || state?.success}>
            {isPending ? 'Authenticating...' : state?.success ? 'Success!' : 'Login'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
