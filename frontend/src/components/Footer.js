import React from 'react';



const Footer = () => {

    return(
        <>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"/>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>


            <footer class="text-center text-lg-start bg-body-tertiary text-muted">
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

                        <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                            <h6 class="text-uppercase fw-bold mb-4" style={{ marginTop: '20px', marginBottom:'15px'}}>
                                <i class="fas fa-gem me-3"></i>Developers
                            </h6>
                            <p><i class="fas fa-phone me-3"></i>Rohan Manro</p>
                            <p><i class="fas fa-phone me-3"></i>Aryan Goel</p>
                            <p><i class="fas fa-phone me-3"></i>Shobhit Chauhan</p>
                            <p><i class="fas fa-phone me-3"></i>Aayush Yadav</p>

                  
                        </div>

                        <div class="col-md-2 col-lg-2 col-xl-2 mx-auto mb-4">
                                <h6 class="text-uppercase fw-bold mb-4" style={{ marginTop: '20px', marginBottom:'15px'}}>
                                    <i class="fas fa-gem me-3"></i>Contributions
                                </h6>     
                                <p><i class="fas fa-phone me-3"></i>Umar Sayed</p>    

                                <h6 class="text-uppercase fw-bold mb-4" style={{ marginTop: '20px', marginBottom:'15px'}}>
                                    <i class="fas fa-gem me-3"></i>Advisor
                                </h6>     
                                <p><i class="fas fa-phone me-3"></i>Dr. Sharad Sinha</p>     
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

            </footer>

        </>
    );

}

export default Footer;