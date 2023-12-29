import http
from rest_framework.decorators import api_view

from rest_framework import status
from rest_framework.views import APIView

from rest_framework.response import Response

from Face_Recognation.serializer import Register_Image_Serializer
import face_recognition, os, base64,io
import numpy as np
from PIL import Image


@api_view(['POST'])
def Register_Image(request):
    serializer = Register_Image_Serializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        _, image_data = request.data['image'].split(',')
        image_filename = f"{request.data['student_Id']}.png"  # You can set your desired filename
        image_path = os.path.join("/home/rooky/Documents/Coding/Projects/Attendance_System/Backend/Face_Recognation/media_image",
                                  image_filename)

        print(image_path)
        # Decode and save the image
        with open(image_path, "wb") as f:
            f.write(base64.b64decode(image_data))

        # Load the image using face_recognition library
        image = face_recognition.load_image_file(image_path)

        face_locations = face_recognition.face_locations(image)
        print(face_locations)

        print(face_locations)
        if len(face_locations) != 1:
            # Handle the case when no face or multiple faces are detected
            return Response({"error": "Invalid number of faces detected."}, status=status.HTTP_400_BAD_REQUEST)

        face_encoding = face_recognition.face_encodings(image, face_locations)[0]
        print(face_encoding)
        save_folder = ".\encoding_folder"
        if not os.path.exists(save_folder):
            os.makedirs(save_folder)

        encoding_filename = f"{request.data['student_Id']}.npy"
        encoding_path = os.path.join(save_folder, encoding_filename)

        # Save the facial encoding to a file using numpy
        np.save(encoding_path, face_encoding)

        serializer.save()
        return Response({"success"}, status=status.HTTP_201_CREATED)


    return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)



@api_view(['POST'])
def image_verification(request):

    # Loading the verification image encoding from the .npy file
    verification_images_save_folder = ".\encoding_folder"
    verification_img_encoding_filename = f"{request.data['student_Id']}.npy"
    verification_img_encoding_path = os.path.join(verification_images_save_folder, verification_img_encoding_filename)

    if os.path.exists(verification_img_encoding_path):
        verification_img_encoding = np.load(verification_img_encoding_path)
        
        print("Shape of loaded image encoding:", verification_img_encoding.shape)
        
    else:
        print("File not found:", verification_img_encoding_path)


    #generating the captured image encoding 
    _, captured_image_data = request.data['image'].split(',')

    captured_decoded_image = base64.b64decode(captured_image_data)

    captured_image = Image.open(io.BytesIO(captured_decoded_image))
    captured_image = captured_image.convert("RGB")
    captured_face_locations = face_recognition.face_locations(np.array(captured_image))

    if len(captured_face_locations) != 1:
        return Response({"message": "Multiple Face detected."},
                        status=status.HTTP_200_OK)
    else:
        captured_img_encoding = face_recognition.face_encodings(np.array(captured_image), captured_face_locations)[0]


    #comparing the encodings
        
    # Compare the face encodings
    results = face_recognition.compare_faces([verification_img_encoding], captured_img_encoding)

    # Check the results
    if results[0]:
        print("There is a match")
        return Response({"message":"success"},
                        status=status.HTTP_200_OK)
    else:
         print("This was not a match")
         return Response({"message":"failure"},
                        status=status.HTTP_200_OK)       