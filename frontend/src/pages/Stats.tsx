import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { statsAPI } from '../services/api';
import type { Stats as StatsType } from '../types';
import '../styles/Dashboard.css';
import '../styles/Stats.css';

export const Stats: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const statsData = await statsAPI.getStats();
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  if (!stats) return null;

  const completionRate = stats.total_tasks > 0
    ? Math.round((stats.by_status.completed / stats.total_tasks) * 100)
    : 0;

  const pendingRate = stats.total_tasks > 0
    ? Math.round((stats.by_status.pending / stats.total_tasks) * 100)
    : 0;

  return (
    <div className="stats-page">
      <header className="dashboard-header">
        <div className="header-content">
          <button className="btn-back" onClick={() => navigate('/dashboard')}>
            ← Назад
          </button>
          <div className="header-left">
            <h1>Аналитика и статистика</h1>
            <p className="user-info">{user?.nickname}</p>
          </div>
          <div className="header-right">
            <button className="btn-logout" onClick={logout}>
              Выход
            </button>
          </div>
        </div>
      </header>

      <div className="stats-layout">
        {/* Hero section - main metric */}
        <div className="stats-hero">
          <div className="hero-content">
            <div className="hero-label">Всего задач</div>
            <div className="hero-value">{stats.total_tasks}</div>
            <div className="hero-progress-bar">
              <div 
                className="hero-progress-fill completed"
                style={{ width: `${completionRate}%` }}
              />
              <div 
                className="hero-progress-fill pending"
                style={{ width: `${pendingRate}%`, left: `${completionRate}%` }}
              />
            </div>
            <div className="hero-subtext">
              {stats.by_status.completed} завершено · {stats.by_status.pending} в работе
            </div>
          </div>
        </div>

        {/* Asymmetric grid */}
        <div className="stats-grid-area">
          <div className="stat-box box-large box-completion">
            <div className="box-header">
              <span className="box-title">Процент выполнения</span>
            </div>
            <div className="box-value">{completionRate}%</div>
            <div className="box-detail">
              из {stats.total_tasks} задач
            </div>
          </div>

          <div className="stat-box box-pending">
            <div className="box-header">
              <span className="box-title">В процессе</span>
            </div>
            <div className="box-value">{stats.by_status.pending}</div>
          </div>

          <div className="stat-box box-completed">
            <div className="box-header">
              <span className="box-title">Завершено</span>
            </div>
            <div className="box-value">{stats.by_status.completed}</div>
          </div>
        </div>

        {/* Sidebar-like quadrant section */}
        <div className="stats-quadrants">
          <h3 className="quadrants-title">Матрица Эйзенхауэра</h3>
          
          <div className="quadrant-row">
            <div className="quadrant-item q1">
              <div className="quadrant-label">
                <span className="q-badge">Q1</span>
                <span className="q-name">Срочные и Важные</span>
              </div>
              <div className="quadrant-value">{stats.by_quadrant.Q1}</div>
              <div className="quadrant-bar" style={{ width: `${stats.total_tasks > 0 ? (stats.by_quadrant.Q1 / stats.total_tasks) * 100 : 0}%` }}></div>
            </div>

            <div className="quadrant-item q2">
              <div className="quadrant-label">
                <span className="q-badge">Q2</span>
                <span className="q-name">Важные, не срочные</span>
              </div>
              <div className="quadrant-value">{stats.by_quadrant.Q2}</div>
              <div className="quadrant-bar" style={{ width: `${stats.total_tasks > 0 ? (stats.by_quadrant.Q2 / stats.total_tasks) * 100 : 0}%` }}></div>
            </div>
          </div>

          <div className="quadrant-row">
            <div className="quadrant-item q3">
              <div className="quadrant-label">
                <span className="q-badge">Q3</span>
                <span className="q-name">Срочные, не важные</span>
              </div>
              <div className="quadrant-value">{stats.by_quadrant.Q3}</div>
              <div className="quadrant-bar" style={{ width: `${stats.total_tasks > 0 ? (stats.by_quadrant.Q3 / stats.total_tasks) * 100 : 0}%` }}></div>
            </div>

            <div className="quadrant-item q4">
              <div className="quadrant-label">
                <span className="q-badge">Q4</span>
                <span className="q-name">Не важные и не срочные</span>
              </div>
              <div className="quadrant-value">{stats.by_quadrant.Q4}</div>
              <div className="quadrant-bar" style={{ width: `${stats.total_tasks > 0 ? (stats.by_quadrant.Q4 / stats.total_tasks) * 100 : 0}%` }}></div>
            </div>
          </div>

          <div className="quadrants-summary">
            <div className="summary-item">
              <span className="summary-label">Высокий приоритет</span>
              <span className="summary-value">{stats.by_quadrant.Q1 + stats.by_quadrant.Q2}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Низкий приоритет</span>
              <span className="summary-value">{stats.by_quadrant.Q3 + stats.by_quadrant.Q4}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
