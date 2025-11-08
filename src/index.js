import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

dotenv.config();

class GoogleAnalyticsMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'google-analytics-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.analyticsClient = null;
    this.propertyId = process.env.GA_PROPERTY_ID || '';

    this.setupHandlers();
    this.initializeClient();
  }

  async initializeClient() {
    try {
      const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_APPLICATION_CREDENTIALS_PATH;
      let auth;

      if (credentialsPath) {
        const resolvedPath = resolve(credentialsPath);
        try {
          const credentials = JSON.parse(readFileSync(resolvedPath, 'utf8'));
          auth = new GoogleAuth({
            credentials,
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
          });
        } catch (error) {
          auth = new GoogleAuth({
            keyFile: resolvedPath,
            scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
          });
        }
      } else {
        auth = new GoogleAuth({
          scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
        });
      }

      this.analyticsClient = new BetaAnalyticsDataClient({
        auth,
      });
    } catch (error) {
      // Silent error handling - no console output
    }
  }

  setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'query_analytics',
          description: 'Query Google Analytics data with custom dimensions and metrics',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
              },
              metrics: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of metric names (e.g., ["sessions", "users"])',
              },
              dimensions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of dimension names (e.g., ["country", "city"])',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional, uses env var if not provided)',
              },
            },
            required: ['startDate', 'endDate', 'metrics'],
          },
        },
        {
          name: 'get_realtime_data',
          description: 'Get real-time analytics data from Google Analytics',
          inputSchema: {
            type: 'object',
            properties: {
              metrics: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of real-time metric names',
              },
              dimensions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of real-time dimension names',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional)',
              },
            },
            required: ['metrics'],
          },
        },
        {
          name: 'get_traffic_sources',
          description: 'Get traffic source data including channels, sources, and mediums',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional)',
              },
            },
            required: ['startDate', 'endDate'],
          },
        },
        {
          name: 'get_user_demographics',
          description: 'Get user demographic data including age, gender, and interests',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional)',
              },
            },
            required: ['startDate', 'endDate'],
          },
        },
        {
          name: 'get_page_performance',
          description: 'Get page performance metrics including page views, bounce rate, and time on page',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional)',
              },
            },
            required: ['startDate', 'endDate'],
          },
        },
        {
          name: 'get_conversion_data',
          description: 'Get conversion and goal completion data',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional)',
              },
            },
            required: ['startDate', 'endDate'],
          },
        },
        {
          name: 'get_custom_report',
          description: 'Get a custom report with specified metrics, dimensions, and optional filters',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'string',
                description: 'Start date in YYYY-MM-DD format',
              },
              endDate: {
                type: 'string',
                description: 'End date in YYYY-MM-DD format',
              },
              metrics: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of metric names',
              },
              dimensions: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of dimension names',
              },
              dimensionFilter: {
                type: 'object',
                description: 'Optional dimension filter object',
              },
              metricFilter: {
                type: 'object',
                description: 'Optional metric filter object',
              },
              propertyId: {
                type: 'string',
                description: 'Google Analytics property ID (optional)',
              },
            },
            required: ['startDate', 'endDate', 'metrics'],
          },
        },
      ],
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (!this.analyticsClient) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Analytics client not initialized. Please check your credentials.',
              }),
            },
          ],
        };
      }

      const propertyId = args.propertyId || this.propertyId;
      if (!propertyId) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: 'Property ID is required. Set GA_PROPERTY_ID environment variable or provide propertyId parameter.',
              }),
            },
          ],
        };
      }

      try {
        switch (name) {
          case 'query_analytics':
            return await this.queryAnalytics(propertyId, args);
          case 'get_realtime_data':
            return await this.getRealtimeData(propertyId, args);
          case 'get_traffic_sources':
            return await this.getTrafficSources(propertyId, args);
          case 'get_user_demographics':
            return await this.getUserDemographics(propertyId, args);
          case 'get_page_performance':
            return await this.getPagePerformance(propertyId, args);
          case 'get_conversion_data':
            return await this.getConversionData(propertyId, args);
          case 'get_custom_report':
            return await this.getCustomReport(propertyId, args);
          default:
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify({ error: `Unknown tool: ${name}` }),
                },
              ],
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                error: error.message || 'An error occurred',
              }),
            },
          ],
        };
      }
    });
  }

  async queryAnalytics(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: args.startDate,
          endDate: args.endDate,
        },
      ],
      metrics: args.metrics.map((name) => ({ name })),
    };

    if (args.dimensions && args.dimensions.length > 0) {
      request.dimensions = args.dimensions.map((name) => ({ name }));
    }

    const [response] = await this.analyticsClient.runReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  async getRealtimeData(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      metrics: args.metrics.map((name) => ({ name })),
    };

    if (args.dimensions && args.dimensions.length > 0) {
      request.dimensions = args.dimensions.map((name) => ({ name }));
    }

    const [response] = await this.analyticsClient.runRealtimeReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  async getTrafficSources(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: args.startDate,
          endDate: args.endDate,
        },
      ],
      dimensions: [
        { name: 'sessionDefaultChannelGroup' },
        { name: 'sessionSource' },
        { name: 'sessionMedium' },
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'users' },
        { name: 'newUsers' },
        { name: 'bounceRate' },
      ],
    };

    const [response] = await this.analyticsClient.runReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  async getUserDemographics(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: args.startDate,
          endDate: args.endDate,
        },
      ],
      dimensions: [
        { name: 'userAgeBracket' },
        { name: 'userGender' },
        { name: 'country' },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'newUsers' },
        { name: 'sessions' },
      ],
    };

    const [response] = await this.analyticsClient.runReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  async getPagePerformance(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: args.startDate,
          endDate: args.endDate,
        },
      ],
      dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'engagementRate' },
      ],
      orderBys: [
        {
          metric: {
            metricName: 'screenPageViews',
          },
          desc: true,
        },
      ],
      limit: 100,
    };

    const [response] = await this.analyticsClient.runReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  async getConversionData(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: args.startDate,
          endDate: args.endDate,
        },
      ],
      dimensions: [{ name: 'eventName' }],
      metrics: [
        { name: 'eventCount' },
        { name: 'conversions' },
        { name: 'totalUsers' },
      ],
    };

    const [response] = await this.analyticsClient.runReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  async getCustomReport(propertyId, args) {
    const request = {
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: args.startDate,
          endDate: args.endDate,
        },
      ],
      metrics: args.metrics.map((name) => ({ name })),
    };

    if (args.dimensions && args.dimensions.length > 0) {
      request.dimensions = args.dimensions.map((name) => ({ name }));
    }

    if (args.dimensionFilter) {
      request.dimensionFilter = args.dimensionFilter;
    }

    if (args.metricFilter) {
      request.metricFilter = args.metricFilter;
    }

    const [response] = await this.analyticsClient.runReport(request);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(this.formatReportResponse(response), null, 2),
        },
      ],
    };
  }

  formatReportResponse(response) {
    const rows = [];
    const dimensionHeaders = response.dimensionHeaders || [];
    const metricHeaders = response.metricHeaders || [];

    if (response.rows) {
      for (const row of response.rows) {
        const rowData = {};
        
        if (row.dimensionValues) {
          dimensionHeaders.forEach((header, index) => {
            rowData[header.name] = row.dimensionValues[index]?.value || '';
          });
        }

        if (row.metricValues) {
          metricHeaders.forEach((header, index) => {
            rowData[header.name] = row.metricValues[index]?.value || '';
          });
        }

        rows.push(rowData);
      }
    }

    return {
      rowCount: response.rowCount || 0,
      rows,
      totals: response.totals?.map((total) => {
        const totalData = {};
        metricHeaders.forEach((header, index) => {
          totalData[header.name] = total.metricValues[index]?.value || '';
        });
        return totalData;
      }) || [],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

const server = new GoogleAnalyticsMCPServer();
server.run().catch(() => {
  // Silent error handling
  process.exit(1);
});


