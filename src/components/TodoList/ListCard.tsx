import React, { useState } from 'react';
import { Calendar, Trash2, Edit, List } from 'lucide-react';
import { TodoList } from '../../types';
import { Modal } from '../UI/Modal';
import { Button } from '../UI/Button';

interface ListCardProps {
  list: TodoList;
  onDelete: (listId: string) => Promise<void>;
  onEdit?: (listId: string) => void;
}

export const ListCard: React.FC<ListCardProps> = ({ list, onDelete, onEdit }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(list.id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting list:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-2">
              <List className="text-yellow-400" size={20} />
              <h3 className="text-lg font-semibold text-black line-clamp-2">{list.title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(list.id)}
                  className="text-gray-500 hover:text-yellow-600 transition-colors duration-300 p-1"
                  title="Edit list"
                >
                  <Edit size={16} />
                </button>
              )}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="text-gray-500 hover:text-red-600 transition-colors duration-300 p-1"
                title="Delete list"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          {list.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{list.description}</p>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar size={14} />
              <span>Created {formatDate(list.createdAt)}</span>
            </div>
            <span className="bg-yellow-100 text-black px-2 py-1 rounded-full text-xs font-medium">
              {list.itemCount} {list.itemCount === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete List"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete "{list.title}"? This action cannot be undone.
          </p>
          <div className="flex justify-end space-x-3">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={isDeleting}
            >
              Delete List
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};