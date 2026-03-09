import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppApiError } from '../core/types/problem-details';
import { QuotePage } from '../presentation/pages/QuotePage';

const mockServices = vi.hoisted(() => ({
  getInsuranceTypes: { execute: vi.fn() },
  getCoverages: { execute: vi.fn() },
  getLocations: { execute: vi.fn() },
  createQuote: { execute: vi.fn() },
  login: { execute: vi.fn() },
  issuePolicy: { execute: vi.fn() },
}));

vi.mock('../infrastructure/container/services', () => ({
  services: mockServices,
}));

describe('Problem Details mapping', () => {
  it('muestra el error de campo enviado por el backend', async () => {
    const user = userEvent.setup();

    mockServices.getInsuranceTypes.execute.mockResolvedValue({
      items: [{ code: 'AUTO', name: 'Seguro de Auto' }],
    });
    mockServices.getLocations.execute.mockResolvedValue({
      items: [{ code: 'EC-AZUAY', name: 'Azuay' }],
    });
    mockServices.getCoverages.execute.mockResolvedValue({
      items: [{ code: 'PREMIUM', name: 'Premium' }],
    });
    mockServices.createQuote.execute.mockRejectedValue(
      new AppApiError({
        status: 400,
        globalMessage: 'Validation failed',
        fieldErrors: {
          insuranceType: 'must be a valid catalog value',
        },
      }),
    );

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockServices.getInsuranceTypes.execute).toHaveBeenCalled());

    await user.selectOptions(screen.getByLabelText('Tipo de seguro'), 'AUTO');
    await waitFor(() => expect(mockServices.getCoverages.execute).toHaveBeenCalled());
    await user.selectOptions(screen.getByLabelText('Cobertura'), 'PREMIUM');
    await user.clear(screen.getByLabelText('Edad'));
    await user.type(screen.getByLabelText('Edad'), '35');
    await user.selectOptions(screen.getByLabelText('Ubicación'), 'EC-AZUAY');
    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    expect(await screen.findByText('must be a valid catalog value')).toBeInTheDocument();
  });
});
