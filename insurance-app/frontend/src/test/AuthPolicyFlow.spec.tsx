import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

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

describe('Login and policy issue flow', () => {
  it('inicia sesión y emite póliza con una cotización existente', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/login');

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
      id: 'quote-2',
      status: 'QUOTED',
      inputs: {
        insuranceType: 'AUTO',
        coverage: 'PREMIUM',
        age: 35,
        location: 'EC-AZUAY',
      },
      estimatedPremium: 350,
      breakdown: [{ concept: 'BASE', amount: 200 }],
      createdAt: '2026-03-09T16:00:00.000Z',
    });
    mockServices.login.execute.mockResolvedValue({
      accessToken: 'jwt-token',
      tokenType: 'Bearer',
      email: 'user@example.com',
    });
    mockServices.issuePolicy.execute.mockResolvedValue({
      id: 'policy-1',
      quoteId: 'quote-2',
      status: 'ACTIVE',
      issuedAt: '2026-03-09T16:15:00.000Z',
    });

    render(<App />);

    await screen.findByRole('button', { name: 'Iniciar sesión' });
    await user.click(screen.getByRole('button', { name: 'Iniciar sesión' }));
    await screen.findByText('Sesión iniciada como user@example.com');

    await waitFor(() => expect(mockServices.getInsuranceTypes.execute).toHaveBeenCalled());

    await user.selectOptions(screen.getByLabelText('Tipo de seguro'), 'AUTO');
    await waitFor(() => expect(mockServices.getCoverages.execute).toHaveBeenCalledWith('AUTO'));
    await user.selectOptions(screen.getByLabelText('Cobertura'), 'PREMIUM');
    await user.clear(screen.getByLabelText('Edad'));
    await user.type(screen.getByLabelText('Edad'), '35');
    await user.selectOptions(screen.getByLabelText('Ubicación'), 'EC-AZUAY');
    await user.click(screen.getByRole('button', { name: 'Cotizar' }));

    await screen.findByText(/350/);

    await user.click(screen.getByRole('button', { name: 'Emitir póliza' }));
    await user.click(screen.getByRole('button', { name: 'Confirmar emisión' }));

    expect(await screen.findByText('Póliza emitida')).toBeInTheDocument();
    expect(screen.getAllByText('ACTIVE')).not.toHaveLength(0);
    expect(screen.getByText('policy-1')).toBeInTheDocument();
  });
});
