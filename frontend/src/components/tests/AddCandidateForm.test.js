const React = require('react');
const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
require('@testing-library/jest-dom/extend-expect');
const AddCandidateForm = require('../AddCandidateForm').default;

describe('AddCandidateForm - submission success (Acceptance 13)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should prepare payload and show success message on 201', async () => {
    // Arrange: mock fetch to return status 201
    global.fetch.mockResolvedValueOnce({ status: 201 });

    render(React.createElement(AddCandidateForm));

    // Fill required fields
    const nombre = screen.getByLabelText('Nombre');
    const apellido = screen.getByLabelText('Apellido');
    const correo = screen.getByLabelText('Correo Electrónico');

    fireEvent.change(nombre, { target: { value: 'María' } });
    fireEvent.change(apellido, { target: { value: 'Sánchez' } });
    fireEvent.change(correo, { target: { value: 'maria@example.com' } });

    // Act: submit the form
    const submitButton = screen.getByText('Enviar');
    fireEvent.click(submitButton);

    // Assert: success message is shown
    await waitFor(() => expect(screen.getByText('Candidato añadido con éxito')).toBeInTheDocument());

    // Ensure fetch was called with expected endpoint
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toBe('http://localhost:3010/candidates');
    expect(options.method).toBe('POST');
    // Body should be JSON string
    const body = JSON.parse(options.body);
    expect(body.firstName).toBe('María');
    expect(body.lastName).toBe('Sánchez');
    expect(body.email).toBe('maria@example.com');
  });
});
