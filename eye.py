import cv2
import mediapipe as mp
import pyautogui
import numpy as np
from fer import FER  # Free emotion detection library
from dotenv import load_dotenv
import os

# Load environment variables (if needed)
load_dotenv()

# Initialize Mediapipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(min_detection_confidence=0.5, min_tracking_confidence=0.5)

# Initialize FER for emotion detection
emotion_detector = FER(mtcnn=True)

# Webcam capture
cap = cv2.VideoCapture(0)

def detect_emotion(frame):
    """Detect emotion using FER."""
    emotion, score = emotion_detector.top_emotion(frame)
    return emotion if emotion else "Unknown"

def process_landmarks(image, landmarks):
    """Process face mesh landmarks and calculate mean coordinates."""
    h, w, _ = image.shape
    x_coords = []
    y_coords = []
    for lm in landmarks:
        x_coords.append(int(lm.x * w))
        y_coords.append(int(lm.y * h))
    return np.mean(x_coords), np.mean(y_coords)

left_click_flag = False

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)
    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_mesh.process(rgb_frame)

    if results.multi_face_landmarks:
        for face_landmarks in results.multi_face_landmarks:
            left_eye_x, left_eye_y = process_landmarks(frame, face_landmarks.landmark[33:133])
            right_eye_x, right_eye_y = process_landmarks(frame, face_landmarks.landmark[362:463])
            avg_x = (left_eye_x + right_eye_x) / 2
            avg_y = (left_eye_y + right_eye_y) / 2

            # Mouse movement
            screen_width, screen_height = pyautogui.size()
            mouse_x = int(avg_x * screen_width / frame.shape[1])
            mouse_y = int(avg_y * screen_height / frame.shape[0])
            pyautogui.moveTo(mouse_x, mouse_y)

            # Blinking Detection (Simplified Logic)
            blink = face_landmarks.landmark[159].y - face_landmarks.landmark[145].y < 0.01
            if blink and not left_click_flag:
                pyautogui.click()
                left_click_flag = True
            elif not blink:
                left_click_flag = False

    # Emotion Detection
    detected_emotion = detect_emotion(frame)
    cv2.putText(frame, f"Emotion: {detected_emotion}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    # Show the frame
    cv2.imshow("Eye Tracking & Emotion Detection", frame)

    # Exit on pressing 'q'
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
