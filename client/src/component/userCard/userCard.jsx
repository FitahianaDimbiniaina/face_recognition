import { useState, useEffect, useRef } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

export default function UserCard({ user, onDelete, openId, setOpenId }) {
  const menuRef = useRef();

  const isOpen = openId === user.id;

  const handleDeleteClick = (e) => {
    e.stopPropagation();  
    onDelete(user.id);   
  };

  return (
    <div className="relative bg-white rounded-2xl shadow p-4 flex flex-col items-center transition hover:shadow-md">
      <img
        src={user.img_ref}
        alt={`${user.first_name} ${user.last_name}`}
        className="w-24 h-24 rounded-full object-cover mb-4"
      />
      <div className="text-center">
        <p className="text-lg font-semibold">{user.first_name} {user.last_name}</p>
      </div>

      <div ref={menuRef} className="absolute top-2 right-2">
        <FiMoreVertical
          className="text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={() => setOpenId(isOpen ? null : user.id)}  // Toggle menu on click
        />
        {isOpen && (
          <div className="absolute right-0 mt-2 w-28 bg-white rounded-xl shadow-lg py-2 z-10">
            <button
              onClick={handleDeleteClick}  // Trigger delete when clicked
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
