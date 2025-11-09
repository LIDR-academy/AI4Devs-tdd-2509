---
**Unit Test Scenario Template**

**1. Test Case ID:** [Unique Identifier, e.g., UC-001, FUNC-ADD-001]

**2. Test Case Title/Description:** [Brief, descriptive title summarizing the test's objective, e.g., "Verify successful addition of two positive integers"]

**3. Module/Component Under Test:** [Specify the class, function, or component being tested]

**4. Preconditions/Setup (Arrange):**
    * [List any necessary setup steps, object instantiation, or data preparation required before the test can run. This sets up the test environment.]
    * Example:
        * `Calculator calculator = new Calculator();`
        * `int operand1 = 5;`
        * `int operand2 = 10;`

**5. Test Steps/Action (Act):**
    * [Describe the specific action or method invocation being performed on the component under test.]
    * Example:
        * `int result = calculator.Add(operand1, operand2);`

**6. Expected Result (Assert):**
    * [Clearly define the anticipated outcome or state of the system after the action is performed. This is what the test verifies.]
    * Example:
        * `Assert.AreEqual(15, result);`
        * `Assert.IsTrue(result > 0);`

**7. Post-conditions/Cleanup (Optional):**
    * [Any steps required to clean up resources or revert changes made during the test. Less common in unit tests but can be relevant for integration tests.]

**8. Test Data (if applicable):**
    * [Specify any specific input data used for the test case.]
    * Example:
        * Input: `operand1 = 5`, `operand2 = 10`
        * Expected Output: `15`

**9. Status:** [Pass/Fail - To be filled during execution]

**10. Comments/Notes:** [Any additional relevant information or observations]
---