import pkg from '@google-analytics/data';
const { BetaAnalyticsDataClient } = pkg;
import { GoogleAuth } from 'google-auth-library';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';

dotenv.config();

async function testConnection() {
  try {
    const propertyId = process.env.GA_PROPERTY_ID;
    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    if (!propertyId) {
      throw new Error('GA_PROPERTY_ID is not set in .env file');
    }

    if (!credentialsPath) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS is not set in .env file');
    }

    let auth;
    try {
      const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8'));
      auth = new GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      });
    } catch (error) {
      auth = new GoogleAuth({
        keyFile: credentialsPath,
        scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
      });
    }

    const analyticsClient = new BetaAnalyticsDataClient({ auth });

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    console.log('Testing Google Analytics connection...');
    console.log(`Property ID: ${propertyId}`);
    console.log(`Date Range: ${startDateStr} to ${endDateStr}`);
    console.log('');

    const [response] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: startDateStr,
          endDate: endDateStr,
        },
      ],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
      dimensions: [{ name: 'date' }],
      orderBys: [
        {
          dimension: {
            dimensionName: 'date',
          },
        },
      ],
    });

    console.log(' Connection successful!');
    console.log('');
    console.log(' Last 7 Days Summary:');
    console.log(''.repeat(60));

    if (response.rows && response.rows.length > 0) {
      let totalUsers = 0;
      let totalSessions = 0;
      let totalPageViews = 0;
      let totalDuration = 0;

      response.rows.forEach((row) => {
        const date = row.dimensionValues[0].value;
        const formattedDate = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
        const users = parseInt(row.metricValues[0].value || '0');
        const sessions = parseInt(row.metricValues[1].value || '0');
        const pageViews = parseInt(row.metricValues[2].value || '0');
        const duration = parseFloat(row.metricValues[3].value || '0');

        totalUsers += users;
        totalSessions += sessions;
        totalPageViews += pageViews;
        totalDuration += duration;

        console.log(`${formattedDate} | Users: ${users.toLocaleString()} | Sessions: ${sessions.toLocaleString()} | Page Views: ${pageViews.toLocaleString()} | Avg Duration: ${Math.round(duration)}s`);
      });

      console.log(''.repeat(60));
      console.log(' Totals:');
      console.log(`   Active Users: ${totalUsers.toLocaleString()}`);
      console.log(`   Sessions: ${totalSessions.toLocaleString()}`);
      console.log(`   Page Views: ${totalPageViews.toLocaleString()}`);
      console.log(`   Avg Session Duration: ${Math.round(totalDuration / response.rows.length)}s`);
    } else {
      console.log('No data found for the last 7 days.');
    }

    if (response.totals && response.totals.length > 0) {
      const totals = response.totals[0];
      console.log('');
      console.log(' Overall Totals (from API):');
      console.log(`   Active Users: ${parseInt(totals.metricValues[0].value || '0').toLocaleString()}`);
      console.log(`   Sessions: ${parseInt(totals.metricValues[1].value || '0').toLocaleString()}`);
      console.log(`   Page Views: ${parseInt(totals.metricValues[2].value || '0').toLocaleString()}`);
    }

    console.log('');
    console.log(' Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Connection test failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.message.includes('PERMISSION_DENIED')) {
      console.error('');
      console.error(' Tip: Make sure the service account has access to the Google Analytics property.');
      console.error('   Go to Google Analytics  Admin  Property access management');
      console.error('   Add the service account email with Viewer permissions.');
    } else if (error.message.includes('NOT_FOUND')) {
      console.error('');
      console.error(' Tip: Check that the Property ID is correct.');
    }
    
    process.exit(1);
  }
}

testConnection();