const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

const colorizeStatus = (status) => {
  switch (status) {
    case 'PASSED':
      return `${COLORS.green}${status}${COLORS.reset}`;
    case 'FAILED':
      return `${COLORS.red}${status}${COLORS.reset}`;
    case 'PENDING':
    case 'SKIPPED':
      return `${COLORS.yellow}${status}${COLORS.reset}`;
    default:
      return status;
  }
};

class SummaryReporter {
  onRunComplete(_contexts, aggregatedResult) {
    const summaryLines = [];

    aggregatedResult.testResults.forEach((suiteResult) => {
      suiteResult.testResults.forEach((testCase) => {
        const description = testCase.fullName;
        const status = testCase.status.toUpperCase();
        const duration = typeof testCase.duration === 'number'
          ? `${(testCase.duration / 1000).toFixed(2)}s`
          : 'N/A';

        summaryLines.push({ description, status, duration });
      });
    });

    console.log(`\n${COLORS.bold}${COLORS.cyan}Test Summary${COLORS.reset}`);
    console.log(`${COLORS.dim}------------${COLORS.reset}`);

    if (summaryLines.length === 0) {
      console.log(`${COLORS.dim}No tests executed.${COLORS.reset}`);
      return;
    }

    summaryLines.forEach(({ description, status, duration }) => {
      console.log(`${COLORS.bold}• ${COLORS.reset}${description}`);
      console.log(`  status: ${colorizeStatus(status)}`);
      console.log(`  execution time: ${COLORS.magenta}${duration}${COLORS.reset}`);
    });
  }
}

module.exports = SummaryReporter;
