import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import Overview from './Overview.js';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.unmock('recharts');
import { Toaster as ToastProvider } from '../components/ui/sonner.js';

vi.mock('../components/dashboard/PhaseProgress.js', () => ({
  default: ({ onPhaseClick }: { onPhaseClick: (name: string) => void }) => (
    <div data-testid="mocked-phase-progress">
      {/* This button simulates a click on a phase inside the real component */}
      <button onClick={() => onPhaseClick('Planeación')}>Planeación</button>
    </div>
  ),
}));

vi.mock('../components/dashboard/RecentActivity.js', () => ({
  default: () => <div data-testid="mocked-recent-activity">Mocked Recent Activity</div>,
}));

vi.mock('../components/dashboard/ResourceOptimization.js', () => ({
  default: () => <div data-testid="mocked-resource-optimization">Mocked Resource Optimization</div>,
}));

describe('Overview Page', () => {
  test.skip('renders the main heading', () => {
    render(
      <>
        <Overview />
        <ToastProvider />
      </>
    );
    expect(screen.getByText('Visión General')).toBeInTheDocument();
  });

  test.skip('shows a toast when a phase is clicked', async () => {
    render(
      <>
        <Overview />
        <ToastProvider />
      </>
    );
    vi.useFakeTimers();
    
    // Scope the query to within the mocked component to avoid ambiguity
    const phaseProgressMock = screen.getByTestId('mocked-phase-progress');
    const phaseButton = within(phaseProgressMock).getByText('Planeación');
    
    fireEvent.click(phaseButton);

    await waitFor(() => {
      expect(screen.getByText('Fase: Planeación')).toBeInTheDocument();
    });

    vi.useRealTimers();
  });

  // it('shows a toast when optimizing resources', async () => {
  //   render(
  //     <>
  //       <Overview />
  //       <ToastProvider />
  //     </>
  //   );
  //   vi.useFakeTimers();
  //   const optimizeButton = screen.getByText('Optimizar recursos');
  //   fireEvent.click(optimizeButton);

  //   await act(async () => {
  //     vi.runAllTimers();
  //   });

  //   expect(await screen.findByText('Optimización completada')).toBeInTheDocument();
  //   vi.useRealTimers();
  // });

  // it('shows a toast when an activity is clicked', async () => {
  //   render(
  //     <>
  //       <Overview />
  //       <ToastProvider />
  //     </>
  //   );
  //   vi.useFakeTimers();
  //   const activityButton = screen.getByTestId('activity-button');
  //   fireEvent.click(activityButton);

  //   await act(async () => {
  //     vi.runAllTimers();
  //   });

  //   expect(await screen.findByText('Registro de actividad')).toBeInTheDocument();
  //   vi.useRealTimers();
  // });

  // it('shows a toast when exporting a report', async () => {
  //   render(
  //     <>
  //       <Overview />
  //       <ToastProvider />
  //     </>
  //   );
  //   vi.useFakeTimers();
  //   const exportButton = screen.getByText('Exportar reporte');
  //   fireEvent.click(exportButton);

  //   await act(async () => {
  //     vi.runAllTimers();
  //   });

  //   expect(await screen.findByText('Reporte exportado')).toBeInTheDocument();
  //   vi.useRealTimers();
  // });
});
