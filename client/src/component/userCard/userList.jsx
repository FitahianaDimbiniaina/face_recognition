import React, { useState } from 'react';
import UserCard from './userCard';

const UserList = ({ users, handleDelete }) => {
  const [openId, setOpenId] = useState(null);

  return (
    <div className="flex flex-wrap justify-center">
      {users.map((user) => (
        <div key={user.id} className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2">
          <UserCard
            user={user}
            onDelete={handleDelete}
            openId={openId}
            setOpenId={setOpenId}
          />
        </div>
      ))}
    </div>
  );
};

export default UserList;
