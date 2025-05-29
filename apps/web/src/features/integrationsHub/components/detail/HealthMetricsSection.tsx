import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IntegrationInstanceWithDetails, ConnectionStatus } from '../../types';

interface HealthMetricsSectionProps {
  integration: IntegrationInstanceWithDetails;
}

// Mock health metrics data - In a real app, this would come from the API
interface HealthMetrics {
  uptime: number;
  avgResponseTime: number;
  errorRate: number;
  lastWeekTrend: 'up' | 'down' | 'stable';
  dailyResponseTimes: { date: string; value: number }[];
  dailyErrors: { date: string; value: number }[];
}

const getMockHealthMetrics = (integration: IntegrationInstanceWithDetails): HealthMetrics | null => {
  // If integration is not connected, return null
  if (integration.connectionStatus !== ConnectionStatus.CONNECTED) {
    return null;
  }
  
  // For our mock data, base metrics on the integration ID to ensure consistency
  const id = parseInt(integration.id, 10) || 1;
  const seed = id * 7;
  
  // Generate deterministic but different values for each integration
  const uptime = 90 + (seed % 10);
  const avgResponseTime = 100 + (seed % 200);
  const errorRate = (seed % 20) / 100;
  
  // Generate daily data for the last 7 days
  const today = new Date();
  const dailyResponseTimes = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: avgResponseTime * (0.8 + (Math.sin(seed + i) * 0.4))
    };
  });
  
  const dailyErrors = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      value: Math.max(0, Math.round(errorRate * 100 * (0.5 + (Math.cos(seed + i) * 0.5))))
    };
  });
  
  // Determine trend based on response times
  let lastWeekTrend: 'up' | 'down' | 'stable';
  const firstHalf = dailyResponseTimes.slice(0, 3).reduce((sum, item) => sum + item.value, 0) / 3;
  const secondHalf = dailyResponseTimes.slice(4).reduce((sum, item) => sum + item.value, 0) / 3;
  const diff = secondHalf - firstHalf;
  
  if (diff > avgResponseTime * 0.1) {
    lastWeekTrend = 'up';
  } else if (diff < -avgResponseTime * 0.1) {
    lastWeekTrend = 'down';
  } else {
    lastWeekTrend = 'stable';
  }
  
  return {
    uptime,
    avgResponseTime,
    errorRate,
    lastWeekTrend,
    dailyResponseTimes,
    dailyErrors
  };
};

export const HealthMetricsSection: React.FC<HealthMetricsSectionProps> = ({ integration }) => {
  // In a real application, you would fetch this data from your API
  const healthMetrics = getMockHealthMetrics(integration);
  
  if (!healthMetrics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Health Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">
            Health metrics are not available. The integration must be in a connected state to monitor health.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  const { uptime, avgResponseTime, errorRate, lastWeekTrend } = healthMetrics;
  
  const trendColor = lastWeekTrend === 'down' 
    ? 'text-green-600' 
    : lastWeekTrend === 'up' 
      ? 'text-red-600' 
      : 'text-gray-600';
  
  const trendIcon = lastWeekTrend === 'down' 
    ? '↓' 
    : lastWeekTrend === 'up' 
      ? '↑' 
      : '→';
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Health Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-500">Uptime</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{uptime}%</span>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${uptime}%` }}
              />
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-500">Avg. Response Time</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{avgResponseTime}</span>
              <span className="text-sm text-gray-500">ms</span>
            </div>
            <div className="flex items-center mt-1">
              <span className={`text-sm ${trendColor}`}>
                {trendIcon} {lastWeekTrend === 'stable' 
                  ? 'Stable' 
                  : `${lastWeekTrend === 'down' ? 'Improving' : 'Degrading'} trend`}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2">
            <span className="text-sm text-gray-500">Error Rate</span>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">{(errorRate * 100).toFixed(1)}%</span>
            </div>
            <div className="mt-4 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${errorRate < 0.05 ? 'bg-green-500' : errorRate < 0.1 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${errorRate * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        {/* Simple placeholder for charts - in a real app, use a proper chart library */}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium mb-4">Weekly Trends</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Response Time (ms)</h4>
              <div className="h-40 flex items-end gap-1">
                {healthMetrics.dailyResponseTimes.map((day, i) => {
                  const heightPercent = (day.value / 400) * 100;
                  return (
                    <div key={day.date} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-blue-500 rounded-t"
                        style={{ height: `${Math.min(100, heightPercent)}%` }}
                      />
                      <span className="text-xs mt-1">{day.date.split('-')[2]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">Errors</h4>
              <div className="h-40 flex items-end gap-1">
                {healthMetrics.dailyErrors.map((day) => {
                  const heightPercent = (day.value / 20) * 100;
                  return (
                    <div key={day.date} className="flex flex-col items-center flex-1">
                      <div 
                        className="w-full bg-red-500 rounded-t"
                        style={{ height: `${Math.min(100, heightPercent)}%` }}
                      />
                      <span className="text-xs mt-1">{day.date.split('-')[2]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsSection; 