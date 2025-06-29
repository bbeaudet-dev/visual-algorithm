import cv2
import numpy as np
import matplotlib.pyplot as plt

def analyze_chess_piece_width(
    image_path, 
    num_measurements=100, 
    max_width_value=30
):
    
    """
    Analyze a chess piece silhouette and return width measurements at regular intervals.
    
    Args:
        image_path: Path to the chess piece image
        num_measurements: Number of width measurements to take (default 100)
        max_width_value: Maximum value to scale the measurements to (default 30)
    
    Returns:
        List of width values scaled to the specified range
    """
    
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not load image from {image_path}")
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Create binary image (assuming dark pieces on light background)
    # You might need to adjust the threshold value depending on your image
    _, binary = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY_INV)
    
    # Find contours to isolate the king piece
    contours, _ = cv2.findContours(binary, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    # Find the largest contour (should be the king)
    largest_contour = max(contours, key=cv2.contourArea)
    
    # Get bounding rectangle
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Create a mask for just the king piece
    mask = np.zeros(binary.shape, dtype=np.uint8)
    cv2.fillPoly(mask, [largest_contour], 255)
    
    # Extract the king region
    chess_piece_region = mask[y:y+h, x:x+w]
    
    # Measure width at regular intervals from top to bottom
    widths = []
    for i in range(num_measurements):
        # Calculate the row position
        row_position = int((i / (num_measurements - 1)) * (h - 1))
        
        # Get the row of pixels
        row = chess_piece_region[row_position, :]
        
        # Find the leftmost and rightmost white pixels (the piece)
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
    
    return scaled_widths, widths, chess_piece_region

def visualize_measurements(scaled_widths, raw_widths, chess_piece_region):
    """
    Visualize the measurements and the analyzed piece.
    """
    fig, (ax1, ax2, ax3) = plt.subplots(1, 3, figsize=(15, 5))
    
    # Show the extracted king region
    ax1.imshow(chess_piece_region, cmap='gray')
    ax1.set_title('Extracted King Piece')
    ax1.axis('off')
    
    # Plot raw pixel widths
    ax2.plot(raw_widths)
    ax2.set_title('Raw Width Measurements (pixels)')
    ax2.set_xlabel('Position (top to bottom)')
    ax2.set_ylabel('Width (pixels)')
    ax2.grid(True)
    
    # Plot scaled widths
    ax3.plot(scaled_widths)
    ax3.set_title('Scaled Width Measurements (1-30)')
    ax3.set_xlabel('Position (top to bottom)')
    ax3.set_ylabel('Width (scaled)')
    ax3.grid(True)
    
    plt.tight_layout()
    plt.show()

def main():
    # Path to your image to be analyzed
#     image_path = 'chess_king.jpg'
#     image_path = 'chess_queen.jpg'
    # image_path = 'chess_rook.jpg'
    # image_path = 'chess_knight.jpg'
    # image_path = 'chess_bishop.jpg'
    image_path = 'chess_pawn.jpg'
    
    try:
        # Analyze the chess king
        scaled_widths, raw_widths, chess_piece_region = analyze_chess_piece_width(
            image_path, 
            num_measurements=100, 
            max_width_value=30
        )
        
        # Print the array in the format you requested
        print("const chessPieceProfile = [" + ", ".join(map(str, scaled_widths)) + "];")
        
        # Show some statistics
        print(f"\nStatistics:")
        print(f"Array length: {len(scaled_widths)}")
        print(f"Min width: {min(scaled_widths)}")
        print(f"Max width: {max(scaled_widths)}")
        print(f"Base width (index 0): {scaled_widths[0]}")
        print(f"Top width (index {len(scaled_widths)-1}): {scaled_widths[-1]}")
        
        # Visualize the results
        visualize_measurements(scaled_widths, raw_widths, chess_piece_region)
        
    except Exception as e:
        print(f"Error: {e}")
        print("Make sure you have the required libraries installed:")
        print("pip install opencv-python matplotlib numpy")

if __name__ == "__main__":
    main()