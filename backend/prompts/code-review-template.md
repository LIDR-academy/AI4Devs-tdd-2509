**Code Review Summary:**

*   **Reviewer:** [Reviewer's Name]
*   **Date of Review:** [Date]
*   **Pull Request/Commit ID:** [Link to PR/Commit]
*   **Overall Impression:** [Brief summary of the code quality and readiness for merging]

**Detailed Feedback:**

1.  **Functionality/Correctness:**
    *   [Comment on whether the code meets the intended functionality and handles edge cases correctly.]
    *   [Example: "The user authentication flow works correctly, but doesn't handle expired JWT tokens gracefully."]

2.  **Frontend (React + TypeScript + Bootstrap):**
    *   **Component Design:** [Comment on component structure, props typing, and reusability.]
        *   [Example: "The `UserProfile` component should use proper TypeScript interfaces for props instead of `any`."]
    *   **State Management:** [Comment on useState, useEffect, and custom hooks usage.]
        *   [Example: "Consider using useCallback to prevent unnecessary re-renders in the `ProductList` component."]
    *   **Bootstrap Integration:** [Comment on responsive design and Bootstrap class usage.]
        *   [Example: "Use Bootstrap's grid system consistently; avoid mixing custom CSS grid with Bootstrap classes."]
    *   **TypeScript Usage:** [Comment on type safety and interface definitions.]
        *   [Example: "Define proper interfaces for API responses instead of using generic `Record<string, any>`."]

3.  **Backend (Express.js + TypeScript):**
    *   **Route Design:** [Comment on RESTful patterns and endpoint structure.]
        *   [Example: "The `/api/users/:id/orders` endpoint should return 404 for non-existent users before querying orders."]
    *   **Middleware Usage:** [Comment on authentication, validation, and error handling middleware.]
        *   [Example: "Add input validation middleware using zod or joi for all POST/PUT endpoints."]
    *   **TypeScript Implementation:** [Comment on type definitions and error handling.]
        *   [Example: "Use proper typing for Express Request/Response objects with custom interfaces."]

4.  **Database & ORM (Prisma + PostgreSQL):**
    *   **Schema Design:** [Comment on database relationships and constraints.]
        *   [Example: "Consider adding database-level constraints for email uniqueness in the User model."]
    *   **Query Optimization:** [Comment on query efficiency and N+1 problems.]
        *   [Example: "Use Prisma's `include` to avoid multiple database calls in the `getUserWithOrders` function."]
    *   **Migrations:** [Comment on migration safety and rollback strategies.]
        *   [Example: "The migration removes a column without a rollback strategy; consider a two-phase approach."]

5.  **File Handling (Multer):**
    *   **Security:** [Comment on file validation and storage security.]
        *   [Example: "Add file type validation and virus scanning before storing uploaded files."]
    *   **Storage Strategy:** [Comment on file organization and cleanup.]
        *   [Example: "Implement automatic cleanup of temporary files after processing."]

6.  **API Design & Integration:**
    *   **Request/Response Patterns:** [Comment on API consistency and error responses.]
        *   [Example: "Standardize error response format across all endpoints with consistent status codes."]
    *   **Data Validation:** [Comment on input validation and sanitization.]
        *   [Example: "Add server-side validation that matches frontend TypeScript interfaces."]

7.  **Security:**
    *   [Comment on authentication, authorization, and data protection.]
    *   [Example: "Implement rate limiting for login endpoints to prevent brute force attacks."]
    *   [Example: "Use HTTPS-only cookies for JWT tokens and implement CSRF protection."]

8.  **Performance/Efficiency:**
    *   [Comment on potential performance bottlenecks or opportunities for optimization.]
    *   [Example: "Consider implementing pagination for the product listing to improve initial load time."]
    *   [Example: "Add database indexes for frequently queried fields like `user.email`."]

9.  **Testing:**
    *   **Frontend Testing:** [Comment on component testing and integration tests.]
        *   [Example: "Add React Testing Library tests for user interaction flows in the checkout component."]
    *   **Backend Testing:** [Comment on unit tests and API endpoint testing.]
        *   [Example: "Add integration tests for authentication middleware using Jest and supertest."]
    *   **Database Testing:** [Comment on test database setup and data seeding.]
        *   [Example: "Use Prisma's test database features for isolated testing environments."]

10. **Code Quality & Maintainability:**
    *   [Comment on code organization, naming conventions, and documentation.]
    *   [Example: "Follow consistent naming conventions: use camelCase for variables and PascalCase for components."]
    *   [Example: "Add JSDoc comments for complex utility functions and custom hooks."]

**Action Items/Recommendations:**

*   [Specific, actionable steps the author should take to address the feedback.]
*   [Example: "Refactor the authentication service to use proper TypeScript interfaces."]
*   [Example: "Add Prisma query optimization for the dashboard data fetching."]
*   [Example: "Implement proper error boundaries in React components."]

**Approval Status:**

*   **Approved:** [Yes/No]
*   **Requires Changes:** [Yes/No]
*   **Further Discussion Needed:** [Yes/No]

**Tech Stack Specific Checklist:**
- [ ] TypeScript strict mode enabled and no `any` types used unnecessarily
- [ ] React components properly typed with interfaces
- [ ] Express routes have proper error handling and validation
- [ ] Prisma queries are optimized and use proper relations
- [ ] File uploads have security validations (type, size, scanning)
- [ ] Bootstrap classes used consistently without conflicting custom CSS
- [ ] Database migrations are reversible and safe for production
- [ ] API endpoints follow RESTful conventions
- [ ] Environment variables properly configured for all environments