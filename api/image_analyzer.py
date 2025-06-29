from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import cv2
import numpy as np
import os
import uuid
from werkzeug.utils import secure_filename
from pathlib import Path
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
UPLOAD_FOLDER = '../public/generated-images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'tif', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def analyze_image_width(
    image_path, 
    num_measurements=100, 
    max_width_value=30,
    threshold_value=127
):
    """
    Analyze an image silhouette and return width measurements at regular intervals.
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
    
    return scaled_widths, widths, (x, y, w, h)

def generate_analysis_graphs(scaled_widths, raw_widths, bbox, filename, upload_folder):
    """
    Generate individual analysis graphs and save them to the upload folder.
    """
    # Create individual graphs
    graphs = {}
    
    # Graph 1: Scaled width profile
    plt.figure(figsize=(6, 4))
    plt.plot(scaled_widths, range(len(scaled_widths)), 'b-', linewidth=2)
    plt.title('Scaled Width Profile')
    plt.xlabel('Width Value')
    plt.ylabel('Height Position')
    plt.grid(True, alpha=0.3)
    scaled_filename = f"scaled_{Path(filename).stem}.png"
    scaled_path = os.path.join(upload_folder, scaled_filename)
    plt.tight_layout()
    plt.savefig(scaled_path, dpi=150, bbox_inches='tight')
    plt.close()
    graphs['scaled'] = scaled_filename
    
    # Graph 2: Raw width profile
    plt.figure(figsize=(6, 4))
    plt.plot(raw_widths, range(len(raw_widths)), 'r-', linewidth=2)
    plt.title('Raw Width Profile (Pixels)')
    plt.xlabel('Width (Pixels)')
    plt.ylabel('Height Position')
    plt.grid(True, alpha=0.3)
    raw_filename = f"raw_{Path(filename).stem}.png"
    raw_path = os.path.join(upload_folder, raw_filename)
    plt.tight_layout()
    plt.savefig(raw_path, dpi=150, bbox_inches='tight')
    plt.close()
    graphs['raw'] = raw_filename
    
    # Graph 3: Width distribution histogram
    plt.figure(figsize=(6, 4))
    plt.hist(scaled_widths, bins=20, alpha=0.7, color='green', edgecolor='black')
    plt.title('Width Distribution')
    plt.xlabel('Width Value')
    plt.ylabel('Frequency')
    plt.grid(True, alpha=0.3)
    hist_filename = f"hist_{Path(filename).stem}.png"
    hist_path = os.path.join(upload_folder, hist_filename)
    plt.tight_layout()
    plt.savefig(hist_path, dpi=150, bbox_inches='tight')
    plt.close()
    graphs['histogram'] = hist_filename
    
    return graphs

@app.route('/analyze-image', methods=['POST'])
def analyze_image():
    """
    Analyze uploaded image and return width profile arrays.
    """
    try:
        # Check if file was uploaded
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'Invalid file type'}), 400
        
        # Get parameters from form data
        num_measurements = int(request.form.get('num_measurements', 100))
        max_width_value = int(request.form.get('max_width_value', 30))
        threshold_value = int(request.form.get('threshold_value', 127))
        
        # Validate parameters
        if num_measurements <= 0 or max_width_value <= 0 or not (0 <= threshold_value <= 255):
            return jsonify({'error': 'Invalid parameters'}), 400
        
        # Create unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        
        # Ensure upload directory exists
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        
        # Save uploaded file
        file.save(filepath)
        
        # Analyze the image
        scaled_widths, raw_widths, bbox = analyze_image_width(
            filepath,
            num_measurements=num_measurements,
            max_width_value=max_width_value,
            threshold_value=threshold_value
        )
        
        # Add bounding box visualization to the processed image
        img = cv2.imread(filepath)
        if img is not None:
            # Draw red dotted rectangle for bounding box
            x, y, w, h = bbox
            
            # Draw dotted/dashed rectangle by drawing individual line segments
            # Top line
            for i in range(0, w, 10):
                end_x = min(x + i + 5, x + w)
                cv2.line(img, (x + i, y), (end_x, y), (0, 0, 255), 2)
            
            # Bottom line
            for i in range(0, w, 10):
                end_x = min(x + i + 5, x + w)
                cv2.line(img, (x + i, y + h), (end_x, y + h), (0, 0, 255), 2)
            
            # Left line
            for i in range(0, h, 10):
                end_y = min(y + i + 5, y + h)
                cv2.line(img, (x, y + i), (x, end_y), (0, 0, 255), 2)
            
            # Right line
            for i in range(0, h, 10):
                end_y = min(y + i + 5, y + h)
                cv2.line(img, (x + w, y + i), (x + w, end_y), (0, 0, 255), 2)
            
            # Add "Bounding Box" text
            cv2.putText(img, "Bounding Box", (x + 5, y - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            
            # Save the processed image with bounding box
            cv2.imwrite(filepath, img)
        
        # Create reversed array
        reversed_widths = scaled_widths[::-1]
        
        # Prepare response
        response = {
            'success': True,
            'filename': unique_filename,
            'original': scaled_widths,
            'reversed': reversed_widths,
            'statistics': {
                'array_length': len(scaled_widths),
                'min_width': min(scaled_widths),
                'max_width': max(scaled_widths),
                'base_width': scaled_widths[0],
                'top_width': scaled_widths[-1],
                'bounding_box': {
                    'x': bbox[0],
                    'y': bbox[1],
                    'width': bbox[2],
                    'height': bbox[3]
                }
            }
        }
        
        # Generate analysis graphs
        graphs = generate_analysis_graphs(scaled_widths, raw_widths, bbox, unique_filename, app.config['UPLOAD_FOLDER'])
        response['graph_urls'] = graphs
        response['image_url'] = f"/generated-images/{unique_filename}"
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generated-images/<filename>')
def serve_generated_image(filename):
    """Serve generated images and graphs."""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({'status': 'healthy', 'message': 'Image analyzer API is running'})

if __name__ == '__main__':
    app.run(debug=True, port=5001) 