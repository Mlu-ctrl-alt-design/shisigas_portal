// UNTITLED UI: https://untitledui.com/components/badge
// TODO: Replace the stub <span> with <Badge> from @untitled-ui/react when installed.
//       Import: import { Badge } from '@untitled-ui/react';
//       Usage:  <Badge color={colorMap[status]}>{status}</Badge>

const colorMap = {
  Draft: 'gray',
  'To Deliver and Bill': 'blue',
  'To Bill': 'blue',
  'To Deliver': 'blue',
  Completed: 'green',
  Cancelled: 'red',
  Closed: 'gray',
};

const twColorMap = {
  gray: 'bg-gray-100 text-gray-700',
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  red: 'bg-red-100 text-red-700',
};

/**
 * Displays a coloured status badge for Sales Order statuses.
 *
 * @param {{ status: string, className?: string }} props
 */
export default function StatusBadge({ status, className = '' }) {
  const color = colorMap[status] ?? 'gray';
  const tw = twColorMap[color];

  return (
    // UNTITLED UI: Badge component stub
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tw} ${className}`}
    >
      {status}
    </span>
  );
}
