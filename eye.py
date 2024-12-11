import cv2
import dlib
import pyautogui
from scipy.spatial import distance as dist

# Initialize Dlib's face detector and facial landmarks predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor("shape_predictor_68_face_landmarks.dat")

# Eye aspect ratio (EAR) threshold for blinking
EAR_THRESHOLD = 0.2
CONSEC_FRAMES = 3
blink_counter = 0
left_click_flag = False

# Calculate Eye Aspect Ratio (EAR)
def calculate_ear(eye_points):
    A = dist.euclidean(eye_points[1], eye_points[5])  # Vertical distance
    B = dist.euclidean(eye_points[2], eye_points[4])  # Vertical distance
    C = dist.euclidean(eye_points[0], eye_points[3])  # Horizontal distance
    ear = (A + B) / (2.0 * C)
    return ear

# Extract eye region landmarks
def extract_eye_coordinates(landmarks, points):
    return [(landmarks.part(p).x, landmarks.part(p).y) for p in points]

# Define landmarks for eyes
LEFT_EYE_POINTS = [36, 37, 38, 39, 40, 41]
RIGHT_EYE_POINTS = [42, 43, 44, 45, 46, 47]

# Webcam setup
cap = cv2.VideoCapture(0)

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    frame = cv2.flip(frame, 1)  # Mirror image
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

    # Detect faces in the frame
    faces = detector(gray)
    for face in faces:
        landmarks = predictor(gray, face)

        # Extract left and right eye coordinates
        left_eye = extract_eye_coordinates(landmarks, LEFT_EYE_POINTS)
        right_eye = extract_eye_coordinates(landmarks, RIGHT_EYE_POINTS)

        # Draw crosshairs
        for (x, y) in left_eye:
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)
        for (x, y) in right_eye:
            cv2.circle(frame, (x, y), 2, (0, 255, 0), -1)

        # Calculate eye centers
        left_eye_center = (int(sum([x for (x, _) in left_eye]) / 6),
                           int(sum([y for (_, y) in left_eye]) / 6))
        right_eye_center = (int(sum([x for (x, _) in right_eye]) / 6),
                            int(sum([y for (_, y) in right_eye]) / 6))

        # Draw eye centers
        cv2.circle(frame, left_eye_center, 5, (255, 0, 0), -1)
        cv2.circle(frame, right_eye_center, 5, (255, 0, 0), -1)

        # Move mouse based on average eye center
        avg_x = int((left_eye_center[0] + right_eye_center[0]) / 2)
        avg_y = int((left_eye_center[1] + right_eye_center[1]) / 2)
        screen_width, screen_height = pyautogui.size()
        mouse_x = int((avg_x / frame.shape[1]) * screen_width)
        mouse_y = int((avg_y / frame.shape[0]) * screen_height)
        pyautogui.moveTo(mouse_x, mouse_y)

        # Calculate EAR for blink detection
        left_ear = calculate_ear(left_eye)
        right_ear = calculate_ear(right_eye)
        avg_ear = (left_ear + right_ear) / 2.0

        if avg_ear < EAR_THRESHOLD:
            blink_counter += 1
        else:
            if blink_counter >= CONSEC_FRAMES and not left_click_flag:
                pyautogui.click()
                left_click_flag = True
            blink_counter = 0
            left_click_flag = False

    # Display the frame
    cv2.imshow("Eye Tracking with Dlib", frame)

    # Exit the loop when 'q' is pressed
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
