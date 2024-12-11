import cv2
import mediapipe as mp
import pyautogui
import numpy as np

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Webcam capture
cap = cv2.VideoCapture(0)

# State flag for left-click
left_click_flag = False

# Utility function to map coordinates to screen space
def map_coordinates(x, y, frame_shape, screen_size):
    frame_height, frame_width, _ = frame_shape
    screen_width, screen_height = screen_size
    mapped_x = int((x / frame_width) * screen_width)
    mapped_y = int((y / frame_height) * screen_height)
    return mapped_x, mapped_y

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    # Flip the frame for a mirror effect
    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            frame_height, frame_width, _ = frame.shape

            # Get key points for left and right eyes
            left_eye_coords = face_landmarks.landmark[33:133]
            right_eye_coords = face_landmarks.landmark[362:463]

            # Calculate the center of each eye
            left_eye_x = int(np.mean([p.x for p in left_eye_coords]) * frame_width)
            left_eye_y = int(np.mean([p.y for p in left_eye_coords]) * frame_height)
            right_eye_x = int(np.mean([p.x for p in right_eye_coords]) * frame_width)
            right_eye_y = int(np.mean([p.y for p in right_eye_coords]) * frame_height)

            # Draw crosshairs over the eyes
            cv2.circle(frame, (left_eye_x, left_eye_y), 5, (0, 255, 0), -1)
            cv2.circle(frame, (right_eye_x, right_eye_y), 5, (0, 255, 0), -1)

            # Calculate the average point between the eyes (for mouse movement)
            avg_x = (left_eye_x + right_eye_x) / 2
            avg_y = (left_eye_y + right_eye_y) / 2

            # Map eye coordinates to screen space
            screen_width, screen_height = pyautogui.size()
            mouse_x, mouse_y = map_coordinates(avg_x, avg_y, frame.shape, (screen_width, screen_height))
            pyautogui.moveTo(mouse_x, mouse_y)

            # Blink detection (difference between upper and lower eyelids)
            left_eye_blink = (
                face_landmarks.landmark[159].y - face_landmarks.landmark[145].y < 0.01
            )
            if left_eye_blink and not left_click_flag:
                pyautogui.click()
                left_click_flag = True
            elif not left_eye_blink:
                left_click_flag = False

    # Display the webcam feed
    cv2.imshow("Eye Tracking with Crosshairs", frame)

    # Exit the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
