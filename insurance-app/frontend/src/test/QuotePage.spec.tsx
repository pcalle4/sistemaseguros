import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

describe('QuotePage', () => {
  it('carga catálogos, envía la cotización y muestra prima y breakdown', async () => {
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
    mockServices.createQuote.execute.mockResolvedValue({
      id: 'quote-1',
      status: 'QUOTED',
      inputs: {
        insuranceType: 'AUTO',
        coverage: 'PREMIUM',
        age: 35,
        location: 'EC-AZUAY',
      },
      estimatedPremium: 350,
      breakdown: [
        { concept: 'BASE', amount: 200 },
        { concept: 'AGE_FACTOR', amount: 60 },
      ],
      createdAt: '2026-03-09T16:00:00.000Z',
    });

    render(
      <MemoryRouter>
        <QuotePage />
      </MemoryRouter>,
    );

    await waitFor(() => expect(mockServices.getInsuranceTypes.execute).toHaveBeenCalledTimes(1));

    await user.selectOptions(screen.getByLabelText('Tipo de seguro'), 'AUTO');
    await waitFor(() => expect(mockServices.getCoverages.execute).toHaveBeenCalledWith('AUTO'));
    await user.selectOptions(screen.getByLabelText('Cobertura'), 'PREMIUM');
    await user.clear(screen.getByLabelText('Edad'));
    await user.type(screen.getByLabelText('Edad'), '35');
    await user.selectOptions(screen.getByLabelText('Ubicación'), 'EC-AZUAY');
    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    expect(await screen.findByText(/350/)).toBeInTheDocument();
    expect(screen.getByText('Prima base')).toBeInTheDocument();
    expect(screen.getByText('Factor por edad')).toBeInTheDocument();
  });
});
