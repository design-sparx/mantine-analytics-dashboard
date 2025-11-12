const fs = require('fs');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:5080';
const OPENAPI_ENDPOINT = `${API_URL}/openapi/v1.json`; // Adjust endpoint as needed
const OUTPUT_DIR = 'lib';
const TEMP_FILE = `${OUTPUT_DIR}/temp-openapi.json`;
const FILTERED_FILE = `${OUTPUT_DIR}/filtered-api.json`;
const OUTPUT_FILE = `${OUTPUT_DIR}/api.d.ts`;

// Tags to include (common/shared + mantine)
const INCLUDE_TAGS = [
  'Authentication',
  'User Profile',
  'User Management',
  'Countries',
  'Languages',
  'Products',
  // All Mantine tags
  'Mantine - Communication',
  'Mantine - File Management',
  'Mantine - Invoices',
  'Mantine - Kanban',
  'Mantine - Orders',
  'Mantine - Projects',
  'Mantine - Sales',
  'Mantine - Analytics',
  'Mantine - System Configuration',
  'Mantine - User Profile',
];

async function fetchOpenAPISpec() {
  console.log(`🔍 Fetching OpenAPI spec from: ${OPENAPI_ENDPOINT}`);

  return new Promise((resolve, reject) => {
    const client = OPENAPI_ENDPOINT.startsWith('https') ? https : http;

    client
      .get(OPENAPI_ENDPOINT, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const jsonData = JSON.parse(data);
              resolve(jsonData);
            } catch (error) {
              reject(new Error(`Failed to parse JSON: ${error.message}`));
            }
          } else {
            reject(
              new Error(`HTTP ${res.statusCode}: Failed to fetch OpenAPI spec`),
            );
          }
        });
      })
      .on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });
  });
}

function filterOpenAPISpec(spec) {
  console.log(
    '🔧 Filtering OpenAPI spec for common/shared and Mantine endpoints...',
  );

  const filteredPaths = {};
  let endpointCount = 0;

  for (const [path, methods] of Object.entries(spec.paths)) {
    const filteredMethods = {};

    for (const [method, operation] of Object.entries(methods)) {
      if (
        operation.tags &&
        operation.tags.some((tag) => INCLUDE_TAGS.includes(tag))
      ) {
        filteredMethods[method] = operation;
        endpointCount++;
      }
    }

    if (Object.keys(filteredMethods).length > 0) {
      filteredPaths[path] = filteredMethods;
    }
  }

  const filteredSpec = {
    ...spec,
    paths: filteredPaths,
    tags: spec.tags?.filter((tag) => INCLUDE_TAGS.includes(tag.name)) || [],
  };

  console.log(
    `✅ Filtered to ${endpointCount} endpoints with tags: ${INCLUDE_TAGS.join(
      ', ',
    )}`,
  );
  return filteredSpec;
}

async function generateTypes() {
  try {
    // Ensure output directory exists
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

    let openApiSpec;

    // Try to fetch from remote API first, fallback to local file
    try {
      openApiSpec = await fetchOpenAPISpec();
      console.log('✅ Successfully fetched OpenAPI spec from remote API');
    } catch (error) {
      console.warn(`⚠️  Failed to fetch from remote API: ${error.message}`);
      console.log('📁 Falling back to local v1.json file...');

      if (fs.existsSync('v1.json')) {
        openApiSpec = JSON.parse(fs.readFileSync('v1.json', 'utf8'));
        console.log('✅ Successfully loaded local v1.json');
      } else {
        throw new Error(
          'No OpenAPI spec available (remote fetch failed and v1.json not found)',
        );
      }
    }

    // Filter the spec
    const filteredSpec = filterOpenAPISpec(openApiSpec);

    // Write filtered spec to temp file
    fs.writeFileSync(FILTERED_FILE, JSON.stringify(filteredSpec, null, 2));

    // Generate TypeScript types using openapi-typescript
    console.log('🚀 Generating TypeScript types...');
    execSync(`npx openapi-typescript ${FILTERED_FILE} -o ${OUTPUT_FILE}`, {
      stdio: 'inherit',
    });

    // Clean up temp file
    fs.unlinkSync(FILTERED_FILE);

    console.log(`✨ Successfully generated TypeScript types at ${OUTPUT_FILE}`);
    console.log(
      `📊 Generated types for ${
        Object.keys(filteredSpec.paths).length
      } API endpoints`,
    );
  } catch (error) {
    console.error('❌ Error generating types:', error.message);

    // Clean up temp files on error
    if (fs.existsSync(FILTERED_FILE)) {
      fs.unlinkSync(FILTERED_FILE);
    }

    process.exit(1);
  }
}

// Run the script
generateTypes();
