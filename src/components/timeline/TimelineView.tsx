import React, { useMemo, useRef } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { applyFilters } from '../../utils/filterUtils';
import {
  getDaysInMonth, getMonthStart, dayOffsetInMonth,
  formatDate, clamp
} from '../../utils/dateUtils';
import { PRIORITY_COLORS, Task } from '../../types';

const DAY_WIDTH = 38;
const ROW_HEIGHT = 44;
const LABEL_WIDTH = 220;


function getMonthName(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}


interface BarProps {
  task: Task;
  startOffset: number;
  endOffset: number;
  daysInMonth: number;
}


const TimelineBar = React.memo(({ task, startOffset, endOffset, daysInMonth }: BarProps) => {
  const left  = clamp(startOffset, 0, daysInMonth) * DAY_WIDTH;
  const width = Math.max(DAY_WIDTH, clamp(endOffset - startOffset, 1, daysInMonth - startOffset) * DAY_WIDTH);
  const color = PRIORITY_COLORS[task.priority];

  return (
    <div
      title={`${task.title} — ${task.priority} priority`}
      style={{
        position: 'absolute',
        left,
        width,
        height: ROW_HEIGHT - 12,
        top: 6,
        backgroundColor: color,
        borderRadius: 6,
        opacity: 0.85,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 8,
        paddingRight: 4,
        overflow: 'hidden',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
        cursor: 'default',
      }}
    >
      <span style={{
        color: 'white',
        fontSize: 11,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {task.title}
      </span>
    </div>
  );
});
TimelineBar.displayName = 'TimelineBar';

export const TimelineView = React.memo(() => {
  const tasks   = useTaskStore(s => s.tasks);
  const filters = useTaskStore(s => s.filters);
  const scrollRef = useRef<HTMLDivElement>(null);

  const now       = new Date();
  const year      = now.getFullYear();
  const month     = now.getMonth();
  const monthStart = getMonthStart(year, month);
  const daysInMonth = getDaysInMonth(year, month);
  const todayOffset = dayOffsetInMonth(now.toISOString().split('T')[0], monthStart);

  const filteredTasks = useMemo(() => applyFilters(tasks, filters), [tasks, filters]);

  // Only include tasks that overlap with current month
  const monthEnd = new Date(year, month + 1, 0).toISOString().split('T')[0];
  const monthStartStr = monthStart.toISOString().split('T')[0];

  const visibleTasks = useMemo(() => {
    return filteredTasks.filter(t => {
      const start = t.startDate || t.dueDate;
      return t.dueDate >= monthStartStr && start <= monthEnd;
    });
  }, [filteredTasks, monthStartStr, monthEnd]);

  const totalWidth = daysInMonth * DAY_WIDTH;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 flex-shrink-0 bg-slate-50 flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">{getMonthName(year, month)}</h3>
        <div className="flex items-center gap-3 text-xs text-slate-500">
          {['critical','high','medium','low'].map(p => (
            <span key={p} className="flex items-center gap-1">
              <span
                className="w-3 h-3 rounded-sm inline-block"
                style={{ backgroundColor: PRIORITY_COLORS[p as keyof typeof PRIORITY_COLORS] }}
              />
              {p}
            </span>
          ))}
          <span className="flex items-center gap-1">
            <span className="w-0.5 h-3 bg-red-500 inline-block" />
            today
          </span>
        </div>
      </div>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Task labels column */}
        <div
          className="flex-shrink-0 border-r border-slate-200 overflow-y-auto"
          style={{ width: LABEL_WIDTH }}
        >
          {/* Spacer for day header */}
          <div
            className="border-b border-slate-200 bg-slate-50 flex-shrink-0"
            style={{ height: 40 }}
          />
          {visibleTasks.map(task => (
            <div
              key={task.id}
              className="flex items-center px-3 border-b border-slate-100 gap-2"
              style={{ height: ROW_HEIGHT }}
            >
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}
              />
              <span className="text-xs text-slate-700 font-medium truncate">
                {task.title}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline scroll area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-auto min-w-0"
          style={{ position: 'relative' }}
        >
          <div style={{ width: totalWidth, position: 'relative', minWidth: totalWidth }}>
            {/* Day headers */}
            <div
              className="flex border-b border-slate-200 bg-slate-50 sticky top-0 z-20"
              style={{ height: 40 }}
            >
              {days.map(day => {
                const d = new Date(year, month, day);
                const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                const isToday = day - 1 === todayOffset;
                return (
                  <div
                    key={day}
                    style={{ width: DAY_WIDTH, flexShrink: 0 }}
                    className={`flex flex-col items-center justify-center border-r border-slate-100 text-xs
                      ${isToday ? 'bg-red-50 font-bold text-red-600' : isWeekend ? 'bg-slate-100 text-slate-400' : 'text-slate-500'}`}
                  >
                    <span>{day}</span>
                    <span className="text-[9px]">{d.toLocaleDateString('en-US', { weekday: 'narrow' })}</span>
                  </div>
                );
              })}
            </div>

            {/* Today line */}
            {todayOffset >= 0 && todayOffset < daysInMonth && (
              <div
                style={{
                  position: 'absolute',
                  left: todayOffset * DAY_WIDTH + DAY_WIDTH / 2,
                  top: 40,
                  bottom: 0,
                  width: 2,
                  backgroundColor: '#ef4444',
                  zIndex: 10,
                  pointerEvents: 'none',
                }}
              />
            )}

            {/* Weekend stripes */}
            {days.map(day => {
              const d = new Date(year, month, day);
              const isWeekend = d.getDay() === 0 || d.getDay() === 6;
              if (!isWeekend) return null;
              return (
                <div
                  key={day}
                  style={{
                    position: 'absolute',
                    left: (day - 1) * DAY_WIDTH,
                    top: 40,
                    width: DAY_WIDTH,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              );
            })}

            {/* Task bars */}
            {visibleTasks.map((task, i) => {
              const startStr = task.startDate || task.dueDate;
              const startOff = dayOffsetInMonth(startStr, monthStart);
              const endOff   = dayOffsetInMonth(task.dueDate, monthStart) + 1;

              return (
                <div
                  key={task.id}
                  style={{
                    position: 'relative',
                    height: ROW_HEIGHT,
                    borderBottom: '1px solid #f1f5f9',
                    zIndex: 5,
                  }}
                >
                  <TimelineBar
                    task={task}
                    startOffset={startOff}
                    endOffset={endOff}
                    daysInMonth={daysInMonth}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-100 bg-slate-50 flex-shrink-0">
        <span className="text-xs text-slate-400">
          {visibleTasks.length} tasks visible this month • Scroll horizontally to navigate
        </span>
      </div>
    </div>
  );
});
TimelineView.displayName = 'TimelineView';
