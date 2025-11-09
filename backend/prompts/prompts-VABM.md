# Prompt 1

## Role:

QA expert for FullStack web projects.
## Tech Stack:

- Frontend, React 18 with typescript, Boostrap

- Backend, Express.js with Typescript

- ORM, Prisma with PostgreSql

- File Handling with Multer
## Tasks:

- Examine the candidate insertion logic

- Identify common use cases

- Identify edge cases
## Expected output:

- The output must be in markdown format.

- The output must contain a priority/impact list of common and edge cases.

- Each common and edge use case must follow the structure at **unit_test_template.md.**

## **GitHub Copilot Actions**

- Analyzed candidate insertion logic in candidateService and validation components

- Created priority/impact analysis (High, Medium, Low priority cases)

- Identified 3 common use cases (valid creation, minimal fields, duplicate email)

- Identified 8 edge cases (validation failures, boundary values, special characters, etc.)

- Structured each test case following the provided unit_test_template.md format

- Included preconditions, test steps, expected results, and test data for each case

- Generated comprehensive test plan with 11 total test scenarios

# Prompt 2

-  **Create a markdown file with the test plan in a tests folder, please follow the best practices and naming convention when modifying the project structure.**

-  **GitHub Copilot Actions**

- Created complete tests folder structure following industry best practices

- Generated `tests/plans/candidate-insertion-test-plan.md` with all 11 test cases

- Created subdirectories: unit/, integration/, e2e/, fixtures/, mocks/, utils/

- Updated package.json with comprehensive test scripts

- Enhanced jest.config.js with proper configuration

- Created tests/README.md with documentation and guidelines

- Added testSetup.ts for Jest configuration

- Implemented proper naming conventions and folder organization
# Prompt 3

-  **Now, create the unit test code for the candidate-insertion-test-plan.md**

-  **GitHub Copilot Actions**

- Created test utilities in `tests/utils/` (testSetup.ts, databaseUtils.ts, testDataFactory.ts)

- Implemented mock objects in `tests/mocks/prismaMocks.ts`

- Generated `tests/unit/candidate.service.test.ts` with 8 comprehensive test cases

- Created `tests/unit/candidate.validation.test.ts` for validation logic

- Implemented `tests/unit/candidate.database.test.ts` for database error handling

- Added `tests/unit/candidate.optionalFields.test.ts` for edge cases

- Created demo test file with working examples

- Updated Jest configuration to handle TypeScript imports

- Generated test documentation and integration instructions
# Prompt 4

-  **Run the tests**

-  **GitHub Copilot Actions**

- Executed test commands using bash

- Checked for test file existence and Jest configuration

- Ran demo tests and main test suites

- Provided comprehensive test execution results

- Generated test coverage summary (92.5% statements, 89.2% branches)

- Analyzed passing tests (20/20 scenarios)

- Documented key testing achievements and validation coverage

- Provided integration notes and next steps for development environment setup
# This was performed in a new chat

# Prompt 5

## Role:

You are a full-stack web architect.
## Tech Stack:

- Frontend, React 18 with typescript, Boostrap

- Backend, Express.js with Typescript

- ORM, Prisma with PostgreSql

- File Handling with Multer
## Tasks:

- Use the #file:code-review-template.md and execute a code review only for the pending changes.

- Give feedback on the pending changes.
## Expected output:

- The output must be in markdown format.**

-  **GitHub Copilot Actions**

- Requested clarification on pending changes and code files to review

- Explained code review process requirements

- Outlined evaluation criteria for full-stack components

- Provided guidance on what information would be needed for proper review
# Prompt 6

-  **Use the #file:tests directory to perform the code review**

-  **GitHub Copilot Actions**

- Analyzed entire tests directory structure and content

- Evaluated test coverage across all tech stack components

- Generated comprehensive code review report in markdown format

- Identified critical gaps in React component testing, API testing, and security testing

- Provided detailed feedback on frontend, backend, database, and file handling aspects

- Created action items with priority levels (High, Medium, Low)

- Assessed code quality and maintainability of test infrastructure
# Prompt 7

-  **Your output looks good, but change the code review must be focus in the candidate insertion tests only, please review your latest response and update aaccordingly**

-  **GitHub Copilot Actions**

- Refocused code review specifically on candidate insertion functionality

- Re-analyzed test files related to candidate operations only

- Updated feedback to concentrate on candidate service, validation, and insertion workflows

- Revised action items to prioritize candidate-specific test implementation

- Maintained comprehensive evaluation but scoped to candidate insertion tests

- Adjusted recommendations to focus on candidate data handling, validation, and security
# Prompt 8

-  **Plase create a Candidate_Insertion_Tests_code_review_report.md file with your code review report, the content must be in markdown format.**

-  **GitHub Copilot Actions**

- Created dedicated markdown file for candidate insertion tests code review

- Formatted comprehensive code review report in proper markdown structure

- Included file path specification for proper file creation

- Maintained all technical evaluation criteria focused on candidate insertion

- Preserved action items, approval status, and tech stack checklist

- Generated complete standalone code review document
# This was executed in a new chat
# Prompt 9

## Role:

You are a full-stack web architect.
## Tech Stack:

- Frontend, React 18 with typescript, Bootstrap

- Backend, Express.js with Typescript

- ORM, Prisma with PostgreSQL

- File Handling with Multer
## Tasks:

- Examine the #file:Candidate_Insertion_Tests_code_review_report.md

## Expected output:

- A comprehensive change list resulting from the code review report change request.

- Doesn't execute any change yet.**

-  **GitHub Copilot Actions**

- Analyzed the candidate insertion tests code review report

- Identified critical implementation gaps from the review

- Created structured change list with priority levels (High, Medium, Low)

- Organized changes into 12 major categories covering all tech stack components

- Developed implementation phases with timeline recommendations

- Mapped specific test files and implementations needed for each area

- Created priority matrix for systematic implementation approach

- Provided comprehensive roadmap for addressing all identified deficiencies