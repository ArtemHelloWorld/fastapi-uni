import React, { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';
import type { Task, TaskCreate, TaskUpdate } from '../types';
import '../styles/TaskModal.css';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({ task, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setIsImportant(task.is_important);
      if (task.deadline_at) {
        const date = new Date(task.deadline_at);
        setDeadline(date.toISOString().slice(0, 16));
      }
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const taskData = {
        title,
        description: description || undefined,
        is_important: isImportant,
        deadline_at: deadline ? new Date(deadline).toISOString() : undefined,
      };

      if (task) {
        await tasksAPI.update(task.id, taskData as TaskUpdate);
      } else {
        await tasksAPI.create(taskData as TaskCreate);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Редактировать задачу' : 'Создать новую задачу'}</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="title">Название *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              minLength={3}
              maxLength={100}
              placeholder="Введите название задачи"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Описание</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              placeholder="Введите описание задачи (необязательно)"
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="deadline">Дедлайн</label>
            <input
              id="deadline"
              type="datetime-local"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                disabled={loading}
              />
              <span>Отметить как важное</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Отмена
            </button>
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Сохранение...' : task ? 'Обновить задачу' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};