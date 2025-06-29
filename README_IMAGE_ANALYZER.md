# 🎨 Full-Stack Image Analyzer

Transform any image into sorting algorithm visualizations! Upload images of buildings, chess pieces, kitchen utensils, or any object and see them come to life as animated bars.

## 🚀 Quick Start

### 1. Install Dependencies

**Backend (Python API):**
```bash
cd api
pip install -r requirements.txt
```

**Frontend (React):**
```bash
npm install
```

### 2. Start the Backend API
```bash
cd api
python image_analyzer.py
```
The Flask API will run on `http://localhost:5000`

### 3. Start the Frontend
```bash
npm run dev
```
The React app will run on `http://localhost:3000`

### 4. Use the Image Analyzer
1. Go to the Bubble Sort page
2. Scroll down to the "🎨 Image Analyzer" section
3. Upload any image
4. Adjust parameters if needed
5. Click "Analyze Image"
6. Watch your image transform into animated bars!

## 📁 File Structure

```
├── api/
│   ├── image_analyzer.py    # Flask API server
│   └── requirements.txt     # Python dependencies
├── public/
│   ├── dev-images/         # Your personal images
│   └── generated-images/   # User-uploaded images
├── src/app/components/
│   └── BubbleSort.tsx      # React component with image upload
└── README_IMAGE_ANALYZER.md
```

## 🎯 Features

### **Image Upload**
- Drag & drop or file picker
- Supports JPG, PNG, BMP, TIFF, GIF
- Real-time file validation

### **Parameter Controls**
- **Measurements**: 10-200 (default: 100)
- **Max Width**: 5-50 (default: 30)
- **Threshold**: 0-255 (default: 127)

### **Instant Results**
- Generated arrays appear immediately on bars
- Automatic array length and max value updates
- Error handling with helpful messages

### **File Management**
- Uploaded images saved to `public/generated-images/`
- Unique filenames prevent conflicts
- Images accessible for future use

## 🔧 How It Works

### **Backend Process**
1. **Receive**: Image file + parameters via POST request
2. **Process**: Convert to grayscale → binary → extract contours
3. **Measure**: Calculate width at regular intervals
4. **Scale**: Normalize to specified range (1 to max_width)
5. **Return**: JSON with original and reversed arrays

### **Frontend Process**
1. **Upload**: User selects image file
2. **Configure**: Set analysis parameters
3. **Send**: POST request to Flask API
4. **Receive**: JSON response with arrays
5. **Display**: Update bars immediately with new data

## 🎨 Perfect For

- **Buildings**: Empire State Building, Space Needle, Eiffel Tower
- **Chess Pieces**: Kings, Queens, Rooks, Knights, Bishops, Pawns
- **Kitchen Utensils**: Spoons, forks, knives, spatulas
- **Tools**: Hammers, wrenches, screwdrivers
- **Objects**: Vases, bottles, sculptures, plants
- **Characters**: Cartoon characters, silhouettes
- **Anything** with an interesting width profile!

## ⚙️ Parameter Guide

### **Measurements (10-200)**
- **Lower values**: Fewer, chunkier bars
- **Higher values**: More, smoother bars
- **Recommendation**: 100 for most images

### **Max Width (5-50)**
- **Lower values**: Subtle height differences
- **Higher values**: Dramatic height variations
- **Recommendation**: 30 for balanced visuals

### **Threshold (0-255)**
- **Lower values (0-100)**: Light objects on dark backgrounds
- **Medium values (100-150)**: Good contrast images
- **Higher values (150-255)**: Dark objects on light backgrounds
- **Recommendation**: Start with 127, adjust based on results

## 🐛 Troubleshooting

### **"Failed to connect to analysis server"**
- Make sure Flask API is running on port 5000
- Check that `python image_analyzer.py` is running in the `api` folder

### **"No objects found in the image"**
- Try adjusting the threshold value
- Ensure image has good contrast between object and background
- Check that the main object is clearly visible

### **"Invalid file type"**
- Use supported formats: JPG, PNG, BMP, TIFF, GIF
- Check file extension is lowercase

### **Poor analysis results**
- Use images with clear silhouettes
- Ensure good contrast between object and background
- Try different threshold values
- Consider cropping image to focus on main object

## 🔮 Future Enhancements

- **Real-time Preview**: See extracted silhouette as you adjust parameters
- **Animation**: Step-by-step analysis visualization
- **Parameter Presets**: Save common settings for different image types
- **Batch Processing**: Upload multiple images at once
- **Database Storage**: Save images and arrays for user accounts
- **Export Options**: Download arrays as JSON/CSV

## 💡 Tips for Best Results

1. **Image Quality**: Use high-contrast images with clear silhouettes
2. **Object Focus**: Crop images to focus on the main object
3. **Background**: Simple backgrounds work best
4. **Orientation**: Vertical objects work best for width analysis
5. **Testing**: Try different parameter combinations to find the perfect settings

## 🎉 Have Fun!

This tool transforms any image into a unique sorting visualization. Experiment with different objects, parameters, and see what interesting patterns you can create!

---

**Note**: The Flask API needs to be running for the image analyzer to work. Make sure to start it before using the frontend. 