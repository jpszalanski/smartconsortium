import cv2
import numpy as np
import sys

def extract_largest_icon(image_path, output_path):
    # Load image
    img = cv2.imread(image_path)
    if img is None:
        print(f"Error: Could not load image {image_path}")
        sys.exit(1)

    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Apply adaptive threshold to handle potential lighting variations or text
    # Or simpler: Canny edge detection
    edges = cv2.Canny(gray, 50, 150)
    
    # Find contours
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    largest_cnt = None
    max_area = 0
    
    for cnt in contours:
        x, y, w, h = cv2.boundingRect(cnt)
        aspect_ratio = float(w)/h
        area = w * h
        
        # Filter for squares (allow slight deviation)
        if 0.8 < aspect_ratio < 1.2 and area > 10000:
            if area > max_area:
                max_area = area
                largest_cnt = cnt
                
    if largest_cnt is not None:
        x, y, w, h = cv2.boundingRect(largest_cnt)
        # Crop
        crop = img[y:y+h, x:x+w]
        cv2.imwrite(output_path, crop)
        print(f"Successfully extracted icon: {w}x{h}")
    else:
        print("No suitable icon found.")
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python script.py <input_image> <output_image>")
        sys.exit(1)
        
    extract_largest_icon(sys.argv[1], sys.argv[2])
