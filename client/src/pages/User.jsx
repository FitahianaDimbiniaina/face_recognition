import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UserList from '../component/userCard/userList';
import { Link } from 'react-router-dom';
export default function User() {
  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],  // Corrected queryKey format
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/users');
      if (!response.ok) throw new Error('Error fetching users');
      return response.json();
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id) => {
      const response = await fetch(`http://localhost:5000/users/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error deleting user');
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(['users'], (oldData) =>
        oldData.filter((user) => user.id !== deletedId)
      );
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleDelete = (id) => {
    console.log('Deleting user with id:', id); 
    deleteUserMutation.mutate(id);
  };
  

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4">
        <button className="px-4 py-2 rounded">  
        <Link to="/add-user" className="block text-lg font-medium py-2 px-4 rounded-lg  bg-gray-300 hover:bg-gray-200 transition-colors">
          Add user
        </Link>
        </button>
      </div>
      <UserList users={users} handleDelete={handleDelete} />
    </div>
  );
}
