# Student Record Management System 

Under the guidance of esteemed institute professor Dr. Sharad Sinha, our team of four students at IIT Goa developed this project. Our project was designed with the primary objective of developing an efficient student record management system. This system aimed to alleviate the burden on teachers by automating the process of tracking student attendance. Furthermore, we integrated modern technologies, specifically artificial intelligence, to mitigate instances of proxy attendance, ensuring a more accurate and reliable record-keeping process.

## Tech-Stack
Our web app consisted of three components, mainly the front end, the back end, and our database. After careful consideration keeping in mind the efficient working of the end-product and taking complete advantage of the capabilities of the team members. The following tech-stack structure was used. 

- Frontend Development: ReactJS was employed to create the frontend, ensuring a dynamic and responsive user interface.
- Backend Development: The project's backend functionalities were developed using Django Rest Framework, providing robustness and flexibility in handling data and requests.
- Database Management: MySQL served as the chosen database for storing project-related data, offering reliability and scalability for data management.
- Face Recognition Model: Initially, our team constructed a Face Recognition model utilizing Python (which was later scraped due to hardware constraints). The implementation involved leveraging sophisticated libraries like TensorFlow and Keras.

## What's so special about us?

While offering a reliable attendance system and enhancing traditional student record management with modern technologies, we've incorporated additional functionalities to elevate user experience and simplify record maintenance for teachers:-

- Our two-pronged security system utilizes technologies like face recognition and geolocation to prevent proxy attendance marking.
- Given the fluctuating bandwidth of the WiFi networks, addressing technical glitches is crucial. As a result, we've granted special privileges to teachers to manually edit the attendance list.
- To prevent data redundancy and unintended record manipulation, we've incorporated special alerts to deter any illicit actions that could result in data tampering.


## Team Details and their Contributions

1. Shobhit Chauhan
    
Shobhit Chauhan demonstrated a high proficiency in React JS, leading the implementation of the entire frontend structure of the web applications. With prior experience in developing other websites, he leveraged his comprehensive knowledge to significantly enhance the user experience and streamline website navigation. His expertise was instrumental in creating a frontend that was not only easy to navigate but also aesthetically appealing.

Furthermore, he skillfully managed the integration of backend API calls, ensuring efficient handling of responses with minimal latency. During the initial stages of the project, he introduced the concept of geofencing to mitigate proxy-related issues. This concept evolved into the geolocation functionality, which was eventually incorporated into the project, contributing significantly to its functionality and security.

1. Aayush Yadav
   
Aayush Yadav demonstrated exceptional skills in data structures and algorithms, offering a comprehensive understanding of diverse algorithms applicable to enhancing geolocation functionality. Under his guidance, the complete geolocation functionality was implemented. Leveraging his understanding of the field, he abstracted the entire functionality from the user, ensuring seamless website navigation without the need to delve into its complexities.

Moreover, Aayush possessed knowledge of React JS, allowing him to assist Shobhit Chauhan significantly. He made substantial contributions to developing various frontend components, thus enhancing the overall user experience.

1. Rohan Manro
   
Rohan Manro's prior experience in Machine Learning spurred the concept of a Face Recognition model which was later integrated into the web application, elevating security measures and ensuring a reliable record-keeping system void of proxy risks. Employing Tensorflow and Keras, he adeptly crafted the Siamese Neural Network to implement this idea. However, the scarcity of requisite hardware led to the inevitable decision of scrapping the model he had meticulously constructed. Eventually, he and Aryan Goel decided to scrap this model and eventually used the Face Recognition library of Python.

Concurrently, Rohan utilized his knowledge Django to establish the foundational structure for MySQL database storage, which was later refined by Shobhit Chauhan. He orchestrated the framework for data storage and retrieval, paving the way for subsequent stages of development. Rohan integrated the Geolocation functionality which Aayush Yadav implemented, and with help of Aayush successfully abstracted its functioning to provide a better user experience.

Transitioning into the project's final phase, he took on the baton from Aryan Goel, completing the integration of React JS and Django functionalities. Rohan extended the frontend with key components and harmonized backend logic to align seamlessly with project requisites.Additionally, Rohan's adeptness in team management, honed through prior engagements in Student Clubs, facilitated oversight of both frontend and backend component development. His strategic planning effectively regulated data flow throughout the website, enhancing the project's overall coherence.

1.Aryan Goel

Aryan Goel demonstrated advanced proficiency with backend frameworks such as Django Rest Framework and possessed practical experience in Machine Learning. Initially, he collaborated with Rohan Manro in developing the Face Recognition module. When confronted with hardware limitations, Aryan's innovative idea and research facilitated the transition to Python’s Face Recognition module.

Aryan subsequently adapted the initial backend logic, initially devised for integrating the face recognition model into the web application, to accommodate changes in the Tech-Stack and user authentication functionality. As the work on the Face Recognition model progressed, he employed his Django Rest Framework expertise to implement APIs. His comprehensive understanding of API functionality led him to refine API call responses, leveraging data retrieval functions developed by Rohan Manro. Additionally, he assisted Shobhit Chauhan in integrating these API calls into the frontend logic.

During the project's final phases, Aryan began integrating the remaining frontend and backend functionalities. However, he encountered a series of errors resulting from modifications in the Face Recognition model and the intricacies introduced into the frontend logic to enhance the overall efficiency of the web application. Aryan, alongside Umar Sayed, aided Rohan Manro to successfully resolve these errors, marking the project's completion.

1. Umar Sayed (Special Contributor)
   
Umar Sayed joined the project during its concluding phase, prompted by unexpected bugs encountered by Aryan Goel and Rohan Manro during the integration of frontend and backend functionalities. Umar brought in a comprehensive understanding of React JS and Django, and implemented crucial modifications to the backend logic. This included integrating Foreign keys into the database model to rectify errors associated with the Response structure during API calls from the Frontend. His perspective and in-depth insights significantly enhanced the team's understanding, leading to improved efficiency and reliability within the web application.



