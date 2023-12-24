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

const Dashboard = () => {

    const [openSpeedDial, setOpenSpeedDial] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [courseName, setcourseName] = useState("");
    const [verificationCode, setverificationCode] = useState("");
    const [courseCode, setcourseCode] = useState("");
    const [opencourseCode, setopencourseCode] = useState(false);

    const person = useSelector((state) => {
        return state.persons.person;
    });

    const navigate = useNavigate();
 ////////////////////////////////////////////////////////////////////////////// 
    const handleClickCourse = async (name_of_course) =>{
       await navigate("/courseSession",{state: {name_of_course}});
    }

    const handleClickEnrollCourse = async (name_of_course) =>{
        await navigate("/enrolledSession",{state: {name_of_course}});
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

////////////////////////////////////////////////
    const [datacreate,setDataCreated]=useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.post("Home/show_created", { teacher: person.username });
                console.log(response);

                const { course_data: courseData } = response.data;
                console.log(courseData);
                setDataCreated(courseData);
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
    const handleSubmit =async () => {
        // Handle the submitted value (rangeInput) her
        try{
            const response = await axiosInstance.post("/Home/course", {name: courseName, teacher:person.username})
            console.log(response)
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
            console.log(response)
            handleDialogClose(); // Close the dialog after submitting
        }
        catch(error){
            console.error('Error in response from backend from creation of course:', error);
        }

    };

///////////////////////////////////////////////////////////////////
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
                                <ListItem alignItems="flex-start" onClick={() => handleClickEnrollCourse(item.name)}>

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
                                                Taught by {item.teacher}
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
                                    onClick={handleActionClick}
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
                                <ListItem alignItems="flex-start" onClick={() => handleClickCourse(item.name)}>

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
                                                {item.verification_code}
                                            </React.Fragment>
                                        }
                                    />
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
                                    onClick={handleActionClick}
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
