import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IntegrationInstanceWithDetails } from '../../types';

interface UsageStatisticsSectionProps {
  integration: IntegrationInstanceWithDetails;
}

// Mock usage data types
interface UsageStatistics {
  totalCalls: number;
  successfulCalls: number;
  failedCalls: number;
  activeWorkflows: number;
  // Data points for different time periods
  dailyUsage: { date: string; calls: number; success: number }[];
  weeklyUsage: { date: string; calls: number; success: number }[];
  monthlyUsage: { date: string; calls: number; success: number }[];
}

const generateMockUsageData = (integration: IntegrationInstanceWithDetails): UsageStatistics => {
  // Generate deterministic but different values for each integration
  const id = parseInt(integration.id, 10) || 1;
  const seed = id * 13;
  
  const totalCalls = integration.usageStats?.totalCalls || (100 + (seed % 900));
  const successRate = integration.usageStats?.successRate || (0.7 + (seed % 30) / 100);
  const successfulCalls = Math.round(totalCalls * successRate);
  const failedCalls = totalCalls - successfulCalls;
  const activeWorkflows = 1 + (seed % 5);
  
  // Generate daily data for the last 30 days
  const today = new Date();
  const dailyUsage = Array.from({ length: 30 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (29 - i));
    
    // Generate some realistic-looking usage pattern
    // More usage on weekdays, less on weekends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const factor = isWeekend ? 0.3 : 1;
    
    // Some random variation + a sine wave pattern
    const baseCalls = Math.max(0, Math.round(totalCalls / 30 * factor * (0.5 + Math.sin(seed + i / 5) * 0.5 + Math.random() * 0.5)));
    const success = Math.round(baseCalls * (successRate - 0.1 + Math.random() * 0.2));
    
    return {
      date: date.toISOString().split('T')[0],
      calls: baseCalls,
      success: success
    };
  });
  
  // Aggregate to weekly data
  const weeklyUsage = [];
  for (let i = 0; i < 4; i++) {
    const weekData = dailyUsage.slice(i * 7, (i + 1) * 7);
    const weekStart = weekData[0].date;
    const totalWeeklyCalls = weekData.reduce((sum, day) => sum + day.calls, 0);
    const totalWeeklySuccess = weekData.reduce((sum, day) => sum + day.success, 0);
    
    weeklyUsage.push({
      date: weekStart,
      calls: totalWeeklyCalls,
      success: totalWeeklySuccess
    });
  }
  
  // Aggregate to monthly data (past 6 months)
  const monthlyUsage = [];
  for (let i = 0; i < 6; i++) {
    const date = new Date(today);
    date.setMonth(date.getMonth() - (5 - i));
    
    // Simulate different monthly usage
    const monthlyCalls = Math.round(totalCalls * (0.7 + Math.sin(seed + i) * 0.3));
    const monthlySuccess = Math.round(monthlyCalls * successRate);
    
    monthlyUsage.push({
      date: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      calls: monthlyCalls,
      success: monthlySuccess
    });
  }
  
  return {
    totalCalls,
    successfulCalls,
    failedCalls,
    activeWorkflows,
    dailyUsage,
    weeklyUsage,
    monthlyUsage
  };
};

export const UsageStatisticsSection: React.FC<UsageStatisticsSectionProps> = ({ integration }) => {
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const usageData = generateMockUsageData(integration);
  
  // Get the relevant data based on selected timeframe
  const getTimeframeData = () => {
    switch (timeframe) {
      case 'daily':
        return usageData.dailyUsage;
      case 'weekly':
        return usageData.weeklyUsage;
      case 'monthly':
        return usageData.monthlyUsage;
      default:
        return usageData.dailyUsage;
    }
  };
  
  const currentData = getTimeframeData();
  const maxCalls = Math.max(...currentData.map(d => d.calls));
  
  // Format date label based on timeframe
  const formatDateLabel = (date: string) => {
    if (timeframe === 'daily') {
      return date.split('-')[2]; // Just the day
    } else if (timeframe === 'weekly') {
      // Show as "Week of MM/DD"
      const parts = date.split('-');
      return `W${parts[1]}/${parts[2]}`;
    } else {
      // For monthly, show as "MMM YYYY"
      const parts = date.split('-');
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthIndex = parseInt(parts[1], 10) - 1;
      return `${monthNames[monthIndex]} ${parts[0]}`;
    }
  };
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Usage Statistics</CardTitle>
        <Tabs
          value={timeframe}
          onValueChange={(value) => setTimeframe(value as 'daily' | 'weekly' | 'monthly')}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Total API Calls</div>
            <div className="text-2xl font-bold">{usageData.totalCalls.toLocaleString()}</div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Success Rate</div>
            <div className="text-2xl font-bold">
              {Math.round((usageData.successfulCalls / usageData.totalCalls) * 100)}%
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Active Workflows</div>
            <div className="text-2xl font-bold">{usageData.activeWorkflows}</div>
          </div>
        </div>
        
        {/* Usage Chart */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">{timeframe.charAt(0).toUpperCase() + timeframe.slice(1)} Usage</h3>
          
          {/* Simple bar chart - in a real app, use a proper charting library */}
          <div className="h-64 mt-4">
            <div className="relative h-full">
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 pr-2">
                <div>{maxCalls}</div>
                <div>{Math.round(maxCalls * 0.75)}</div>
                <div>{Math.round(maxCalls * 0.5)}</div>
                <div>{Math.round(maxCalls * 0.25)}</div>
                <div>0</div>
              </div>
              
              {/* Bars */}
              <div className="ml-12 h-full flex items-end">
                {currentData.map((day, index) => {
                  const heightPercent = (day.calls / maxCalls) * 100;
                  const successPercent = (day.success / day.calls) * 100;
                  
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center">
                      <div className="relative w-full h-full flex items-end justify-center">
                        {/* Total calls bar */}
                        <div 
                          className="w-4/5 rounded-t bg-blue-200"
                          style={{ height: `${heightPercent}%` }}
                        >
                          {/* Success portion */}
                          <div 
                            className="w-full bg-blue-500 rounded-t"
                            style={{ height: `${successPercent}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-xs mt-2 transform -rotate-45 origin-top-left">
                        {formatDateLabel(day.date)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 mr-2" />
              <span className="text-sm">Successful calls</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-200 mr-2" />
              <span className="text-sm">Failed calls</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageStatisticsSection; 