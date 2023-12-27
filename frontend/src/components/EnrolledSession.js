import React, {useEffect, useState} from 'react';
import '../styles/componentStyle.css';
import {Tabs, Tab, ListItemText, Divider, ListItem, List} from '@mui/material';
// import Tab from '@mui/material/Tab';
// import Typography from '@mui/material/Typography';
// import SpeedDial from '@mui/material/SpeedDial';
// import SpeedDialIcon from '@mui/material/SpeedDialIcon';
// import SpeedDialAction from '@mui/material/SpeedDialAction';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Typography,
    SpeedDial,
    SpeedDialIcon,
    SpeedDialAction,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    TextField,
    Alert

} from '@mui/material';
// import { TimePicker } from '@mui/x-date-pickers';

import axiosInstance from "../axios";
import {useSelector} from "react-redux";
import {json, useNavigate} from "react-router-dom";
import {useLocation} from 'react-router-dom';

const EnrolledSession = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [courseName, setcourseName] = useState("");
    // const [verificationCode, setverificationCode] = useState("");

    //Need to take the date and location automatically, no need for user to enter them, just for temporary purposes
    const [date, setDate] = useState("");
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////


    ////These are temporary until location  functionality is implemented////////////////////////////
    const [showPopup, setShowPopup] = useState(false);
    const [currSession, setCurrSession]=useState(null);
    const [lat, setLat] = useState(null);
    const [lon, setLon]=useState(null);

    const handleLat = (event) => {
        setLat(parseFloat(event.target.value));
      };

    const handleLon = (event) => {
        setLon(parseFloat(event.target.value));
    };
    
      const handleSubmit = async() => {
        // Process the input value or perform any necessary actions
        console.log('Latitude', lat);
        console.log('Longitude', lon);
        const name_of_course=currSession.course_name;
        console.log(name_of_course);
        // Close the pop-up after processing the input
        setShowPopup(false);
        if(isWithinRadius(parseFloat(lat),parseFloat(lon),parseFloat(currSession.lat),parseFloat(currSession.lon),5)){
            await navigate('/markAttendance');
        }else{
            alert("You are not in the vicinity to mark the attendance.");
        }
    
        // Proceed to the next page or perform other actions
        // Add your logic here for navigation or other operations
      };

////////////////////////////////////////////////////////////////////////////////////
  

    const location=useLocation();

    const {name_of_course} = location.state || {};
    console.log(name_of_course);

    const person = useSelector((state) => {
        return state.persons.person;
    });
    
    const navigate = useNavigate();
    
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //this function needs to be modified once the location functionality is implemented

    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c * 1000; // Distance in meters
        return distance;
      }
    
      // Function to convert degrees to radians
      function toRadians(degrees) {
        return degrees * (Math.PI / 180);
      }


    function isWithinRadius(userLat, userLon, pointLat, pointLon, radius) {
        const distance = calculateDistance(userLat, userLon, pointLat, pointLon);
        return distance <= radius;
    }
   
   
    const handleClickCourse = (item) =>{
       setCurrSession(item);
       setShowPopup(true);

    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const [selectedTab, setSelectedTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };
    const [open, setOpen] = useState(false);

    const handleSpeedDialOpen = () => {
        setOpen(true);
    };

    const handleSpeedDialClose = () => {
        setOpen(false);
    };





////////////////////////////////////////////////
    const [datasessions,setDataSessions]=useState([])

    useEffect(() => {
        const fetchDataSession = async () => {
            try {
                const response = await axiosInstance.post("Home/show_sessions", { course_name: name_of_course });
                console.log(response);

                const { course_data: courseData } = response.data;
                console.log(courseData);
                setDataSessions(courseData);
            } catch (error) {
                console.error('Error fetching data Sessions:', error);
            }
        };

        fetchDataSession();

    }, []); 


    const [dataActiveSessions,setActiveDataSessions]=useState([])  


    useEffect(() => {
        const fetchActiveDataSession = async () => {
            try {
                const response = await axiosInstance.post("Home/show_active_sessions", { course_name: name_of_course });
                console.log(response);

                const { course_data: courseData } = response.data;
                console.log(courseData);
                setActiveDataSessions(courseData);
            } catch (error) {
                console.error('Error fetching data Sessions:', error);
            }
        };

        fetchActiveDataSession();

    }, []); 
////////////////////////////////////////////////




    // const handlecourseNameChange = (event) => {
    //     setcourseName(event.target.value);
    // };

//////////////////////////////Adjust date and location function so that it can be detected automatically////////////////////////////////////////
    const handleDate = (event) => {
        setDate(event.target.value);
    };

    const handleStartTime = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTime = (event) => {
        setEndTime(event.target.value);
    };

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

    const handleActionClick = () => {
        handleSpeedDialClose();
        // Open the dialog when a SpeedDialAction is clicked
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };


    // const handleSubmit =async () => {
    //     // Handle the submitted value (rangeInput) her
    //    const response = await axiosInstance.post("/Home/course", {name: courseName, teacher:person.username})
    //     console.log(response)
    //     handleDialogClose(); // Close the dialog after submitting
    // };





////////////////////////////////////////////////////////////////////////////
    const handleSubmitSession =async () => {
        // Handle the submitted value (rangeInput) her
        try{
            const response = await axiosInstance.post("/Home/create", {course_name:name_of_course,date:date,start_time:start_time,end_time:end_time})
            console.log(response)
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend of course in session page:', error);
        }

    };

///////////////////////////////////////////////////////////////////
    const actions = [
        {icon: <AddIcon/>, name: 'Add'},
        {icon: <EditIcon/>, name: 'Edit'},
        {icon: <DeleteIcon/>, name: 'Delete'},
    ];


    return (
        <div className="dash" style={{ position: 'relative' }}>
            <Tabs
                value={selectedTab}
                onChange={handleTabChange}
                style={{width: '950px'}}
                TabIndicatorProps={{
                    style: {
                        backgroundColor: '#007bff'
                    },
                }}
                sx={{marginBottom: '20px'}}
            >
                <Tab label="All Sessions"/>
                <Tab label="Active Sessions"/>
                
            </Tabs>
            {selectedTab === 0 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {datasessions.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start" >

                                    <ListItemText
                                        primary={item.date}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >

                                                </Typography>
                                                From {item.start_time} to {item.end_time}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>


                </div>
            )}

            {selectedTab === 1 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {dataActiveSessions.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start" onClick={() => handleClickCourse(item)}>

                                    <ListItemText
                                        primary={item.date}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >

                                                </Typography>
                                                From {item.start_time} to {item.end_time}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>


                </div>
            )}
{/* /////////////////////////////////////////////////////////// */}
        {showPopup && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 999,
            }}
          >
            <h2>Enter latitude</h2>
            <input
              type="number"
              value={lat}
              onChange={handleLat}
              style={{ marginBottom: '10px' }}
            />
            <h2>Enter longitude</h2>
            <input
              type="number"
              value={lon}
              onChange={handleLon}
              style={{ marginBottom: '10px' }}
            />
            <button onClick={handleSubmit}>Submit</button>
          </div>
        </div>
      )}
 {/* /////////////////////////////////////////////////////////// */}
          
           


        </div>
    );
};

export default EnrolledSession;
