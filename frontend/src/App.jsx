import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './screens/Login'
import Register from './screens/Register'
import Landing from './screens/Landing'
import Hosting from './screens/Hosting'
import ListingCreate from './screens/ListingCreate'
import ListingEdit from './screens/ListingEdit'
import ListingPublish from './screens/ListingPublish'
import Listing from './screens/Listing'
import Managebooking from './screens/ManageBooking'

function App () {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/' element={<Landing />} />
        <Route path='/hosting' element={<Hosting />} />
        <Route path='/listingcreate' element={<ListingCreate />} />
        <Route path='/listingedit/:id' element={<ListingEdit />} />
        <Route path='/listingpublish/:id' element={<ListingPublish />} />
        <Route path='/listing/:id' element={<Listing />} />
        <Route path='/managebooking/:id' element={<Managebooking/>}/>
      </Routes>
    </BrowserRouter>
  </>
}

export default App;
