import React, { useState, useEffect } from 'react';
import { Plus, List, Calendar, Search } from 'lucide-react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { useAuth } from '../components/Auth/AuthProvider';
import { db } from '../lib/firebase';
import { TodoList } from '../types';
import { Button } from '../components/UI/Button';
import { ListCard } from '../components/TodoList/ListCard';
import { CreateListForm } from '../components/TodoList/CreateListForm';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [lists, setLists] = useState<TodoList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch lists from Firestore
  useEffect(() => {
    if (!user) return;

    // Use the correct nested collection path: /users/{userId}/lists
    const listsCollectionRef = collection(db, `users/${user.uid}/lists`);
    
    const listsQuery = query(
      listsCollectionRef,
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(listsQuery, (snapshot) => {
      const listsData: TodoList[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        listsData.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        } as TodoList);
      });
      setLists(listsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleCreateList = async (title: string, description: string) => {
    if (!user) return;

    try {
      // Use the correct nested collection path for adding a document
      const listsCollectionRef = collection(db, `users/${user.uid}/lists`);
      await addDoc(listsCollectionRef, {
        title,
        description,
        itemCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating list:', error);
      throw error;
    }
  };

  const handleDeleteList = async (listId: string) => {
    if (!user) return;

    try {
      // Use the correct nested document path for deletion
      const listDocRef = doc(db, `users/${user.uid}/lists`, listId);
      await deleteDoc(listDocRef);
    } catch (error) {
      console.error('Error deleting list:', error);
      throw error;
    }
  };

  const filteredLists = lists.filter((list) =>
    list.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ... rest of the component remains the same
  if (!user) {
    return (
      <h1>Loading....</h1>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black">My Lists</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user.displayName || user.email}! Manage your to-do lists here.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button
                variant="primary"
                size="medium"
                onClick={() => setShowCreateForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create New List</span>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search lists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-2 border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition-colors duration-300"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <h1>Loading....</h1>
        ) : (
          <>
            {filteredLists.length === 0 ? (
              <div className="text-center py-12">
                {lists.length === 0 ? (
                  // Empty state for no lists
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <List className="text-yellow-600" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">No lists yet</h3>
                    <p className="text-gray-600 mb-6">
                      Get started by creating your first to-do list. Stay organized and boost your productivity!
                    </p>
                    <Button
                      variant="primary"
                      size="large"
                      onClick={() => setShowCreateForm(true)}
                      className="flex items-center space-x-2 mx-auto"
                    >
                      <Plus size={20} />
                      <span>Create Your First List</span>
                    </Button>
                  </div>
                ) : (
                  // Empty state for no search results
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-gray-400" size={40} />
                    </div>
                    <h3 className="text-xl font-semibold text-black mb-2">No lists found</h3>
                    <p className="text-gray-600 mb-6">
                      No lists match your search query. Try different keywords or create a new list.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => setSearchQuery('')}
                    >
                      Clear Search
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-400">
                    <div className="flex items-center">
                      <List className="text-yellow-400 mr-3" size={24} />
                      <div>
                        <p className="text-2xl font-bold text-black">{lists.length}</p>
                        <p className="text-gray-600 text-sm">Total Lists</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-400">
                    <div className="flex items-center">
                      <Calendar className="text-blue-400 mr-3" size={24} />
                      <div>
                        <p className="text-2xl font-bold text-black">
                          {lists.filter(list =>
                            new Date(list.createdAt).toDateString() === new Date().toDateString()
                          ).length}
                        </p>
                        <p className="text-gray-600 text-sm">Created Today</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lists Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLists.map((list) => (
                    <ListCard
                      key={list.id}
                      list={list}
                      onDelete={handleDeleteList}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Create List Form Modal */}
      <CreateListForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateList}
      />
    </div>
  );
};
