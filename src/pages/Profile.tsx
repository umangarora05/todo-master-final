import React, { useState } from 'react';
import { User, Edit2, Save, X, Trash2 } from 'lucide-react';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../components/Auth/AuthProvider';
import { db } from '../lib/firebase';
import { Button } from '../components/UI/Button';
import { Modal } from '../components/UI/Modal';
import { LoadingSpinner } from '../components/UI/LoadingSpinner';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    notifications: user?.preferences?.notifications || true,
  });

  const handleSave = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        displayName: formData.displayName,
        bio: formData.bio,
        preferences: {
          notifications: formData.notifications,
        },
        updatedAt: serverTimestamp(),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      displayName: user?.displayName || '',
      bio: user?.bio || '',
      notifications: user?.preferences?.notifications || true,
    });
    setIsEditing(false);
  };

  const handleDeleteProfile = async () => {
    if (!user) return;

    setIsDeleting(true);
    try {
      const batch = writeBatch(db);

      // Correctly get the reference to the nested subcollection
      const listsCollectionRef = collection(db, `users/${user.uid}/lists`);
      const listsSnapshot = await getDocs(listsCollectionRef);
      
      listsSnapshot.docs.forEach((listDoc) => {
        batch.delete(listDoc.ref);
      });

      // Delete user profile
      const userRef = doc(db, 'users', user.uid);
      batch.delete(userRef);

      await batch.commit();
      await logout();
    } catch (error) {
      console.error('Error deleting profile:', error);
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 px-6 py-8">
            <div className="flex items-center space-x-4">
              {user.photoURL ? (
               <img
                  src={user.photoURL}
                  alt="Profile"
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">
                  <User size={32} className="text-yellow-600" />
                </div>
              )}
              <div className="text-white">
                <h1 className="text-2xl font-bold">{user.displayName || 'User'}</h1>
                <p className="text-yellow-100">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="px-6 py-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-black">Profile Information</h2>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center space-x-1"
                >
                  <Edit2 size={16} />
                  <span>Edit</span>
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleCancel}
                    className="flex items-center space-x-1"
                  >
                    <X size={16} />
                    <span>Cancel</span>
                  </Button>
                  <Button
                    variant="primary"
                    size="small"
                    onClick={handleSave}
                    loading={isLoading}
                    className="flex items-center space-x-1"
                  >
                    <Save size={16} />
                    <span>Save</span>
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-6">
              {/* Display Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
                    placeholder="Enter your display name"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {user.displayName || 'Not set'}
                  </p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                {isEditing ? (
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
                    placeholder="Tell us about yourself"
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-md min-h-[80px]">
                    {user.bio || 'No bio added yet'}
                  </p>
                )}
              </div>

              {/* Preferences */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferences
                </label>
                <div className="space-y-3 bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Email Notifications</span>
                    {isEditing ? (
                      <input
                        type="checkbox"
                        checked={formData.notifications}
                        onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                        className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
                      />
                    ) : (
                      <span className={`text-sm ${user.preferences?.notifications ? 'text-green-600' : 'text-red-600'}`}>
                        {user.preferences?.notifications ? 'Enabled' : 'Disabled'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Info */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Information
                </label>
                <div className="space-y-2 bg-gray-50 p-4 rounded-md">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm text-gray-900">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Member since:</span>
                    <span className="text-sm text-gray-900">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <h3 className="text-lg font-medium text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Once you delete your profile, there is no going back. This will permanently delete your account and all associated data.
                </p>
                <Button
                  variant="danger"
                  size="small"
                  onClick={() => setShowDeleteModal(true)}
                  className="flex items-center space-x-1"
                >
                  <Trash2 size={16} />
                  <span>Delete Profile</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Profile"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you absolutely sure you want to delete your profile? This action will:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
            <li>Permanently delete your account</li>
            <li>Remove all your to-do lists</li>
            <li>Delete all associated data</li>
            <li>This action cannot be undone</li>
          </ul>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteProfile}
              loading={isDeleting}
            >
              Delete Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};