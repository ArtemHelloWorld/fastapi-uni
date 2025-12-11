import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { tasksAPI, statsAPI } from '../services/api';
import type { Task, Stats } from '../types';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { StatsPanel } from '../components/StatsPanel';
import '../styles/Dashboard.css';

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, statsData] = await Promise.all([
        filter === 'all' ? tasksAPI.getAll() : tasksAPI.getByStatus(filter),
        statsAPI.getStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await tasksAPI.delete(taskId);
      await loadData();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const handleCompleteTask = async (taskId: number) => {
    try {
      await tasksAPI.complete(taskId);
      await loadData();
    } catch (error) {
      console.error('Failed to complete task:', error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    loadData();
  };

  const getTasksByQuadrant = (quadrant: string) => {
    return tasks.filter((task) => task.quadrant === quadrant);
  };

  const quadrants = [
    { id: 'Q1', title: 'Срочные и Важные', subtitle: 'Сделать первым', color: '#ef5350' },
    { id: 'Q2', title: 'Не срочные и Важные', subtitle: 'Запланировать', color: '#66bb6a' },
    { id: 'Q3', title: 'Срочные и Не важные', subtitle: 'Делегировать', color: '#ffa726' },
    { id: 'Q4', title: 'Не срочные и Не важные', subtitle: 'Исключить', color: '#42a5f5' },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Загрузка...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Менеджер задач</h1>
            <p className="user-info">Добро пожаловать, {user?.nickname}!</p>
          </div>
          <div className="header-right">
            <button className="btn-create" onClick={handleCreateTask}>
              + Новая задача
            </button>
            <button className="btn-logout" onClick={logout}>
              Выход
            </button>
          </div>
        </div>
      </header>

      {stats && <StatsPanel stats={stats} />}

      <div className="filter-tabs">
        <button
          className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          Все задачи
        </button>
        <button
          className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
          onClick={() => setFilter('pending')}
        >
          В процессе
        </button>
        <button
          className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Завершенные
        </button>
      </div>

      <div className="eisenhower-matrix">
        {quadrants.map((quadrant) => (
          <div key={quadrant.id} className="quadrant" style={{ borderTopColor: quadrant.color }}>
            <div className="quadrant-header">
              <h2>{quadrant.title}</h2>
              <span className="quadrant-subtitle">{quadrant.subtitle}</span>
              <span className="task-count">{getTasksByQuadrant(quadrant.id).length}</span>
            </div>
            <div className="quadrant-tasks">
              {getTasksByQuadrant(quadrant.id).length === 0 ? (
                <p className="no-tasks">Нет задач в этом квадранте</p>
              ) : (
                getTasksByQuadrant(quadrant.id).map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                    onComplete={handleCompleteTask}
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};