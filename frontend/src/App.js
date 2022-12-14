import React, { useState, useEffect, useContext, createContext } from 'react'

// import { Drawer, ListItem, ListItemIcon, ListItemText, Button } from "@material-ui/core";
// import Sidebar from './components/Sidebar'
// import Header from './components/Header'
import Dashboard from './components/Dashboard'
import './App.css'

export const MyContext = createContext()

export default function App() {

  const classColours = {
    'Death Knight': '2c2e36',
    'Demon Hunter': '#193338',
    'Druid': '#703606',
    'Hunter': '#016E01',
    'Mage': '#0092AB',
    'Paladin': '#AA8F00',
    'Priest': '#A7A17F',
    'Rogue': '#4C4D48',
    'Shaman': '#0070DE',
    'Warlock': '#7624AD',
    'Warrior': '#8E1002'
  }

  return (
    <>
      <MyContext.Provider value={classColours}>
        <Dashboard />
      </MyContext.Provider>
    </>
  );
}