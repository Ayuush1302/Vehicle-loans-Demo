# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: personas.spec.ts >> Persona Scenarios >> Scenario for Vivaan Gupta (ABCPD2002B) - Expects: Referred
- Location: tests/personas.spec.ts:13:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input#full-name')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - generic [ref=e4]: "[plugin:vite:import-analysis] Failed to resolve import \"uuid\" from \"src/components/Step4LoanSetup.tsx\". Does the file exist?"
  - generic [ref=e5]: /Users/ayushchaurasia/Desktop/Vehicle loans Demo/src/components/Step4LoanSetup.tsx:9:29
  - generic [ref=e6]: "4 | import { formatINR, calcEMI, calcAPR, genRefNumber } from \"../types/journey\"; 5 | import { useAppStore } from \"../store/applicationStore\"; 6 | import { v4 as uuidv4 } from \"uuid\"; | ^ 7 | var _jsxFileName = \"/Users/ayushchaurasia/Desktop/Vehicle loans Demo/src/components/Step4LoanSetup.tsx\"; 8 | import { Fragment as _Fragment, jsxDEV as _jsxDEV } from \"react/jsx-dev-runtime\";"
  - generic [ref=e7]: at TransformPluginContext._formatLog (file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:8393:39) at TransformPluginContext.error (file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:8390:14) at normalizeUrl (file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:26058:18) at async file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:26128:30 at async Promise.all (index 5) at async TransformPluginContext.transform (file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:26094:4) at async EnvironmentPluginContainer.transform (file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:8172:14) at async loadAndTransform (file:///Users/ayushchaurasia/Desktop/Vehicle%20loans%20Demo/node_modules/vite/dist/node/chunks/node.js:19634:26)
  - generic [ref=e8]:
    - text: Click outside, press Esc key, or fix the code to dismiss.You can also disable this overlay by setting
    - code [ref=e9]: server.hmr.overlay
    - text: to
    - code [ref=e10]: "false"
    - text: in
    - code [ref=e11]: vite.config.ts
    - text: .
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const personas = [
  4  |   { pan: 'ABCPD1001A', name: 'Aarav Sharma', expectedResult: 'Approved' },
  5  |   { pan: 'ABCPD2002B', name: 'Vivaan Gupta', expectedResult: 'Referred' },
  6  |   { pan: 'ABCPD3003C', name: 'Vihaan Patel', expectedResult: 'Counter-offer' },
  7  |   { pan: 'ABCPD4004D', name: 'Arjun Singh', expectedResult: 'Declined' },
  8  |   { pan: 'ABCPD5005E', name: 'Sai Kumar', expectedResult: 'Declined' }
  9  | ];
  10 | 
  11 | test.describe('Persona Scenarios', () => {
  12 |   for (const persona of personas) {
  13 |     test(`Scenario for ${persona.name} (${persona.pan}) - Expects: ${persona.expectedResult}`, async ({ page }) => {
  14 |       await page.goto('/');
  15 |       
  16 |       // 1. Onboarding
> 17 |       await page.locator('input#full-name').fill(persona.name);
     |                                             ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  18 |       await page.locator('input#mobile').fill('9876543210');
  19 |       await page.locator('input#dob').fill('01/01/1990');
  20 |       await page.locator('input#pan').fill(persona.pan);
  21 |       
  22 |       await page.locator('input[type="checkbox"]').nth(0).check({ force: true });
  23 |       await page.locator('input[type="checkbox"]').nth(1).check({ force: true });
  24 |       await page.locator('input[type="checkbox"]').nth(2).check({ force: true });
  25 |       
  26 |       await page.getByRole('button', { name: /Verify & Continue/i }).click();
  27 |       
  28 |       const otpInput = page.locator('input[inputmode="numeric"]').first();
  29 |       await expect(otpInput).toBeVisible({ timeout: 10000 });
  30 |       
  31 |       await page.keyboard.type('1234');
  32 |       await page.getByRole('button', { name: /Confirm & Proceed/i }).click();
  33 | 
  34 |       // 2. Borrower Home -> Start new application
  35 |       await expect(page.getByText(/Welcome/i)).toBeVisible();
  36 |       await page.getByText(/New Application/i).click();
  37 | 
  38 |       // 3. Step 1: Asset Category
  39 |       await page.getByText(/Four-Wheeler/i).click();
  40 |       await page.getByText(/^New$/i).click();
  41 |       await page.getByRole('button', { name: /Continue to Vehicle Details/i }).click();
  42 | 
  43 |       // 4. Step 2: Vehicle Details
  44 |       await page.locator('select[name="make"]').selectOption({ index: 1 });
  45 |       await page.locator('select[name="model"]').selectOption({ index: 1 });
  46 |       await page.locator('select[name="variant"]').selectOption({ index: 1 });
  47 |       await page.locator('select[name="city"]').selectOption({ index: 1 });
  48 |       await page.getByRole('button', { name: /Proceed to Valuation/i }).click();
  49 | 
  50 |       // 5. Step 3: Valuation
  51 |       await expect(page.getByText(/Estimated Value/i)).toBeVisible();
  52 |       await page.getByRole('button', { name: /Customise Loan Offer/i }).click();
  53 | 
  54 |       // 6. Step 4: Loan Setup
  55 |       await expect(page.getByText(/Loan Amount/i)).toBeVisible();
  56 |       await page.getByRole('button', { name: /Save & Continue/i }).click();
  57 | 
  58 |       // 7. Step 5: Applicant Details
  59 |       await expect(page.getByText(/Applicant Profile/i)).toBeVisible();
  60 |       await page.locator('input[type="date"]').fill('1990-01-01');
  61 |       await page.getByPlaceholder(/75000/i).fill('75000');
  62 |       await page.getByPlaceholder(/Enter full address/i).fill('123 Main St, Testing City');
  63 |       await page.getByPlaceholder(/400001/i).fill('400001');
  64 |       await page.getByRole('button', { name: /Submit Application/i }).click();
  65 | 
  66 |       // 8. Step 6: Decision
  67 |       await expect(page.getByText(/Evaluating your application/i)).toBeVisible();
  68 |       
  69 |       if (persona.expectedResult === 'Approved') {
  70 |         await expect(page.getByText(/Congratulations/i)).toBeVisible();
  71 |         await expect(page.getByText(/Approved/i)).toBeVisible();
  72 |       } else if (persona.expectedResult === 'Counter-offer') {
  73 |         await expect(page.getByText(/Counter-offer/i)).toBeVisible();
  74 |       } else if (persona.expectedResult === 'Referred') {
  75 |         await expect(page.getByText(/Under Review/i)).toBeVisible();
  76 |       } else if (persona.expectedResult === 'Declined') {
  77 |         await expect(page.getByText(/Declined/i)).toBeVisible();
  78 |       }
  79 |     });
  80 |   }
  81 | });
  82 | 
```