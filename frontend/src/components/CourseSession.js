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
import { PieChart } from '@mui/x-charts/PieChart';
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
    const [radius_of_session,setRadiusOfSession]=useState(0.0);

    
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    // const [courseCode, setcourseCode] = useState("");
    // const [opencourseCode, setopencourseCode] = useState(false);
    
    const location=useLocation();
    
    const {name_of_course,username_of_person,teacher_of_course,verification_code_of_course} = location.state || {};
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
                if(response.data.msg==="course_name field is required."){
                    alert(response.data.msg);
                }else if(response.data.msg==="No such course exist."){
                    alert(response.data.msg);
                } 
                
                else{

                    const { course_data: courseData } = response.data;
                    console.log(courseData);
                    setDataSessions(courseData);
                }
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
                if(response.data.msg==="No such course exist."){
                    alert(response.data.msg);
                }else{

                    const { course_data: courseData } = response.data;
                    console.log(courseData);
                    setStudentList(courseData);
                }
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

    const handleRadius = (event) => {
        setRadiusOfSession(parseFloat(event.target.value));
    }; 

////////////////////////////////////////////////////////////////////////////////////////////////////////////



//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%Need to be corrected later%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%5//
useEffect(() => {
    // Get user's location
        navigator.geolocation.getCurrentPosition(
            function (position) {
            const userLat = position.coords.latitude;
            const userLon = position.coords.longitude;
            console.log("Hello for teacher coords");
            console.log(userLat);
            console.log(userLon);
            setLat(userLat);
            setLon(userLon);
            // setLoading(false);
            },
            function (error) {
            console.error("Error getting user's location:", error);
            }
        );



}, []);

    
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
            if(response.data.msg==="Failed to create session"){
                alert(response.data.msg);
            }
            if(response.data.msg==="Session Already exists"){
                alert(response.data.msg);
            }
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend of course in session page:', error);
        }

    };

///////////////////////////////////////////////////////////////////

const deleteCreatedCourse=async(item)=>{

        const response=await axiosInstance.post("/Home/delete_session",{course_name:item.course_name,date:item.date,start_time:item.start_time,end_time:item.end_time,lat:item.lat,lon:item.lon});
        if(response.data.msg==="No such session exist."){
            alert(response.data.msg);
        } 
        if(response.data.msg==="Invalid Course Code"){
            alert(response.data.msg);
        }
        if(response.data.msg==="Student not found."){
            alert(response.data.msg);
        }
        if(response.data.msg==="Invalid courses_list format in student."){
            alert(response.data.msg);
        }
        console.log(response);
        navigate("/")

}
//////////////////////////////////////////////////////////////////
    const actions = [
        {icon: <AddIcon/>, name: 'Add'},
        {icon: <DeleteIcon/>, name: 'Delete'},
    ];



/////////////////////////////////////////////////////////////////////////////////////////////////////
    // // {"num_enrolled":number_enrolled_students,"num_sessions":number_sessions,"avg_rate":average_attendance_rate,"max_session_date":session.date,"start_time":session.start_time,"end_time":session.end_time}
    // const [course_stats,setCourseStats]=useState({"num_enrolled":0,
    //                                               "num_sessions":0,
    //                                               "avg_rate":0,
    //                                               "max_session_date":"No such session",
    //                                               "start_time":"00:00",
    //                                               "end_time":"00:00"});
    // const [attendance_rate,setAttendanceRate]=useState(0.0);

    // useEffect(() => {  
    //     const fetchDataCourseStats= async () => {  
    //         const response=await axiosInstance.post("/Home/course_stats",{course_name:name_of_course,verification_code:verification_code_of_course})
    //         setCourseStats({num_enrolled:response.data.num_enrolled,
    //                         num_sessions:response.data.num_sessions,
    //                         avg_rate:response.data.avg_rate,
    //                         max_session_date:response.data.max_session_date,
    //                         start_time:response.data.start_time,
    //                         end_time:response.data.end_time})
    //     }

    //     fetchDataCourseStats();

    //     if(parseFloat(course_stats.num_enrolled)!==0){
    
    //         setAttendanceRate(parseFloat(course_stats.avg_rate)/parseFloat(course_stats.num_enrolled));
    //     }
    // }, []); 

//////////////////////////////////////////////////////////////////////////////////////////////////
    return (
        <div className="dash">
                {/* <div style={{ display: 'flex', flexDirection: 'column', backgroundColor: '#F2F2F2', padding: '20px' }}>
                    <div style={{ width: '100%', marginBottom: '20px' }}>
                        <p>Course Name: {name_of_course}</p>
                        <p>Teacher: {teacher_of_course}</p>
                        <p>Verification Code:{verification_code_of_course}</p>

                    </div>

                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                        <div style={{ flex: '1 1 50%' }}>
                            <p>Enrolled Students: {course_stats.num_enrolled}</p>
                            <p>Total Sessions: {course_stats.num_sessions}</p>
                            <p>Session with max Attendance Rate: {course_stats.date}</p>
                            <p>Start Time:{course_stats.start_time}</p>
                            <p>End Time:{course_stats.end_time}</p>
                        </div>
                        <div style={{ flex: '1 1 50%' }}>
                            <PieChart
                                series={[
                                    {
                                    data: [
                                        { id: 0, value: attendance_rate, label: 'Present' },
                                        { id: 1, value: 100-attendance_rate, label: 'Absent' }
                                    ],
                                    },
                                ]}
                                width={100}
                                height={100}
                            />
                        </div>
                    </div>

                </div> */}
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
{/* 
                                <TextField
                                    label="Enter Radius"
                                    type='float'
                                    value={radius_of_session}
                                    onChange={handleRadius}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true, // Moves the label outside when there's a value
                                    }}
                                    style={{marginBottom: '16px' }}
                                />   */}



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

