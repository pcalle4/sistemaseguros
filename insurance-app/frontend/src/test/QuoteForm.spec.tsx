import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuoteForm } from '../presentation/components/quote/QuoteForm';

const insuranceTypes = [{ code: 'AUTO', name: 'Seguro de Auto' }];
const locations = [{ code: 'EC-AZUAY', name: 'Azuay' }];
const coverages = [{ code: 'PREMIUM', name: 'Premium' }];

describe('QuoteForm', () => {
  it('muestra errores visibles cuando se envía sin campos válidos', async () => {
    const user = userEvent.setup();

    render(
      <QuoteForm
        insuranceTypes={insuranceTypes}
        locations={locations}
        coverages={[]}
        isLoadingCatalogs={false}
        isLoadingCoverages={false}
        coveragesError={null}
        onRetryCoverages={() => undefined}
        onInsuranceTypeChange={() => undefined}
        onSubmitQuote={async () => undefined}
        isSubmitting={false}
      />,
    );

    await user.clear(screen.getByLabelText('Edad'));
    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    expect(await screen.findByText('Selecciona un tipo de seguro')).toBeInTheDocument();
    expect(screen.getByText('Selecciona una cobertura')).toBeInTheDocument();
    expect(screen.getByText('La edad mínima es 18')).toBeInTheDocument();
    expect(screen.getByText('Selecciona una ubicación', { selector: '#location-error' })).toBeInTheDocument();
  });

  it('muestra error si la edad es menor a 18', async () => {
    const user = userEvent.setup();
    const submitQuote = vi.fn();

    render(
      <QuoteForm
        insuranceTypes={insuranceTypes}
        locations={locations}
        coverages={coverages}
        isLoadingCatalogs={false}
        isLoadingCoverages={false}
        coveragesError={null}
        onRetryCoverages={() => undefined}
        onInsuranceTypeChange={() => undefined}
        onSubmitQuote={submitQuote}
        isSubmitting={false}
      />,
    );

    await user.selectOptions(screen.getByLabelText('Tipo de seguro'), 'AUTO');
    await user.selectOptions(screen.getByLabelText('Cobertura'), 'PREMIUM');
    fireEvent.input(screen.getByLabelText('Edad'), { target: { value: '16', valueAsNumber: 16 } });
    await user.selectOptions(screen.getByLabelText('Ubicación'), 'EC-AZUAY');
    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    expect(submitQuote).not.toHaveBeenCalled();
  });
});
