import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Define a custom trend metric for response times
const responseTimeTrend = new Trend('response_time');

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp-up to 20 virtual users
    { duration: '1m', target: 20 },  // Stay at 20 virtual users
    { duration: '10s', target: 0 },   // Ramp-down to 0
  ],
  thresholds: {
    'http_req_failed': ['rate<0.01'], // Less than 1% of requests should fail
    'http_req_duration': ['p(95)<200'], // 95% of requests should be below 200ms
    'response_time': ['p(99)<300'], // 99% of our custom metric should be below 300ms
  },
  ext: {
    loadimpact: {
      projectID: 3565655,
      // The name of the test
      name: "Regional Latency Test"
    }
  }
};

// The main function that defines the test logic
export default function () {
  // Determine the base URL from an environment variable, defaulting to the US region
  const region = __ENV.REGION || 'us-central1';
  const baseUrl = `https://ad-studio-app.${region}.meta-studio.com`;

  const res = http.get(baseUrl);

  // Check if the request was successful
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  // Add the response time to our custom trend metric
  responseTimeTrend.add(res.timings.duration);

  // Wait for 1 second before the next iteration
  sleep(1);
}
