import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import { useSelector } from 'react-redux';
import DashBoard from './components/Dashboard';
import { useVerifyUser } from './hooks/useVerifyUser';
import { useEffect } from 'react';
import CourseSession from './components/CourseSession';
import EnrolledSession from './components/EnrolledSession';


function App() {
  const user = useSelector((state) => {
    return state.users.user;
  });
  const person = useSelector((state) => {
    return state.persons.person;
  });

  const { verifystate, isVerifying } = useVerifyUser();

  useEffect(() => {
    verifystate();
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        {/* Navbar */}
        {/*<DashBoard />*/}
        <Navbar />


        {/* Body Content */}
        <div className="BodyContent">
          <Routes>
            <Route path="/" element={!person ? <Home /> : person.role ? <DashBoard /> : <EditProfile />} />
            <Route path="/login" element={!person ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!person ? <Signup /> : <Navigate to="/" />} />
            <Route path="/edit" element={<EditProfile />} />
            <Route path="/courseSession" element={!person ? <Home /> : person.role ? <CourseSession /> : <EditProfile />} />
            <Route path="/enrolledSession" element={!person ? <Home /> : person.role ? <EnrolledSession /> : <EditProfile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
