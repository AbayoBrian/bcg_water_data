# Baringo Water Resource Mapping Dashboard

A modern, responsive web dashboard for visualizing and analyzing water resource projects across Baringo County, Kenya.

## 🌟 Features

### 📊 Interactive Visualizations
- **Project Type Distribution**: Doughnut chart showing distribution of water infrastructure types
- **Subcounty Analysis**: Bar chart displaying project counts by subcounty
- **Interactive Maps**: Leaflet-based maps with project markers and popups
- **Heatmap Visualization**: Density analysis of water projects across the county

### 📈 Key Statistics
- **1,121 Total Projects** across 7 subcounties
- **10 Project Types** including boreholes, water pans, and supply systems
- **Spatial Analysis** with cluster identification and buffer coverage
- **Real-time Data** from GeoJSON sources

### 🎨 Modern Design
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and scroll-triggered animations
- **Professional UI**: Bootstrap 5 with custom styling
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Quick Start

### Local Development
1. Clone or download the dashboard files
2. Navigate to the dashboard directory
3. Install dependencies (optional):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   # or
   npx serve .
   ```
5. Open `http://localhost:3000` in your browser

### Vercel Deployment
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```
2. Navigate to the dashboard directory
3. Deploy to Vercel:
   ```bash
   vercel
   ```
4. Follow the prompts to complete deployment

### Manual Vercel Deployment
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect and deploy the static site
4. Your dashboard will be available at `https://your-project.vercel.app`

## 📁 Project Structure

```
dashboard/
├── index.html          # Main dashboard page
├── styles.css          # Custom CSS styling
├── script.js           # JavaScript functionality
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel configuration
└── README.md          # This file
```

## 🗺️ Data Sources

The dashboard uses the following data files from the main project:
- `baringo_water_points.geojson` - Main project data with coordinates
- `baringo_water_clusters.geojson` - Cluster analysis results
- `baringo_water_buffers.geojson` - Buffer analysis data

## 📊 Dashboard Sections

### 1. Hero Section
- Project overview with key statistics
- Call-to-action buttons for exploration
- Animated stat cards

### 2. Overview Section
- Project type distribution chart
- Subcounty-wise project analysis
- Interactive charts with tooltips

### 3. Statistics Section
- Key spatial analysis metrics
- Visual stat boxes with icons
- Hover effects and animations

### 4. Maps Section
- **Interactive Map**: Clickable markers with project details
- **Heatmap**: Density visualization of project distribution
- Tabbed interface for easy navigation

### 5. Analysis Section
- Detailed spatial analysis findings
- Infrastructure pattern insights
- Project details summary

## 🛠️ Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **UI Framework**: Bootstrap 5.3.0
- **Charts**: Chart.js 4.x
- **Maps**: Leaflet 1.9.4 with heatmap plugin
- **Icons**: Font Awesome 6.4.0
- **Deployment**: Vercel (static hosting)

## 📱 Responsive Design

The dashboard is fully responsive and optimized for:
- **Desktop**: Full feature set with side-by-side layouts
- **Tablet**: Adapted layouts with touch-friendly interactions
- **Mobile**: Single-column layout with optimized navigation

## 🔧 Customization

### Adding New Data
1. Update the GeoJSON file with new project data
2. Modify chart data in `script.js`
3. Update statistics in the HTML

### Styling Changes
1. Edit `styles.css` for visual modifications
2. Update color variables in CSS custom properties
3. Modify Bootstrap classes in HTML

### Adding New Features
1. Extend JavaScript functionality in `script.js`
2. Add new HTML sections as needed
3. Include additional CSS for new components

## 📈 Performance Optimization

- **Lazy Loading**: Maps load only when tabs are clicked
- **Debounced Updates**: Optimized map resize handling
- **CDN Resources**: All external libraries loaded from CDNs
- **Minified Assets**: Production-ready file sizes

## 🔒 Security Features

- **Content Security Policy**: Headers configured in Vercel
- **XSS Protection**: Built-in browser security features
- **Frame Protection**: Prevents clickjacking attacks

## 📊 Analytics Integration

The dashboard includes optional analytics tracking:
- User interaction tracking
- Navigation pattern analysis
- Performance monitoring

## 🌍 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 📞 Support

For technical support or feature requests:
1. Check the main project documentation
2. Review the console for error messages
3. Ensure all data files are properly formatted

## 📄 License

This dashboard is part of the Baringo Water Resource Mapping Project and follows the same licensing terms as the main project.

## 🎯 Future Enhancements

- **Real-time Data Updates**: API integration for live data
- **Advanced Filtering**: Project type and location filters
- **Export Functionality**: PDF and image export options
- **User Authentication**: Role-based access control
- **Mobile App**: Native mobile application version

---

**Last Updated**: 2024  
**Version**: 1.0.0  
**Compatibility**: Modern browsers with JavaScript enabled 