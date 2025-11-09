import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RecruiterDashboard from '../RecruiterDashboard';

// Helper function to render with router
const renderWithRouter = (component) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('RecruiterDashboard', () => {
  it('debería renderizar título "Dashboard del Reclutador"', () => {
    // Arrange & Act
    renderWithRouter(<RecruiterDashboard />);

    // Assert
    expect(screen.getByRole('heading', { name: /dashboard del reclutador/i })).toBeInTheDocument();
  });

  it('debería renderizar logo de LTI', () => {
    // Arrange & Act
    renderWithRouter(<RecruiterDashboard />);

    // Assert
    const logo = screen.getByAltText(/lti logo/i);
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');
  });

  it('debería renderizar botón "Añadir Nuevo Candidato"', () => {
    // Arrange & Act
    renderWithRouter(<RecruiterDashboard />);

    // Assert
    const addButton = screen.getByRole('button', { name: /añadir nuevo candidato/i });
    expect(addButton).toBeInTheDocument();
  });

  it('debería renderizar Link a /add-candidate', () => {
    // Arrange & Act
    renderWithRouter(<RecruiterDashboard />);

    // Assert
    const link = screen.getByRole('link', { name: /añadir nuevo candidato/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/add-candidate');
  });

  it('debería tener estructura de Bootstrap correcta', () => {
    // Arrange & Act
    const { container } = renderWithRouter(<RecruiterDashboard />);

    // Assert
    const mainContainer = container.querySelector('.container');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer).toHaveClass('mt-5');

    const row = container.querySelector('.row');
    expect(row).toBeInTheDocument();

    const card = container.querySelector('.card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('shadow', 'p-4');
  });
});
