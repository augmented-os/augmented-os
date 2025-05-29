import React from 'react';
import { ConnectionStatus } from '../../types';
import { formatDistanceToNow } from 'date-fns';

export interface StatusEvent {
  date: string;
  status: ConnectionStatus;
  message?: string;
}

export interface StatusTimelineProps {
  events: StatusEvent[];
  range?: '7d' | '30d' | '90d';
  onRangeChange?: (range: '7d' | '30d' | '90d') => void;
  onSelect?: (event: StatusEvent) => void;
}

const StatusTimeline: React.FC<StatusTimelineProps> = ({
  events,
  range = '30d',
  onRangeChange,
  onSelect
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <label htmlFor="timeline-range" className="text-sm font-medium">
          Range
        </label>
        <select
          id="timeline-range"
          value={range}
          onChange={e => onRangeChange && onRangeChange(e.target.value as any)}
          className="border rounded px-2 py-1 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>
      <ol className="relative border-l border-gray-200" aria-label="Status timeline">
        {events.map((evt, idx) => (
          <li key={idx} className="mb-6 ml-4">
            <div className="absolute w-3 h-3 bg-gray-200 rounded-full -left-1.5 border border-white" />
            <div
              tabIndex={0}
              role="button"
              onKeyDown={e => {
                if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
                  e.preventDefault();
                  onSelect(evt);
                }
              }}
              onClick={() => onSelect && onSelect(evt)}
              className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(evt.date), { addSuffix: true })}
              </span>
              <span className="block font-medium" aria-label={`Status ${evt.status}`}>
                {evt.status}
              </span>
              {evt.message && (
                <span className="text-sm text-gray-600">{evt.message}</span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StatusTimeline;
