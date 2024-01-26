import logo from './logo.svg';
import './App.css';
import UserList from './components/UserList';
import { useState } from 'react';


function App() {
     


  return (
    <div className="">
      <div className="text-red bg-slate-800 p-3 text-center text-white font-bold   justify-between cursor-pointer">
        <h1> User Management System</h1>
       
      </div>

      <UserList />
    </div>
  );
}

export default App;
