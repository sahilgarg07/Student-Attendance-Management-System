import React from 'react';
import iitGoaHostelImage from './static/iitgoa_hostel.png';
import login from './static/login.png';
import enroll from './static/enroll.png';
import attendance from './static/attendance.png';
import course from './static/course.png';
import session from './static/session.png';


const Home = () => {

    console.log("We are reaching Home");
    return ( 
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"/>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>
            <div className="home">
                {/* <div id="carouselExampleCaptions" class="carousel slide">

                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img src={iitGoaHostelImage} class="d-block w-100" alt="..."/>
                            <div class="carousel-caption d-none d-md-block">
                                <h5 style={{ fontSize: '30px', color: '#FFFFFF' }}>IIT Goa</h5>
                                <p style={{ fontSize: '24px', color: '#FFFFFF' }}>Student Record Management System</p>

                            </div>
                        </div>
                    </div>
    
                </div> */}

                <div className="container">
                    <h2 style={{ marginTop: '20px', marginBottom:'15px'}}>How to use our services? -- As a Student</h2>
                      <div class="row">
                        <div class="col-sm">
                            <div class="card" style={{width: '18rem'}}>
                                <img src={login} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">Login</h5>
                                    <p class="card-text">Log in to your account. If you don't have an account yet, you can create one. We recommend using your institute's roll number as your username.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="card" style={{width: '18rem'}}>
                                <img src={enroll} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">Enroll</h5>
                                    <p class="card-text">Enroll in your courses that have been registered on the server. Utilize the verification code provided by the teacher to complete the enrollment process for the course.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="card" style={{width: '18rem'}}>
                                <img src={attendance} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">Attend</h5>
                                    <p class="card-text">Mark attendance in the active sessions of your enrolled courses initiated by your course instructor.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>


                <div className="container">
                    <h2 style={{ marginTop: '20px', marginBottom:'15px'}}>How to use our services? -- As a Teacher</h2>
                      <div class="row">
                        <div class="col-sm">
                            <div class="card" style={{width: '18rem'}}>
                                <img src={login} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">Login</h5>
                                    <p class="card-text">Log in to your account or create one if you don't have an existing account. It's preferable to use a username that your students can easily identify you with.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="card" style={{width: '18rem'}}>
                                <img src={course} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">Register your course</h5>
                                    <p class="card-text">Register your course on our server and leverage our enhanced and secure record management services. After registration, share your class verification code with your students.</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm">
                            <div class="card" style={{width: '18rem'}}>
                                <img src={session} class="card-img-top" alt="..."/>
                                <div class="card-body">
                                    <h5 class="card-title">Create New Session</h5>
                                    <p class="card-text">Initiate a fresh session for enrolled students, enabling them to mark their attendance.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                
                <div className='container'>
                <h2 style={{ marginTop: '20px', marginBottom:'15px'}}>What's speacial about us?</h2>
                <div class="row">
                    <div className="col-sm" style={{ border: '1px solid rgb(48,48,48)', padding: '15px', margin: '10px' }}>
                        <h5>User Friendly and Efficient</h5>
                        <p>Our team of dedicated developers has meticulously crafted an attendance system that seamlessly blends user-friendliness with efficiency. Our system is designed to provide a hassle-free experience, ensuring that users can effortlessly mark their attendance with just a few clicks. Experience the convenience and reliability of our user-friendly, efficient attendance system tailored to meet your needs.</p>
                    </div>
                    <div className="col-sm" style={{ border: '1px solid rgb(48,48,48)', padding: '15px', margin: '10px' }}>
                        <h5>Reliable and Secure</h5>
                        <p>Employing robust measures, it ensures accuracy while safeguarding against unauthorized proxies. With a keen focus on integrity, our system employs cutting-edge technologies, stringent authentication, and vigilant monitoring, minimizing the possibility of proxy attempts to the greatest extent possible.</p>
                    </div>
                    <div className="col-sm" style={{ border: '1px solid rgb(48,48,48)', padding: '15px', margin: '10px' }}>
                        <h5>Modernisation of Student Record Management System</h5>
                        <p>Our attendance system is at the forefront of innovation, harnessing the power of cutting-edge technologies such as artificial intelligence and geolocation. Seamlessly integrated, these advanced tools elevate traditional record management to new heights.</p>
                    </div>

                </div>

                </div>

                {/* <footer class="text-center text-lg-start bg-body-tertiary text-muted">

                <section class="">
                    <div class="row mt-3"  style={{ backgroundColor: 'rgb(48, 48, 48)' , color: '#fff'}}>
                        <div class="col-md-3 col-lg-4 col-xl-3 mx-auto mb-4">

                        <h6 class="text-uppercase fw-bold mb-4" style={{ marginTop: '20px', marginBottom:'15px'}}>
                            <i class="fas fa-gem me-3"></i>IIT Goa
                        </h6>
                        <p>
                        Indian Institute of Technology Goa is an autonomous public university located in Goa. Ever since an IIT was allotted to Goa by the Central government in 2014, the new Indian Institute of Technology at Goa started functioning from July, 2016 in a temporary campus housed at Goa Engineering College.
                        </p>
                        </div>

                        <div class="col-md-4 col-lg-3 col-xl-3 mx-auto mb-md-0 mb-4">
                        <h6 class="text-uppercase fw-bold mb-4" style={{ marginTop: '20px', marginBottom:'15px'}}>Contact</h6>
                        <p style={{margin:'0', padding:'0'}}><i class="fas fa-home me-3" ></i>Bhausaheb Bandodkar Technical Education Complex,</p>
                        <p style={{margin:'0', padding:'0'}}><i class="fas fa-home me-3" ></i>Goa Engineering College Campus, Farmagudi, Ponda, Goa </p>
                        <p style={{marginTop:'0', marginBottom:'1rem'}}><i class="fas fa-home me-3" ></i>403401</p>

                        <p><i class="fas fa-phone me-3"></i>  0832 249 0861</p>
                        </div>
                    </div>
                </section>
                
                <div class="text-center p-4" style={{ backgroundColor: 'rgb(48, 48, 40)', color: '#fff' , fontSize: '1.5rem'}}>
                    © 2023 Copyright: <a class="text-reset fw-bold" href="https://iitgoa.ac.in/">IIT Goa</a>
                </div>
                
                </footer> */}




         </div>
        </>

     );
}
 
export default Home;