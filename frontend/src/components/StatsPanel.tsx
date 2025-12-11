import React from 'react';
import type { Stats } from '../types';
import '../styles/StatsPanel.css';

interface StatsPanelProps {
  stats: Stats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const completionRate = stats.total_tasks > 0
    ? Math.round((stats.by_status.completed / stats.total_tasks) * 100)
    : 0;

  return (
    <div className="stats-panel">
      <div className="stat-card">
        <div className="stat-value">{stats.total_tasks}</div>
        <div className="stat-label">Всего задач</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{stats.by_status.pending}</div>
        <div className="stat-label">В процессе</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{stats.by_status.completed}</div>
        <div className="stat-label">Завершено</div>
      </div>

      <div className="stat-card">
        <div className="stat-value">{completionRate}%</div>
        <div className="stat-label">Процент выполнения</div>
      </div>

      <div className="stat-card quadrant-stat">
        <div className="quadrant-stats">
          <div className="quadrant-stat-item">
            <span className="q-label q1">Q1:</span>
            <span className="q-value">{stats.by_quadrant.Q1}</span>
          </div>
          <div className="quadrant-stat-item">
            <span className="q-label q2">Q2:</span>
            <span className="q-value">{stats.by_quadrant.Q2}</span>
          </div>
          <div className="quadrant-stat-item">
            <span className="q-label q3">Q3:</span>
            <span className="q-value">{stats.by_quadrant.Q3}</span>
          </div>
          <div className="quadrant-stat-item">
            <span className="q-label q4">Q4:</span>
            <span className="q-value">{stats.by_quadrant.Q4}</span>
          </div>
        </div>
      </div>
    </div>
  );
};