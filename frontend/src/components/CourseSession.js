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

import { red } from '@mui/material/colors';
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

} from '@mui/material';
// import { TimePicker } from '@mui/x-date-pickers';

import axiosInstance from "../axios";
import {useSelector} from "react-redux";
import {json, useNavigate} from "react-router-dom";
import {useLocation} from 'react-router-dom';

const CourseSession = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    // const [courseName, setcourseName] = useState("");
    // const [verificationCode, setverificationCode] = useState("");

    //Need to take the date and location automatically, no need for user to enter them, just for temporary purposes
    const [date, setDate] = useState("");
    const [start_time, setStartTime] = useState("");
    const [end_time, setEndTime] = useState("");
    const [lat, setLat] = useState(0.0);
    const [lon, setLon] = useState(0.0);

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // const [courseCode, setcourseCode] = useState("");
    // const [opencourseCode, setopencourseCode] = useState(false);
    
    const location=useLocation();
    
    const {name_of_course,username_of_person} = location.state || {};
    console.log(name_of_course);
    
    const person = useSelector((state) => {
        return state.persons.person;
    });
    
    const navigate = useNavigate();
    
    const handleClickSession =(item) =>{

        const name_of_course=item.course_name;
        const date_of_session=item.date;
        const lat_of_session=item.lat;
        const lon_of_session=item.lon;
        const start_time_of_session=item.start_time;
        const end_time_of_session=item.end_time;
        navigate("/studentsInSession",{state: {name_of_course,username_of_person,date_of_session,lat_of_session,lon_of_session,start_time_of_session,end_time_of_session}});
    }
    
    
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
                const response = await axiosInstance.post("Home/show_sessions", { course_name: name_of_course,student_username: username_of_person });
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
    ////////////////////////////////////////////////
    
    const [studentList, setStudentList]=useState([]);
    useEffect(() => {
        const fetchDataStudents= async () => {
            try {
                const response = await axiosInstance.post("Home/show_students", { course_name: name_of_course });
                console.log(response);
                
                const { course_data: courseData } = response.data;
                console.log(courseData);
                setStudentList(courseData);
            } catch (error) {
                console.error('Error fetching data Sessions:', error);
            }
        };
        
        fetchDataStudents();
        
    }, []); 
    ////////////////////////////////////////////////


    // const handlecourseNameChange = (event) => {
    //     setcourseName(event.target.value);
    // };

//////////////////////////////////////////////////////////////////////
    const handleDate = (event) => {
        setDate(event.target.value);
    };

    const handleStartTime = (event) => {
        setStartTime(event.target.value);
    };

    const handleEndTime = (event) => {
        setEndTime(event.target.value);
    };

    const handleLat = (event) => {
        setLat(parseFloat(event.target.value));
    }; 

    const handleLon = (event) => {
        setLon(parseFloat(event.target.value));
    }; 


////////////////////////////////////////////////////////////////////////////////////////////////////////////



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Need to be corrected later%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5//
// useEffect(() => {
    // const  getCoords =()=>{
    // // Get user's location
    //     navigator.geolocation.getCurrentPosition(
    //         function (position) {
    //         const userLat = position.coords.latitude;
    //         const userLon = position.coords.longitude;
    //         console.log("Hello");
    //         console.log(userLat);
    //         console.log(userLon);
    //         setLat(userLat);
    //         setLon(userLon);
    //         setLoading(false);
    //         },
    //         function (error) {
    //         console.error("Error getting user's location:", error);
    //         }
    //     );
    // }

    // useEffect(() =>{
    //     getCoords();
    //     },[]
    // );


// }, []);

    
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5//

////////////////////////////////////////////////////////////
    const [del,setDel]=useState(false);

    const handleDelVisibility=()=>{
        setDel(true);
    };

    const handleActionClick= (name) => {
        if(name==='Delete'){
            handleSpeedDialClose();
            handleDelVisibility();
        }
        else{
            
            handleSpeedDialClose();
            // Open the dialog when a SpeedDialAction is clicked
            setOpenDialog(true);
        }
    };
////////////////////////////////////////////////////////////

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
 
            const response = await axiosInstance.post("/Home/create", {course_name:name_of_course,date:date,start_time:start_time,end_time:end_time,lat:lat,lon:lon})
            // console.log(response)
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend of course in session page:', error);
        }

    };

///////////////////////////////////////////////////////////////////

const deleteCreatedCourse=async(item)=>{

        const response=await axiosInstance.post("/Home/delete_session",{course_name:item.course_name,date:item.date,start_time:item.start_time,end_time:item.end_time,lat:item.lat,lon:item.lon});
        console.log(response);
        navigate("/")

}
//////////////////////////////////////////////////////////////////
    const actions = [
        {icon: <AddIcon/>, name: 'Add'},
        {icon: <EditIcon/>, name: 'Edit'},
        {icon: <DeleteIcon/>, name: 'Delete'},
    ];


    return (
        <div className="dash">
                <h2>{name_of_course}</h2>
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
                <Tab label="Sessions"/>
                <Tab label="Enrolled Students"/>

                </Tabs>
                {selectedTab === 0 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {datasessions.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start"  onClick={() => handleClickSession(item)}>
                                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <div>
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
                                        </div>
                                        {del && <DeleteIcon sx={{ color: red[500] }} onClick={()=>deleteCreatedCourse(item)}/>}
                                    </div>
                                </ListItem>
                            </div>
                        ))}
                    </List>
                {/********************************Enrolled Speed Dial Changes start************************************************** */}
                    <div className="speed-dial">
                      {/* <AddRoundedIcon color="primary" onClick={handleActionClick} sx={{ fontSize: 40 }}/> */}
                        <SpeedDial
                            ariaLabel="SpeedDial example"
                            icon={<SpeedDialIcon/>}
                            onClose={handleSpeedDialClose}
                            onOpen={handleSpeedDialOpen}
                            open={open}
                            direction="up" // Change direction as needed
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={()=>handleActionClick(action.name)}
                                />
                            ))}
                        </SpeedDial>
                    </div>
                    {/* Dialog for the pop-up */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                    >
                        <DialogTitle id="dialog-title">{"Create New Session"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="dialog-description">
                                <TextField
                                    label="Select Date"
                                    type="date"
                                    value={date}
                                    onChange={handleDate}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{ marginTop: '16px',marginBottom: '16px' }}
                                />
                                <TextField
                                    label="Select Start Time"
                                    type="time"
                                    value={start_time}
                                    onChange={handleStartTime}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                />                                
                                <TextField
                                    label="Select End Time"
                                    type="time"
                                    value={end_time}
                                    onChange={handleEndTime}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                /> 

                                <TextField
                                    label="Enter Latitude"
                                    type='float'
                                    value={lat}
                                    onChange={handleLat}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                />  


                                <TextField
                                    label="Enter Longitude"
                                    type='float'
                                    value={lon}
                                    onChange={handleLon}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                />  

                            </DialogContentText>
                            

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitSession} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                {/****************************************Enrolled Speed Dial Changes End****************************************** */}
                </div>
                )} 
                {selectedTab === 1 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {studentList.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start">

                                    <ListItemText
                                        primary={item.name}
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >

                                                </Typography>
                                                {item.rollNumber}
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>

                </div>
                )} 

        </div>
      );
      
};

export default CourseSession;

