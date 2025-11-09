# LTI - Talent Tracking System | ENG

This project is a full-stack application with a React frontend and an Express backend using Prisma as an ORM. The frontend is set up with Create React App, and the backend is written in TypeScript.

## Explanation of Directories and Files

- `backend/`: It contains the server-side code written in Node.js.
  - `src/`: It contains the source code for the backend.
    - `index.ts`: The entry point for the backend server.
    - `application/`: It contains the application logic.
    - `domain/`: It contains the business logic.
    - `presentation/`: It contains code related to the presentation layer (such as controllers).
    - `routes/`: It contains the route definitions for the API.
  - `prisma/`: It contains the Prisma schema file for ORM.
  - `tsconfig.json`: TypeScript configuration file.
- `frontend/`: It contains the client-side code written in React.
  - `src/`: It contains the source code for the frontend.
  - `public/`: It contains static files such as the HTML file and images.
  - `build/`: It contains the production-ready build of the frontend.
- `.env`: It contains the environment variables.
- `docker-compose.yml`: It contains the Docker Compose configuration to manage your application's services.
- `README.md`: This file contains information about the project and instructions on how to run it.

## Project Structure

The project is divided into two main directories: frontend and backend.

### Frontend

The frontend is a React application, and its main files are located in the src folder. The public folder contains static assets, and the build directory contains the production build of the application.

### Backend

The backend is an Express application written in TypeScript. The src directory contains the source code, divided into several subdirectories:

- `application`: It contains the application logic.
- `domain`: It contains the domain models.
- `infrastructure`: It contains code related to the infrastructure.
- `presentation`: It contains code related to the presentation layer.
- `routes`: It contains the application routes.
- `tests`: It contains the application tests.

The `prisma` folder contains the Prisma schema.

## First Steps

To get started with this project, follow these steps:

1. Clone the repo.
2. Install the dependencies for front end and back end:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Build the back end server:
```
cd backend
npm run build
````
4. Start the backend server:
```
cd backend
npm start
```
5. In a new terminal window, build the frontend server:
```
cd frontend
npm run build
```
6. Start the frontend server:
```
cd frontend
npm start
```

The backend server will be running at http://localhost:3010, and the frontend will be available at http://localhost:3000.

## Running Tests

This project includes comprehensive unit tests for both backend and frontend with high code coverage targets.

### Backend Tests

The backend uses **Jest** with **ts-jest** for TypeScript support. Code coverage threshold is set to **≥ 90%**.

#### Prerequisites
All testing dependencies are already included in `package.json`. If you need to reinstall:
```sh
cd backend
npm install
```

#### Run Tests
```sh
cd backend

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Run tests in verbose mode
npm run test:verbose
```

#### Coverage Report
After running `npm run test:coverage`, you can view the detailed HTML coverage report:
```sh
# Open coverage/lcov-report/index.html in your browser
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

#### Backend Test Structure
```
backend/src/
├── application/__tests__/
│   ├── validator.test.ts (33 test cases)
│   └── services/__tests__/
│       ├── candidateService.test.ts (15 test cases)
│       └── fileUploadService.test.ts (12 test cases)
├── domain/models/__tests__/
│   ├── Candidate.test.ts (21 test cases)
│   ├── Education.test.ts (12 test cases)
│   ├── WorkExperience.test.ts (13 test cases)
│   └── Resume.test.ts (9 test cases)
└── presentation/controllers/__tests__/
    └── candidateController.test.ts (6 test cases)

Total: 121 test cases
```

### Frontend Tests

The frontend uses **Jest** with **@testing-library/react** for component testing. Code coverage threshold is set to **≥ 85%**.

#### Prerequisites
Install Babel dependencies for Jest (if not already installed):
```sh
cd frontend
npm install --save-dev @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy
```

#### Run Tests
```sh
cd frontend

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### Coverage Report
After running `npm run test:coverage`, view the HTML coverage report:
```sh
# Open coverage/lcov-report/index.html in your browser
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

#### Frontend Test Structure
```
frontend/src/
├── services/__tests__/
│   └── candidateService.test.js (10 test cases)
├── components/__tests__/
│   ├── FileUploader.test.js (15 test cases)
│   ├── AddCandidateForm.test.js (38 test cases)
│   └── RecruiterDashboard.test.js (5 test cases)
└── __tests__/
    └── App.test.js (6 test cases)

Total: 74 test cases
```

### Test Best Practices Used

- **AAA Pattern**: All tests follow Arrange-Act-Assert structure with clear comments
- **Descriptive Naming**: Test names describe expected behavior in Spanish
- **Comprehensive Mocking**: External dependencies (Prisma, axios, fetch) are properly mocked
- **Edge Cases**: Tests cover error handling, null/undefined values, and boundary conditions
- **Integration Tests**: Include end-to-end workflow testing for critical paths

## Docker y PostgreSQL

This project uses Docker to run a PostgreSQL database. Here’s how to get it up and running:

Install Docker on your machine if you haven't done so already. You can download it from here.
Navigate to the root directory of the project in your terminal.
Run the following command to start the Docker container:
```
docker-compose up -d
```
This will start a PostgreSQL database in a Docker container. The -d flag runs the container in detached mode, which means it runs in the background.

To access the PostgreSQL database, you can use any PostgreSQL client with the following connection details:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: mydatabase

Please replace User, Password, and Database with the actual username, password, and database name specified in your .env file.

To stop the Docker container, run the following command:
```
docker-compose down
```

To generate the database using Prisma, follow these steps:

1. Make sure that the `.env` file in the root directory of the backend contains the `DATABASE_URL` variable with the correct connection string to your PostgreSQL database. If it doesn’t work, try replacing the full URL directly in `schema.prisma`, in the `url` variable.

2. Open a terminal and navigate to the backend directory where the `schema.prisma` file is located.

3. Run the following command to apply the migrations to your database:

```
npx prisma migrate dev
```

Once you have completed all the steps, you should be able to save new candidates, both via the web and via the API, and see them in the database.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```
-------------------------------------------------------------

# LTI - Sistema de Seguimiento de Talento | ES

Este proyecto es una aplicación full-stack con un frontend en React y un backend en Express usando Prisma como un ORM. El frontend se inicia con Create React App y el backend está escrito en TypeScript.

## Explicación de Directorios y Archivos

- `backend/`: Contiene el código del lado del servidor escrito en Node.js.
  - `src/`: Contiene el código fuente para el backend.
    - `index.ts`: El punto de entrada para el servidor backend.
    - `application/`: Contiene la lógica de aplicación.
    - `domain/`: Contiene la lógica de negocio.
    - `presentation/`: Contiene código relacionado con la capa de presentación (como controladores).
    - `routes/`: Contiene las definiciones de rutas para la API.
  - `prisma/`: Contiene el archivo de esquema de Prisma para ORM.
  - `tsconfig.json`: Archivo de configuración de TypeScript.
- `frontend/`: Contiene el código del lado del cliente escrito en React.
  - `src/`: Contiene el código fuente para el frontend.
  - `public/`: Contiene archivos estáticos como el archivo HTML e imágenes.
  - `build/`: Contiene la construcción lista para producción del frontend.
- `.env`: Contiene las variables de entorno.
- `docker-compose.yml`: Contiene la configuración de Docker Compose para gestionar los servicios de tu aplicación.
- `README.md`: Este archivo, contiene información sobre el proyecto e instrucciones sobre cómo ejecutarlo.

## Estructura del Proyecto

El proyecto está dividido en dos directorios principales: `frontend` y `backend`.

### Frontend

El frontend es una aplicación React y sus archivos principales están ubicados en el directorio `src`. El directorio `public` contiene activos estáticos y el directorio `build` contiene la construcción de producción de la aplicación.

### Backend

El backend es una aplicación Express escrita en TypeScript. El directorio `src` contiene el código fuente, dividido en varios subdirectorios:

- `application`: Contiene la lógica de aplicación.
- `domain`: Contiene los modelos de dominio.
- `infrastructure`: Contiene código relacionado con la infraestructura.
- `presentation`: Contiene código relacionado con la capa de presentación.
- `routes`: Contiene las rutas de la aplicación.
- `tests`: Contiene las pruebas de la aplicación.

El directorio `prisma` contiene el esquema de Prisma.

## Primeros Pasos

Para comenzar con este proyecto, sigue estos pasos:

1. Clona el repositorio.
2. Instala las dependencias para el frontend y el backend:
```sh
cd frontend
npm install

cd ../backend
npm install
```
3. Construye el servidor backend:
```
cd backend
npm run build
````
4. Inicia el servidor backend:
```
cd backend
npm start
```
5. En una nueva ventana de terminal, construye el servidor frontend:
```
cd frontend
npm run build
```
6. Inicia el servidor frontend:
```
cd frontend
npm start
```

El servidor backend estará corriendo en http://localhost:3010 y el frontend estará disponible en http://localhost:3000.

## Ejecutar Pruebas

Este proyecto incluye pruebas unitarias completas tanto para backend como para frontend con altos objetivos de cobertura de código.

### Pruebas del Backend

El backend utiliza **Jest** con **ts-jest** para soporte de TypeScript. El umbral de cobertura de código está configurado en **≥ 90%**.

#### Prerequisitos
Todas las dependencias de pruebas ya están incluidas en `package.json`. Si necesitas reinstalar:
```sh
cd backend
npm install
```

#### Ejecutar Pruebas
```sh
cd backend

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage

# Ejecutar pruebas en modo observación (se re-ejecutan automáticamente al cambiar archivos)
npm run test:watch

# Ejecutar pruebas en modo verbose
npm run test:verbose
```

#### Reporte de Cobertura
Después de ejecutar `npm run test:coverage`, puedes ver el reporte de cobertura detallado en HTML:
```sh
# Abrir coverage/lcov-report/index.html en tu navegador
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

#### Estructura de Pruebas del Backend
```
backend/src/
├── application/__tests__/
│   ├── validator.test.ts (33 casos de prueba)
│   └── services/__tests__/
│       ├── candidateService.test.ts (15 casos de prueba)
│       └── fileUploadService.test.ts (12 casos de prueba)
├── domain/models/__tests__/
│   ├── Candidate.test.ts (21 casos de prueba)
│   ├── Education.test.ts (12 casos de prueba)
│   ├── WorkExperience.test.ts (13 casos de prueba)
│   └── Resume.test.ts (9 casos de prueba)
└── presentation/controllers/__tests__/
    └── candidateController.test.ts (6 casos de prueba)

Total: 121 casos de prueba
```

### Pruebas del Frontend

El frontend utiliza **Jest** con **@testing-library/react** para pruebas de componentes. El umbral de cobertura de código está configurado en **≥ 85%**.

#### Prerequisitos
Instalar dependencias de Babel para Jest (si no están instaladas):
```sh
cd frontend
npm install --save-dev @babel/preset-env @babel/preset-react babel-jest identity-obj-proxy
```

#### Ejecutar Pruebas
```sh
cd frontend

# Ejecutar todas las pruebas
npm test

# Ejecutar pruebas con reporte de cobertura
npm run test:coverage

# Ejecutar pruebas en modo observación
npm run test:watch
```

#### Reporte de Cobertura
Después de ejecutar `npm run test:coverage`, ver el reporte de cobertura en HTML:
```sh
# Abrir coverage/lcov-report/index.html en tu navegador
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

#### Estructura de Pruebas del Frontend
```
frontend/src/
├── services/__tests__/
│   └── candidateService.test.js (10 casos de prueba)
├── components/__tests__/
│   ├── FileUploader.test.js (15 casos de prueba)
│   ├── AddCandidateForm.test.js (38 casos de prueba)
│   └── RecruiterDashboard.test.js (5 casos de prueba)
└── __tests__/
    └── App.test.js (6 casos de prueba)

Total: 74 casos de prueba
```

### Mejores Prácticas de Pruebas Utilizadas

- **Patrón AAA**: Todas las pruebas siguen la estructura Arrange-Act-Assert con comentarios claros
- **Nomenclatura Descriptiva**: Los nombres de las pruebas describen el comportamiento esperado en español
- **Mocking Completo**: Las dependencias externas (Prisma, axios, fetch) están correctamente mockeadas
- **Casos Límite**: Las pruebas cubren manejo de errores, valores null/undefined y condiciones de frontera
- **Pruebas de Integración**: Incluyen pruebas de flujos de trabajo completos para rutas críticas

## Docker y PostgreSQL

Este proyecto usa Docker para ejecutar una base de datos PostgreSQL. Así es cómo ponerlo en marcha:

Instala Docker en tu máquina si aún no lo has hecho. Puedes descargarlo desde aquí.
Navega al directorio raíz del proyecto en tu terminal.
Ejecuta el siguiente comando para iniciar el contenedor Docker:
```
docker-compose up -d
```
Esto iniciará una base de datos PostgreSQL en un contenedor Docker. La bandera -d corre el contenedor en modo separado, lo que significa que se ejecuta en segundo plano.

Para acceder a la base de datos PostgreSQL, puedes usar cualquier cliente PostgreSQL con los siguientes detalles de conexión:
 - Host: localhost
 - Port: 5432
 - User: postgres
 - Password: password
 - Database: mydatabase

Por favor, reemplaza User, Password y Database con el usuario, la contraseña y el nombre de la base de datos reales especificados en tu archivo .env.

Para detener el contenedor Docker, ejecuta el siguiente comando:
```
docker-compose down
```

Para generar la base de datos utilizando Prisma, sigue estos pasos:

1. Asegúrate de que el archivo `.env` en el directorio raíz del backend contenga la variable `DATABASE_URL` con la cadena de conexión correcta a tu base de datos PostgreSQL. Si no te funciona, prueba a reemplazar la URL completa directamente en `schema.prisma`, en la variable `url`.

2. Abre una terminal y navega al directorio del backend donde se encuentra el archivo `schema.prisma`.

3. Ejecuta el siguiente comando para aplicar las migraciones a tu base de datos:
```
npx prisma migrate dev
```

Una vez has dado todos los pasos, deberías poder guardar nuevos candidatos, tanto via web, como via API, y verlos en la base de datos.

```
POST http://localhost:3010/candidates
{
    "firstName": "Albert",
    "lastName": "Saelices",
    "email": "albert.saelices@gmail.com",
    "phone": "656874937",
    "address": "Calle Sant Dalmir 2, 5ºB. Barcelona",
    "educations": [
        {
            "institution": "UC3M",
            "title": "Computer Science",
            "startDate": "2006-12-31",
            "endDate": "2010-12-26"
        }
    ],
    "workExperiences": [
        {
            "company": "Coca Cola",
            "position": "SWE",
            "description": "",
            "startDate": "2011-01-13",
            "endDate": "2013-01-17"
        }
    ],
    "cv": {
        "filePath": "uploads/1715760936750-cv.pdf",
        "fileType": "application/pdf"
    }
}
```
