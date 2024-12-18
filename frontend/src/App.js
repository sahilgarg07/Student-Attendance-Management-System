import './App.css';
import Navbar from './components/Navbar';
import Carousel from './components/Carousel'
import Footer from './components/Footer'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import EditProfile from './components/EditProfile';
import { useSelector } from 'react-redux';
import DashBoard from './components/Dashboard';
import { useAuthPersist } from './hooks/useAuthPersist';
import { useEffect, useState } from 'react';
import CourseSession from './components/CourseSession';
import EnrolledSession from './components/EnrolledSession';
import MarkAttendance from './components/MarkAttendance';
import StudentsInSession from './components/StudentsInSession';

function App() {
  const user = useSelector((state) => state.users.user);
  const person = useSelector((state) => state.persons.person);
  const [isLoading, setIsLoading] = useState(true);
  
  const checkAuth = useAuthPersist();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a more sophisticated loading component
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Carousel/>

        <div className="BodyContent">
          <Routes>
            <Route path="/" element={!person ? <Home /> : person.role ? <DashBoard /> : <EditProfile />} />
            <Route path="/login" element={!person ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!person ? <Signup /> : <Navigate to="/" />} />
            <Route path="/edit" element={<EditProfile />} />
            <Route path="/courseSession" element={!person ? <Home /> : person.role ? <CourseSession /> : <EditProfile />} />
            <Route path="/enrolledSession" element={!person ? <Home /> : person.role ? <EnrolledSession /> : <EditProfile />} />
            <Route path="/markAttendance" element={!person ? <Home /> : person.role ? <MarkAttendance /> : <EditProfile />} />
            <Route path="/studentsInSession" element={!person ? <Home /> : person.role ? <StudentsInSession /> : <EditProfile />} />
          </Routes>
        </div>

        <Footer/>
      </BrowserRouter>
    </div>
  );
}

export default App;