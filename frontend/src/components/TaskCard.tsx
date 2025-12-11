import React from 'react';
import type { Task } from '../types';
import '../styles/TaskCard.css';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onComplete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onComplete }) => {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Нет дедлайна';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getDeadlineClass = () => {
    if (!task.days_until_deadline) return '';
    if (task.days_until_deadline < 0) return 'overdue';
    if (task.days_until_deadline <= 3) return 'urgent';
    return '';
  };

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        {!task.completed && (
          <button
            className="btn-complete"
            onClick={() => onComplete(task.id)}
            title="Отметить как выполненное"
          >
            ✓
          </button>
        )}
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.deadline_at && (
          <div className={`task-deadline ${getDeadlineClass()}`}>
            <span className="deadline-icon">📅</span>
            <span>{formatDate(task.deadline_at)}</span>
            {task.days_until_deadline !== null && (
              <span className="days-remaining">
                {task.days_until_deadline < 0
                  ? `Просрочено на ${Math.abs(task.days_until_deadline)} дн.`
                  : task.days_until_deadline === 0
                  ? 'Сегодня'
                  : `Осталось ${task.days_until_deadline} дн.`}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="task-actions">
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Изменить
        </button>
        <button className="btn-delete" onClick={() => onDelete(task.id)}>
          Удалить
        </button>
      </div>

      {task.completed && task.completed_at && (
        <div className="completed-badge">
          ✓ Завершено {formatDate(task.completed_at)}
        </div>
      )}
    </div>
  );
};