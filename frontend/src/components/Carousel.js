import React from 'react';
import iitGoaHostelImage from './static/iitgoa_hostel.png';



const Carousel = () => {

    return(
        <>

            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossOrigin="anonymous"/>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossOrigin="anonymous"></script>

                <div id="carouselExampleCaptions" class="carousel slide">

                    <div class="carousel-inner">
                        <div class="carousel-item active">
                        <img src={iitGoaHostelImage} class="d-block w-100" alt="..."/>
                            <div class="carousel-caption d-none d-md-block">
                                <h5 style={{ fontSize: '30px', color: '#FFFFFF' }}>IIT Goa</h5>
                                <p style={{ fontSize: '24px', color: '#FFFFFF' }}>Student Record Management System</p>

                            </div>
                        </div>
                    </div>

                </div>        
        </>
    );

}

export default Carousel;