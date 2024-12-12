
# Eye Tracking Mouse Control

This project demonstrates how to use a webcam to track eye movement and control the mouse pointer on a macOS system. 
The mouse pointer moves according to the detected eye position, and blinking triggers a left-click.

## Features
- **Eye Tracking**: Tracks eye movement using the Dlib library.
- **Mouse Control**: Maps eye coordinates to mouse movement using PyAutoGUI.
- **Blink Detection**: Detects blinking to simulate a left-click.

## Prerequisites
- macOS or a compatible operating system.
- Python 3.9 or later.
- Webcam for real-time tracking.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Rohantech231/Final-Year-Project.git
   cd Final-Year-Project
   ```

2. Install required Python libraries:
   ```bash
   pip install -r requirements.txt
   ```

3. Download the Dlib facial landmarks model:
   - Download the file [shape_predictor_68_face_landmarks.dat](http://dlib.net/files/shape_predictor_68_face_landmarks.dat.bz2).
   - Extract the file and place it in the project directory.

4. (Optional) Install additional dependencies for macOS:
   ```bash
   pip install pyobjc-core
   ```

5. Grant necessary permissions on macOS:
   - Go to **System Preferences** > **Security & Privacy** > **Privacy**.
   - Allow **Terminal** or your IDE under **Accessibility**, **Camera**, and **Screen Recording**.

## Usage

1. Run the script:
   ```bash
   python3 eye.py
   ```

2. The webcam feed will open, and you will see real-time eye tracking.
   - Move your eyes to move the mouse pointer.
   - Blink to perform a left-click.

3. Press `q` to quit the application.

## Troubleshooting

- **Mouse Pointer Not Moving**:
  - Ensure that accessibility permissions are granted.
  - Test a simple PyAutoGUI script to verify mouse control.

- **Webcam Feed Lagging**:
  - Reduce the video frame size in the script for better performance.

- **Blink Detection Not Working**:
  - Ensure that the `EAR_THRESHOLD` and `CONSEC_FRAMES` parameters are properly calibrated.

## File Structure

```
eye-tracking-mouse-control/
├── eye.py                     # Main script for eye tracking and mouse control
├── requirements.txt           # List of required Python libraries
├── shape_predictor_68_face_landmarks.dat  # Facial landmarks model (download manually)
```

## Requirements

The required Python libraries are listed in `requirements.txt`:

```text
opencv-python
dlib
pyautogui
scipy
pyobjc-core  # macOS specific
```

Install them using:

```bash
pip install -r requirements.txt
```

## License

This project is licensed under the MIT License. Feel free to modify and use it for your personal or educational purposes.

---

**Author**: [Aditya](@AdityaSeth777) and [Rohan](@Rohantech231)