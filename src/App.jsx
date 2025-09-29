import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LoginPage , AdminPanelPage, CompanyLoginPage, CompanyPanelPage } from './pages';
import {CompanyPrivateRoute, PrivateRoute} from './components/PrivateRoute';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/admin/login' element={<LoginPage/>} />
          <Route path='/super-admin' element={<PrivateRoute><AdminPanelPage/></PrivateRoute>} />

          <Route path='/:companyName' element={<CompanyLoginPage/>}/>
          <Route path='/company' element={<CompanyPrivateRoute><CompanyPanelPage/></CompanyPrivateRoute>}/>

          <Route path="*" element={<CompanyLoginPage/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
