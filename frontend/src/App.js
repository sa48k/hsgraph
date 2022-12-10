import React, { useState, useEffect, useContext, createContext } from 'react'

// import { Drawer, ListItem, ListItemIcon, ListItemText, Button } from "@material-ui/core";
// import Sidebar from './components/Sidebar'
// import Header from './components/Header'
import Dashboard from './components/Dashboard'
import './App.css'

export const MyContext = createContext()

export default function App() {

  const classColours = {
    'Warrior': '#8E1002',
    'Shaman': '#0070DE',
    'Rogue': '#4C4D48',
    'Paladin': '#AA8F00',
    'Hunter': '#016E01',
    'Druid': '#703606',
    'Warlock': '#7624AD',
    'Mage': '#0092AB',
    'Priest': '#A7A17F',
    'Demon Hunter': '#193338',
    'Death Knight': '2c2e36'
  }

  return (
    <>
      <MyContext.Provider value={classColours}>
        <Dashboard />
      </MyContext.Provider>
    </>
  );
}