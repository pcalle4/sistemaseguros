import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../core/constants/routes';
import { Card } from '../components/common/Card';
import { PageContainer } from '../components/common/PageContainer';
import { LoginForm } from '../components/auth/LoginForm';
import { useAuth } from '../hooks/useAuth';

export function LoginPage() {
  const navigate = useNavigate();
  const { isSubmittingLogin, login } = useAuth();

  return (
    <PageContainer>
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="space-y-6">
          <span className="inline-flex w-fit rounded-full border border-amber-300/80 bg-amber-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-amber-800">
            Acceso seguro
          </span>
          <div className="space-y-4">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-tight text-slate-950 sm:text-6xl">Insurance Quoter</h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Inicia sesión para entrar al workspace de cotización y emisión de pólizas. El acceso usa el API Gateway real del proyecto.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border-slate-200 bg-white/70">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">Paso 1</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Inicia sesión</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Autentica la sesión con las credenciales del entorno de demo.</p>
            </Card>
            <Card className="border-slate-200 bg-white/70">
              <p className="text-[0.72rem] uppercase tracking-[0.18em] text-slate-500">Paso 2</p>
              <h2 className="mt-3 text-xl font-semibold text-slate-950">Cotiza y emite</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">Una vez dentro, podrás cotizar y emitir pólizas en una pantalla protegida.</p>
            </Card>
          </div>
        </section>

        <Card className="border-slate-200/70 bg-[rgba(255,255,255,0.9)]">
          <div className="mb-8 space-y-4">
            <div className="inline-flex w-fit rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-teal-700">
              Login
            </div>
            <h2 className="text-3xl font-semibold text-slate-950">Accede al panel</h2>
            <p className="text-sm leading-6 text-slate-600">
              Si el backend no está corriendo, aquí verás un error específico indicando que el gateway no responde.
            </p>
          </div>

          <LoginForm
            onSubmitLogin={async (values) => {
              await login(values);
              navigate(appRoutes.quoter);
            }}
            isSubmitting={isSubmittingLogin}
          />
        </Card>
      </div>
    </PageContainer>
  );
}
