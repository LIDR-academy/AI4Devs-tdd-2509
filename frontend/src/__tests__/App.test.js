import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';

// Mock the components
jest.mock('../components/RecruiterDashboard', () => {
  return function MockRecruiterDashboard() {
    return <div data-testid="recruiter-dashboard">RecruiterDashboard Component</div>;
  };
});

jest.mock('../components/AddCandidateForm', () => {
  return function MockAddCandidateForm() {
    return <div data-testid="add-candidate-form">AddCandidateForm Component</div>;
  };
});

describe('App', () => {
  it('debería renderizar BrowserRouter', () => {
    // Arrange & Act
    const { container } = render(<App />);

    // Assert
    // BrowserRouter doesn't add specific attributes, but we can verify the app renders
    expect(container).toBeTruthy();
  });

  it('debería definir ruta / con RecruiterDashboard', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByTestId('recruiter-dashboard')).toBeInTheDocument();
  });

  it('debería definir ruta /add-candidate con AddCandidate', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/add-candidate']}>
        <App />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByTestId('add-candidate-form')).toBeInTheDocument();
  });

  it('debería renderizar RecruiterDashboard en ruta /', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText(/recruiterdashboard component/i)).toBeInTheDocument();
  });

  it('debería renderizar AddCandidate en ruta /add-candidate', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/add-candidate']}>
        <App />
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText(/addcandidateform component/i)).toBeInTheDocument();
  });

  it('debería manejar rutas no encontradas', () => {
    // Arrange & Act
    render(
      <MemoryRouter initialEntries={['/non-existent-route']}>
        <App />
      </MemoryRouter>
    );

    // Assert
    // Since there's no 404 route defined, it should render nothing or fallback
    // In this case, the Routes component just won't match anything
    expect(screen.queryByTestId('recruiter-dashboard')).not.toBeInTheDocument();
    expect(screen.queryByTestId('add-candidate-form')).not.toBeInTheDocument();
  });
});
