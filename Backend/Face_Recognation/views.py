# import http
# from rest_framework.decorators import api_view

# from rest_framework import status
# from rest_framework.views import APIView

# from rest_framework.response import Response

# from Face_Recognation.serializer import Register_Image_Serializer
# import face_recognition, os, base64,io
# import numpy as np
# from PIL import Image


# @api_view(['POST'])
# def Register_Image(request):
#     serializer = Register_Image_Serializer(data=request.data)

#     if serializer.is_valid(raise_exception=True):
#         _, image_data = request.data['image'].split(',')
#         image_filename = f"{request.data['student_Id']}.png"  # You can set your desired filename
#         image_path = os.path.join("/home/sahil/Student-Record-Management-System/Backend/Face_Recognation/media_image",
#                                   image_filename)

#         print(image_path)
#         # Decode and save the image
#         with open(image_path, "wb") as f:
#             f.write(base64.b64decode(image_data))

#         # Load the image using face_recognition library
#         image = face_recognition.load_image_file(image_path)

#         face_locations = face_recognition.face_locations(image)
#         print(face_locations)

#         print(face_locations)
#         if len(face_locations) != 1:
#             # Handle the case when no face or multiple faces are detected
#             return Response({"error": "Invalid number of faces detected."}, status=status.HTTP_400_BAD_REQUEST)

#         face_encoding = face_recognition.face_encodings(image, face_locations)[0]
#         print(face_encoding)
#         save_folder = "./encoding_folder"
#         if not os.path.exists(save_folder):
#             os.makedirs(save_folder)

#         encoding_filename = f"{request.data['student_Id']}.npy"
#         encoding_path = os.path.join(save_folder, encoding_filename)

#         # Save the facial encoding to a file using numpy
#         np.save(encoding_path, face_encoding)

#         serializer.save()
#         return Response({"success"}, status=status.HTTP_201_CREATED)


#     return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)



# @api_view(['POST'])
# def image_verification(request):

#     # Loading the verification image encoding from the .npy file
#     verification_images_save_folder = "./encoding_folder"
#     verification_img_encoding_filename = f"{request.data['student_Id']}.npy"
#     verification_img_encoding_path = os.path.join(verification_images_save_folder, verification_img_encoding_filename)

#     if os.path.exists(verification_img_encoding_path):
#         verification_img_encoding = np.load(verification_img_encoding_path)
        
#         print("Shape of loaded image encoding:", verification_img_encoding.shape)
        
#     else:
#         print("File not found:", verification_img_encoding_path)


#     #generating the captured image encoding 
#     _, captured_image_data = request.data['image'].split(',')

#     captured_decoded_image = base64.b64decode(captured_image_data)

#     captured_image = Image.open(io.BytesIO(captured_decoded_image))
#     captured_image = captured_image.convert("RGB")
#     captured_face_locations = face_recognition.face_locations(np.array(captured_image))

#     if len(captured_face_locations) != 1:
#         return Response({"message": "Multiple Face detected."},
#                         status=status.HTTP_200_OK)
#     else:
#         captured_img_encoding = face_recognition.face_encodings(np.array(captured_image), captured_face_locations)[0]


#     #comparing the encodings
        
#     # Compare the face encodings
#     results = face_recognition.compare_faces([verification_img_encoding], captured_img_encoding)

#     # Check the results
#     if results[0]:
#         print("There is a match")
#         return Response({"message":"success"},
#                         status=status.HTTP_200_OK)
#     else:
#          print("This was not a match")
#          return Response({"message":"failure"},
#                         status=status.HTTP_200_OK)     
# 
# 
# 
# 

from numpy.linalg import norm
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.response import Response
from Face_Recognation.serializer import Register_Image_Serializer
import os, base64, io
import numpy as np
from PIL import Image, ImageDraw
from keras_facenet import FaceNet
from mtcnn import MTCNN

# Initialize the FaceNet model and MTCNN for face detection
facenet_model = FaceNet()
detector = MTCNN()

@api_view(['POST'])
def Register_Image(request):
    serializer = Register_Image_Serializer(data=request.data)

    if serializer.is_valid(raise_exception=True):
        _, image_data = request.data['image'].split(',')
        image_filename = f"{request.data['student_Id']}.png"  # You can set your desired filename
        image_path = os.path.join("/home/sahil/Student-Record-Management-System/Backend/Face_Recognation/media_image", image_filename)

        print(image_path)
        # Decode and save the image
        with open(image_path, "wb") as f:
            f.write(base64.b64decode(image_data))

        # Load the image and detect the face using MTCNN
        image = Image.open(image_path)
        image = image.convert("RGB")
        image_np = np.array(image)
        face_detections = detector.detect_faces(image_np)

        if len(face_detections) != 1:
            # Handle the case when no face or multiple faces are detected
            return Response({"error": "Invalid number of faces detected."}, status=status.HTTP_400_BAD_REQUEST)

        # Draw bounding boxes on the image
        for detection in face_detections:
            x, y, width, height = detection['box']
            image_with_box = Image.fromarray(image_np)
            draw = ImageDraw.Draw(image_with_box)
            draw.rectangle([x, y, x + width, y + height], outline="red", width=3)

        # Save the image with bounding boxes (optional)
        image_with_box.save(image_path)

        # Crop the face region
        x, y, width, height = face_detections[0]['box']
        face_image = image_np[y:y+height, x:x+width]

        # Generate face embeddings using FaceNet
        face_encoding = facenet_model.embeddings([face_image])[0]
        print(face_encoding)

        # Save the encoding as a .npy file
        save_folder = "./encoding_folder"
        if not os.path.exists(save_folder):
            os.makedirs(save_folder)

        encoding_filename = f"{request.data['student_Id']}.npy"
        encoding_path = os.path.join(save_folder, encoding_filename)

        np.save(encoding_path, face_encoding)

        serializer.save()
        return Response({"success": "Image registered successfully", "box_coordinates": face_detections[0]['box']}, status=status.HTTP_201_CREATED)

    return Response(serializer.data, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def image_verification(request):
    # Loading the verification image encoding from the .npy file
    verification_images_save_folder = "./encoding_folder"
    verification_img_encoding_filename = f"{request.data['student_Id']}.npy"
    verification_img_encoding_path = os.path.join(verification_images_save_folder, verification_img_encoding_filename)

    if os.path.exists(verification_img_encoding_path):
        verification_img_encoding = np.load(verification_img_encoding_path)
        print("Shape of loaded image encoding:", verification_img_encoding.shape)
    else:
        return Response({"message": "File not found."}, status=status.HTTP_404_NOT_FOUND)

    # Decode the captured image
    _, captured_image_data = request.data['image'].split(',')
    captured_decoded_image = base64.b64decode(captured_image_data)
    captured_image = Image.open(io.BytesIO(captured_decoded_image))
    captured_image = captured_image.convert("RGB")
    captured_image_np = np.array(captured_image)

    # Detect face in the captured image
    captured_face_detections = detector.detect_faces(captured_image_np)

    if len(captured_face_detections) != 1:
        return Response({"message": "Multiple or no faces detected."}, status=status.HTTP_400_BAD_REQUEST)

    # Draw bounding boxes on the captured image
    for detection in captured_face_detections:
        x, y, width, height = detection['box']
        image_with_box = Image.fromarray(captured_image_np)
        draw = ImageDraw.Draw(image_with_box)
        draw.rectangle([x, y, x + width, y + height], outline="blue", width=3)

    # Crop the face region
    x, y, width, height = captured_face_detections[0]['box']
    captured_face_image = captured_image_np[y:y+height, x:x+width]

    # Generate face encoding for the captured image
    captured_img_encoding = facenet_model.embeddings([captured_face_image])[0]

    # Compute Euclidean distance between embeddings
    distance = norm(verification_img_encoding - captured_img_encoding)

    # Set a threshold for face similarity (adjust this based on experimentation)
    threshold = 0.7  # Adjust this value based on your experiments
    print(distance)
    if distance < threshold:
        return Response({"message": "success", "box_coordinates": captured_face_detections[0]['box']}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "failure", "box_coordinates": captured_face_detections[0]['box']}, status=status.HTTP_200_OK)
