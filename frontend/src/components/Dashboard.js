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
    TextField
} from '@mui/material';
import axiosInstance from "../axios";
import {useSelector} from "react-redux";
import {json, useNavigate} from "react-router-dom";
import { red } from '@mui/material/colors';

const Dashboard = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [courseName, setcourseName] = useState("");
    const [verificationCode, setverificationCode] = useState("");
    const [courseCode, setcourseCode] = useState("");
    const [opencourseCode, setopencourseCode] = useState(false);
    const [del,setDel]=useState(false);

    const person = useSelector((state) => {
        return state.persons.person;
    });

    const username_of_person=person.username;
    const navigate = useNavigate();
 ////////////////////////////////////////////////////////////////////////////// 
    const handleClickCourse = async (item) =>{
       const name_of_course=item.name;
       const verification_code_of_course=item.verification_code;
       const teacher_of_course = item.teacher;
       await navigate("/courseSession",{state: {name_of_course,username_of_person,teacher_of_course,verification_code_of_course}});
    }

    const handleClickEnrollCourse = async (item) =>{
        const name_of_course=item.name;
        const verification_code_of_course=item.verification_code;
        const teacher_of_course = item.teacher;
        await navigate("/enrolledSession",{state: {name_of_course,username_of_person,teacher_of_course,verification_code_of_course}});
     }
////////////////////////////////////////////////////////////////////////////////

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
/////////////////////////////////////////////////////
    const handleDelVisibility=()=>{
        setDel(true);
    };

////////////////////////////////////////////////
    const [datacreate,setDataCreated]=useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.post("Home/show_created", { teacher: person.username });
                console.log(response);
                if(response.data.msg==="No such teacher exist."){
                    alert(response.data.msg);
                }else{
                    
                    const { course_data: courseData } = response.data;
                    console.log(courseData);
                    setDataCreated(courseData);
                }
            } catch (error) {
                console.error('Error fetching data Created Courses Data:', error);
            }
        };

        fetchData();

    }, []); 
////////////////////////////////////////////////



////////////////////////////////////////////////
    const [dataenroll,setDataEnrolled]=useState([])

    useEffect(() => {
        const fetchDataEnrolled = async () => {
            try {
                const response = await axiosInstance.post("Home/show_enrolled", { teacher: person.username });
                console.log(response);

                const { course_data: courseData } = response.data;
                console.log(courseData);
                setDataEnrolled(courseData);
            } catch (error) {
                console.error('Error fetching data Enrolled Courses Data:', error);
            }
        };

        fetchDataEnrolled();

    }, []); 
////////////////////////////////////////////////




    const handlecourseNameChange = (event) => {
        setcourseName(event.target.value);
    };

    const handleverificationCodeChange = (event) => {
        setverificationCode(event.target.value);
    };
    const handlecourseCodeChange = (event) => {
        setcourseCode(event.target.value);
    };

////////////////////////////////////////////////////////////
    const handleActionClick = (name) => {

            handleSpeedDialClose();
            // Open the dialog when a SpeedDialAction is clicked
            setOpenDialog(true);

    };

    const handleActionClickCreated = (name) => {
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
/////////////////////////////////////////////////////////////////////////////////

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
    const handleSubmit =async () => {
        // Handle the submitted value (rangeInput) her
        try{
            const response = await axiosInstance.post("/Home/course", {name: courseName, teacher:person.username})
            if(response.data.msg==="Course Name already taken"){
                alert(response.data.msg);
            }
            if(response.data.msg==="Invalid Serializer: Failed to create course"){
                alert(response.data.msg);
            }
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend from creation of course:', error);
        }

    };

///////////////////////////////////////////////////////////////////




////////////////////////////////////////////////////////////////////////////
    const handleSubmitEnrolled =async () => {
        // Handle the submitted value (rangeInput) her
        try{
            const response = await axiosInstance.post("/Home/course_registration", {verification_code_entered: verificationCode, student_id:person.username})
            if(response.data.msg==="student_id and verification_code_entered fields are required."){
                alert(response.data.msg);
            }
            if(response.data.msg==="Invalid Verification Code"){
                alert("Invalid Verification Code");
            }
            if(response.data.msg==="Student not found."){
                alert(response.data.msg);
            }
            if(response.data.msg==="Invalid courses_list format in student."){
                alert(response.data.msg);
            }
            
            console.log(response)
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend from creation of course:', error);
        }

    };

///////////////////////////////////////////////////////////////////
    const deleteCreatedCourse=async(item)=>{
        if(item.name==='No courses Created so far'){
            const response=await axiosInstance.post("/Home/delete_course",{course_name:item.name,verification_code:-1,teacher:"John Doe"});
            if(response.data.msg==="No such course exist."){
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
            
        }else{
            const response=await axiosInstance.post("/Home/delete_course",{course_name:item.name,verification_code:item.verification_code,teacher:item.teacher});
            if(response.data.msg==="No such course exist."){
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
    }



    const actions = [
        {icon: <AddIcon/>, name: 'Add'},
        {icon: <EditIcon/>, name: 'Edit'},
        {icon: <DeleteIcon/>, name: 'Delete'},
    ];

    // const dataenroll = [
    //     {name: 'CS102', description: 'Software Labs'},
    //     {name: 'CS210', description: 'Digital Circuits and Labs'},
    //     {name: 'CS222', description: 'Algorithm Design'}]
    // const datacreate = [
    //     {name: 'CS103', description: 'Software Labs'},
    //     {name: 'CS216', description: 'Digital Circuits and Labs'},
    //     {name: 'CS224', description: 'Algorithm Design'}]
    
    return (
        <div className="dash">
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
                <Tab label="Enrolled"/>
                <Tab label="Created"/>
            </Tabs>
            {selectedTab === 0 && (
                <div className='tab-det'>
                    {/* Content for Tab 1 */}
                    <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                        {dataenroll.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start" onClick={() => handleClickEnrollCourse(item)}>

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
                                                {item.teacher}
                                               
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                            </div>
                        ))}
                    </List>
{/********************************Enrolled Speed Dial Changes start************************************************** */}
                    <div className="speed-dial">
                       
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
                                    onClick={() => handleActionClick(action.name)}
                                />
                            ))}
                        // </SpeedDial> 
                    </div>
                    {/* Dialog for the pop-up */}
                    <Dialog
                        open={openDialog}
                        onClose={handleDialogClose}
                        aria-labelledby="dialog-title"
                        aria-describedby="dialog-description"
                    >
                        <DialogTitle id="dialog-title">{"Enroll for the Course"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="dialog-description">
                                <TextField
                                    label="Enter Course Verification Code"
                                    variant="filled"
                                    value={verificationCode}
                                    onChange={handleverificationCodeChange}
                                    fullWidth
                                />



                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmitEnrolled} color="primary">
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
                        {datacreate.map((item, index) => (<div className='tile' key={index}>
                                {index !== 0 && <Divider variant="offset" component="li"/>}
                                <ListItem alignItems="flex-start" onClick={() => handleClickCourse(item)}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                        <div>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            sx={{ display: 'inline' }}
                                                            component="span"
                                                            variant="body2"
                                                            color="text.primary"
                                                        >
                                                            {item.verification_code}
                                                        </Typography>
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
{/**********************************Created Speed Dial Changes start************************************************ */}
                    <div className="speed-dial">
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
                                    onClick={()=>handleActionClickCreated(action.name)}
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
                        <DialogTitle id="dialog-title">{"Create Course"}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="dialog-description">
                                <TextField
                                    label="Course Name"
                                    variant="filled"
                                    value={courseName}
                                    onChange={handlecourseNameChange}
                                    fullWidth
                                />



                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDialogClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleSubmit} color="primary">
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
{/****************************************Created Speed Dial Changes Ends****************************************** */}
                </div>
            )}
            {/* <div className="speed-dial">
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
                            onClick={handleActionClick}
                        />
                    ))}
                </SpeedDial>
            </div>
            
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby="dialog-title"
                aria-describedby="dialog-description"
            >
                <DialogTitle id="dialog-title">{"Create Course"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="dialog-description">
                        <TextField
                            label="Course Name"
                            variant="filled"
                            value={courseName}
                            onChange={handlecourseNameChange}
                            fullWidth
                        />



                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Submit
                    </Button>
                </DialogActions>
            </Dialog> */}

        </div>
    );
};

export default Dashboard;
