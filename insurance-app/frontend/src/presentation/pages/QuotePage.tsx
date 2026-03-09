import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../core/constants/routes';
import { Card } from '../components/common/Card';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorBanner } from '../components/common/ErrorBanner';
import { PageContainer } from '../components/common/PageContainer';
import { Spinner } from '../components/common/Spinner';
import { SessionBadge } from '../components/auth/SessionBadge';
import { IssuePolicySection } from '../components/policy/IssuePolicySection';
import { PolicyResult } from '../components/policy/PolicyResult';
import { QuoteForm } from '../components/quote/QuoteForm';
import { QuoteResult } from '../components/quote/QuoteResult';
import { useAuth } from '../hooks/useAuth';
import { useCatalogs } from '../hooks/useCatalogs';
import { usePolicy } from '../hooks/usePolicy';
import { useQuoteFlow } from '../hooks/useQuoteFlow';
import { useQuoteStore } from '../store/quote.store';
import { useUiStore } from '../store/ui.store';

export function QuotePage() {
  const navigate = useNavigate();
  const {
    insuranceTypes,
    locations,
    coverages,
    isLoadingInitial,
    isLoadingCoverages,
    catalogsError,
    coveragesError,
    selectedInsuranceType,
    loadInitialCatalogs,
    loadCoverages,
  } = useCatalogs();
  const { isSubmittingQuote, submitQuote } = useQuoteFlow();
  const { email, logout } = useAuth();
  const { isIssuingPolicy, issuePolicy } = usePolicy();
  const currentQuote = useQuoteStore((state) => state.currentQuote);
  const currentPolicy = useQuoteStore((state) => state.currentPolicy);
  const globalError = useUiStore((state) => state.globalError);
  const clearGlobalError = useUiStore((state) => state.clearGlobalError);

  return (
    <PageContainer>
      <div className="grid gap-8">
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
          <div className="space-y-6">
            <span className="inline-flex w-fit rounded-full border border-teal-300/80 bg-teal-50/90 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-teal-800">
              Insurance Platform
            </span>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">Insurance Quoter</h1>
              <p className="max-w-3xl text-base leading-7 text-slate-600">
                Cotiza seguros, autentica una sesión real contra el API Gateway y emite pólizas desde una sola pantalla.
              </p>
            </div>
          </div>

          {email ? (
            <SessionBadge
              email={email}
              onLogout={() => {
                logout();
                navigate(appRoutes.login);
              }}
            />
          ) : (
            <Card className="border-teal-100 bg-[linear-gradient(135deg,rgba(240,253,250,0.98),rgba(239,246,255,0.96))] text-slate-900">
              <p className="text-sm uppercase tracking-[0.18em] text-teal-700">Flujo conectado</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>1. Carga catálogos reales desde `http://localhost:3050`.</li>
                <li>2. Calcula la cotización con breakdown detallado.</li>
                <li>3. Emite pólizas con una sesión autenticada.</li>
              </ul>
            </Card>
          )}
        </section>

        {globalError ? <ErrorBanner message={globalError} onClose={clearGlobalError} /> : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(0,1.22fr)_minmax(320px,0.78fr)]">
          <div className="space-y-8">
            <Card>
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">1. Cotización</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Completa los datos y obtén una cotización con desglose de factores.</p>
                </div>
                {isLoadingInitial ? (
                  <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm text-slate-500 shadow-sm">
                    <Spinner className="size-4 text-teal-700" />
                    <span>Cargando catálogos...</span>
                  </div>
                ) : null}
              </div>

              {catalogsError ? <ErrorBanner message={catalogsError} actionLabel="Reintentar" onAction={() => void loadInitialCatalogs()} /> : null}

              <QuoteForm
                insuranceTypes={insuranceTypes}
                locations={locations}
                coverages={coverages}
                isLoadingCatalogs={isLoadingInitial}
                isLoadingCoverages={isLoadingCoverages}
                coveragesError={coveragesError}
                onRetryCoverages={() => void loadCoverages(selectedInsuranceType)}
                onInsuranceTypeChange={(insuranceType) => void loadCoverages(insuranceType)}
                onSubmitQuote={submitQuote}
                isSubmitting={isSubmittingQuote}
              />
            </Card>

            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-950">2. Resultado de cotización</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">Revisa la prima estimada y entiende cómo se construyó.</p>
              </div>

              {currentQuote ? (
                <QuoteResult quote={currentQuote} />
              ) : (
                <EmptyState title="Aún no hay una cotización" description="Completa el formulario y presiona “Cotizar” para visualizar el resultado aquí." />
              )}
            </Card>
          </div>

          <div className="space-y-8 xl:sticky xl:top-8 xl:self-start">
            <Card className="bg-white/70">
              <div className="space-y-5">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-slate-500">Flujo de trabajo</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">Estado de la operación</h2>
                </div>
                <ol className="space-y-4">
                  <li className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-4">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-teal-50 text-sm font-semibold text-teal-700">
                      1
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Completa la cotización</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Selecciona el tipo de seguro, la cobertura, la edad y la ubicación.</p>
                    </div>
                  </li>
                  <li className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-4">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-sm font-semibold text-amber-700">
                      2
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Revisa el breakdown</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Verifica la prima estimada y los factores que componen el resultado.</p>
                    </div>
                  </li>
                  <li className="flex gap-3 rounded-2xl border border-slate-200/80 bg-white/75 px-4 py-4">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-semibold text-emerald-700">
                      3
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Emite la póliza</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">Confirma la emisión solo cuando la cotización y la sesión estén listas.</p>
                    </div>
                  </li>
                </ol>
              </div>
            </Card>

            <Card>
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-950">3. Emisión de póliza</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Confirma la emisión de la póliza usando la sesión autenticada y la cotización actual.
                </p>
              </div>

              <div className="space-y-6">
                {currentQuote ? (
                  <IssuePolicySection
                    quote={currentQuote}
                    policy={currentPolicy}
                    isAuthenticated
                    isLoading={isIssuingPolicy}
                    onIssuePolicy={issuePolicy}
                  />
                ) : (
                  <EmptyState title="Emisión bloqueada" description="Necesitas una cotización válida antes de poder emitir una póliza." />
                )}
              </div>
            </Card>

            {currentPolicy ? (
              <Card>
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-slate-950">4. Resultado de póliza</h2>
                  <p className="mt-1 text-sm leading-6 text-slate-600">Resumen de la póliza emitida con estado y fecha de emisión.</p>
                </div>
                <PolicyResult policy={currentPolicy} />
              </Card>
            ) : null}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
