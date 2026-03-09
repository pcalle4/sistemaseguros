import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { demoCredentials } from '../../../core/constants/ui';
import { applyFieldErrors, normalizeApiError } from '../../../core/utils/error-mapper';
import { Button } from '../common/Button';
import { ErrorBanner } from '../common/ErrorBanner';
import { Input } from '../common/Input';

const loginSchema = z.object({
  email: z.string().email('Ingresa un correo válido'),
  password: z.string().min(1, 'Ingresa tu contraseña'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onSubmitLogin: (values: LoginFormValues) => Promise<unknown>;
  isSubmitting: boolean;
};

export function LoginForm({ onSubmitLogin, isSubmitting }: LoginFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: demoCredentials,
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      await onSubmitLogin(values);
    } catch (error) {
      const mappedError = normalizeApiError(error);
      applyFieldErrors(mappedError.fieldErrors, setError);
      if (Object.keys(mappedError.fieldErrors).length === 0) {
        setSubmitError(mappedError.message);
      }
    }
  });

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      {submitError ? <ErrorBanner message={submitError} onClose={() => setSubmitError(null)} /> : null}

      <div className="rounded-[26px] border border-slate-200/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.84),rgba(248,250,252,0.7))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Acceso al entorno</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">La sesión habilita la pantalla protegida para cotizar y emitir pólizas con JWT real.</p>
      </div>

      <Input id="login-email" label="Correo electrónico" type="email" autoComplete="email" error={errors.email?.message} {...register('email')} />
      <Input
        id="login-password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <div className="flex flex-col gap-3 rounded-[26px] border border-slate-200/70 bg-white/70 p-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">Los campos ya incluyen valores de demo.</p>
        <Button type="submit" loading={isSubmitting}>
          Iniciar sesión
        </Button>
      </div>
    </form>
  );
}
