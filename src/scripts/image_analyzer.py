import cv2
import numpy as np
import matplotlib.pyplot as plt
import os
import glob
from pathlib import Path

def get_available_images(images_dir="../../public/images"):
    """
    Get a list of available image files in the specified directory.
    
    Args:
        images_dir: Directory to search for images
    
    Returns:
        List of image file paths
    """
    # Supported image formats
    image_extensions = ['*.jpg', '*.jpeg', '*.png', '*.bmp', '*.tiff', '*.tif']
    image_files = []
    
    for ext in image_extensions:
        image_files.extend(glob.glob(os.path.join(images_dir, ext)))
        image_files.extend(glob.glob(os.path.join(images_dir, ext.upper())))
    
    return sorted(image_files)

def analyze_image_width(
    image_path, 
    num_measurements=100, 
    max_width_value=30,
    threshold_value=127
):
    """
    Analyze an image silhouette and return width measurements at regular intervals.
    
    Args:
        image_path: Path to the image
        num_measurements: Number of width measurements to take (default 100)
        max_width_value: Maximum value to scale the measurements to (default 30)
        threshold_value: Threshold for binary conversion (default 127)
    
    Returns:
        List of width values scaled to the specified range
    """
    
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image from {image_path}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Create binary image (assuming dark objects on light background)
    _, binary = cv2.threshold(gray, threshold_value, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours to isolate the main object
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        raise ValueError("No objects found in the image. Try adjusting the threshold value.")
    
    # Find the largest contour (should be the main object)
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Get bounding rectangle
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Create a mask for just the main object
    mask = np.zeros(binary.shape, dtype=np.uint8)
    cv2.fillPoly(mask, [largest_contour], 255)
    
    # Extract the object region
    object_region = mask[y:y+h, x:x+w]
    
    # Measure width at regular intervals from top to bottom
    widths = []
    for i in range(num_measurements):
        # Calculate the row position
        row_position = int((i / (num_measurements - 1)) * (h - 1))
        
        # Get the row of pixels
        row = object_region[row_position, :]
        
        # Find the leftmost and rightmost white pixels (the object)
        white_pixels = np.where(row == 255)[0]
        
        if len(white_pixels) > 0:
            width_pixels = white_pixels[-1] - white_pixels[0] + 1
        else:
            width_pixels = 0
        
        widths.append(width_pixels)
    
    # Find the maximum width for scaling
    max_width_pixels = max(widths) if widths else 1
    
    # Scale the widths to the desired range (1 to max_width_value)
    scaled_widths = []
    for width in widths:
        if width == 0:
            scaled_width = 1  # Minimum value
        else:
            # Scale to range 1 to max_width_value
            scaled_width = int(1 + (width / max_width_pixels) * (max_width_value - 1))
        scaled_widths.append(scaled_width)
    
    return scaled_widths, widths, object_region, (x, y, w, h)

def visualize_measurements(scaled_widths, raw_widths, object_region, image_name, num_measurements, max_width_value):
    """
    Visualize the measurements and the analyzed object with proper scaling.
    """
    # Calculate aspect ratio based on measurements and max value
    # This gives us the same proportions as the actual sorting visualization
    aspect_ratio = num_measurements / max_width_value
    
    # Set figure size based on aspect ratio
    # Base width of 15 inches, height calculated to maintain aspect ratio
    fig_width = 15
    fig_height = fig_width / aspect_ratio
    
    # Ensure minimum and maximum reasonable heights
    fig_height = max(5, min(fig_height, 20))
    
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(fig_width, fig_height))
    
    # Show the extracted object region
    ax1.imshow(object_region, cmap='gray')
    ax1.set_title(f'Extracted {image_name}')
    ax1.axis('off')
    
    # Plot raw pixel widths
    ax2.plot(raw_widths)
    ax2.set_title('Raw Width Measurements (pixels)')
    ax2.set_xlabel('Position (top to bottom)')
    ax2.set_ylabel('Width (pixels)')
    ax2.grid(True)
    
    # Plot scaled widths with proper aspect ratio
    ax3.plot(scaled_widths)
    ax3.set_title(f'Scaled Width Measurements (1-{max_width_value})')
    ax3.set_xlabel('Position (top to bottom)')
    ax3.set_ylabel('Width (scaled)')
    ax3.grid(True)
    
    # Set proper aspect ratio for the scaled plot to match actual proportions
    ax3.set_aspect(aspect_ratio)
    
    # Add aspect ratio info to the title
    ax3.set_title(f'Scaled Width Measurements (1-{max_width_value})\nAspect Ratio: {aspect_ratio:.2f}:1')
    
    plt.tight_layout()
    plt.show()

def display_image_selection(images):
    """
    Display available images for selection.
    """
    print("\n" + "="*60)
    print("AVAILABLE IMAGES")
    print("="*60)
    
    if not images:
        print("No image files found in the current directory!")
        print("Please add some images (.jpg, .png, .bmp, etc.) to the current folder.")
        return None
    
    for i, image_path in enumerate(images, 1):
        image_name = os.path.basename(image_path)
        print(f"{i:2d}. {image_name}")
    
    print("="*60)
    return images

def get_user_input():
    """
    Get user input for image selection and parameters.
    """
    print("\n🎨 GENERAL IMAGE ANALYZER")
    print("This tool analyzes the width profile of any image silhouette!")
    print("Perfect for analyzing buildings, objects, or any vertical structures.\n")
    
    # Get available images
    images = get_available_images()
    available_images = display_image_selection(images)
    
    if not available_images:
        return None, None, None, None
    
    # Image selection
    while True:
        try:
            choice = input(f"\nSelect an image (1-{len(available_images)}): ").strip()
            image_index = int(choice) - 1
            
            if 0 <= image_index < len(available_images):
                selected_image = available_images[image_index]
                break
            else:
                print(f"Please enter a number between 1 and {len(available_images)}")
        except ValueError:
            print("Please enter a valid number")
    
    # Get number of measurements
    while True:
        try:
            num_measurements = input("\nNumber of measurements (default 100): ").strip()
            if num_measurements == "":
                num_measurements = 100
            else:
                num_measurements = int(num_measurements)
            
            if num_measurements > 0:
                break
            else:
                print("Please enter a positive number")
        except ValueError:
            print("Please enter a valid number")
    
    # Get maximum width value
    while True:
        try:
            max_width = input("Maximum width value (default 30): ").strip()
            if max_width == "":
                max_width = 30
            else:
                max_width = int(max_width)
            
            if max_width > 0:
                break
            else:
                print("Please enter a positive number")
        except ValueError:
            print("Please enter a valid number")
    
    # Get threshold value (optional)
    while True:
        try:
            threshold = input("Threshold value for binary conversion (default 127, range 0-255): ").strip()
            if threshold == "":
                threshold = 127
            else:
                threshold = int(threshold)
            
            if 0 <= threshold <= 255:
                break
            else:
                print("Please enter a number between 0 and 255")
        except ValueError:
            print("Please enter a valid number")
    
    return selected_image, num_measurements, max_width, threshold

def main():
    """
    Main function with interactive user interface.
    """
    try:
        # Get user input
        image_path, num_measurements, max_width_value, threshold_value = get_user_input()
        
        if image_path is None:
            return
        
        # Get image name for display
        image_name = os.path.basename(image_path)
        
        print(f"\n🔍 Analyzing: {image_name}")
        print(f"📊 Measurements: {num_measurements}")
        print(f"📏 Max width value: {max_width_value}")
        print(f"⚙️  Threshold: {threshold_value}")
        print("\nProcessing...")
        
        # Analyze the image
        scaled_widths, raw_widths, object_region, bbox = analyze_image_width(
            image_path, 
            num_measurements=num_measurements, 
            max_width_value=max_width_value,
            threshold_value=threshold_value
        )
        
        # Print the array in JavaScript format
        print("\n" + "="*60)
        print("JAVASCRIPT ARRAY (copy this to your React component)")
        print("="*60)
        print(f"const {Path(image_name).stem}Profile = [" + ", ".join(map(str, scaled_widths)) + "];")
        
        # Also provide the reversed array
        reversed_widths = scaled_widths[::-1]
        print(f"\nconst {Path(image_name).stem}ProfileReversed = [" + ", ".join(map(str, reversed_widths)) + "];")
        
        # Show statistics
        print("\n" + "="*60)
        print("STATISTICS")
        print("="*60)
        print(f"Array length: {len(scaled_widths)}")
        print(f"Min width: {min(scaled_widths)}")
        print(f"Max width: {max(scaled_widths)}")
        print(f"Base width (index 0): {scaled_widths[0]}")
        print(f"Top width (index {len(scaled_widths)-1}): {scaled_widths[-1]}")
        print(f"Object bounding box: x={bbox[0]}, y={bbox[1]}, w={bbox[2]}, h={bbox[3]}")
        
        # Ask if user wants to visualize
        visualize = input("\nShow visualization? (y/n, default y): ").strip().lower()
        if visualize != 'n':
            visualize_measurements(scaled_widths, raw_widths, object_region, image_name, num_measurements, max_width_value)
            print("\n" + "="*60)
            print("📊 VISUALIZATION INSTRUCTIONS")
            print("="*60)
            print("The plot window has opened showing your analysis results.")
            print("📋 Close the plot window to continue and end the script.")
            print("="*60)
        
        print(f"\n✅ Analysis complete! You can now use the {Path(image_name).stem}Profile arrays in your sorting visualizations.")
        print(f"📝 Two arrays were generated:")
        print(f"   - {Path(image_name).stem}Profile: Original orientation")
        print(f"   - {Path(image_name).stem}ProfileReversed: Upside-down orientation")
        
        return scaled_widths, reversed_widths
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        print("\nTroubleshooting tips:")
        print("- Make sure the image file exists and is not corrupted")
        print("- Try adjusting the threshold value (0-255)")
        print("- Ensure the image has a clear silhouette with good contrast")
        print("- Make sure you have the required libraries installed:")
        print("  pip install opencv-python matplotlib numpy")

if __name__ == "__main__":
    main() 