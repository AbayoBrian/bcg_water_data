// Baringo Water Resource Mapping Dashboard - Complete JavaScript

// Global variables
let interactiveMap, heatmapMap;
let projectData = null;
let projectTypeChart, subcountyChart;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeMaps();
    addScrollAnimations();
    loadProjectData();
    setupEventListeners();
});

// Initialize Chart.js charts
function initializeCharts() {
    // Project Type Distribution Chart
    const projectTypeCtx = document.getElementById('projectTypeChart').getContext('2d');
    projectTypeChart = new Chart(projectTypeCtx, {
        type: 'doughnut',
        data: {
            labels: ['Boreholes', 'Water Pans', 'Protected Springs', 'Water Supply Systems', 'Other'],
            datasets: [{
                data: [601, 301, 95, 81, 43],
                backgroundColor: [
                    '#0d6efd', // Blue
                    '#198754', // Green
                    '#ffc107', // Yellow
                    '#0dcaf0', // Cyan
                    '#6c757d'  // Gray
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const percentage = ((value / 1121) * 100).toFixed(1);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });

    // Projects by Subcounty Chart
    const subcountyCtx = document.getElementById('subcountyChart').getContext('2d');
    subcountyChart = new Chart(subcountyCtx, {
        type: 'bar',
        data: {
            labels: ['Mogotio', 'Baringo South', 'Baringo North', 'Baringo Central', 'Tiaty', 'Eldama Ravine', 'Koibatek'],
            datasets: [{
                label: 'Number of Projects',
                data: [198, 197, 187, 175, 165, 155, 44],
                backgroundColor: 'rgba(13, 110, 253, 0.8)',
                borderColor: 'rgba(13, 110, 253, 1)',
                borderWidth: 2,
                borderRadius: 5,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Projects: ${context.parsed.y}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        maxRotation: 45
                    }
                }
            }
        }
    });

    // Add resize observer for charts
    const chartObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            if (projectTypeChart) projectTypeChart.resize();
            if (subcountyChart) subcountyChart.resize();
        });
    });

    document.querySelectorAll('.chart-container').forEach(container => {
        chartObserver.observe(container);
    });
}

// Initialize Leaflet maps with enhanced interactive map
function initializeMaps() {
    // Interactive Map with better controls
    interactiveMap = L.map('interactiveMap', {
        center: [0.497, 35.905],
        zoom: 9,
        zoomControl: false,
        preferCanvas: true // Better performance for many markers
    });

    // Add OpenStreetMap tiles with better contrast
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
        detectRetina: true
    }).addTo(interactiveMap);

    // Add custom zoom control
    L.control.zoom({
        position: 'topright'
    }).addTo(interactiveMap);

    // Heatmap Map
    heatmapMap = L.map('heatmapMap').setView([0.497, 35.905], 9);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(heatmapMap);

    // Add resize observer for maps
    const mapObserver = new ResizeObserver(entries => {
        entries.forEach(entry => {
            setTimeout(() => {
                if (interactiveMap) interactiveMap.invalidateSize();
                if (heatmapMap) heatmapMap.invalidateSize();
            }, 100);
        });
    });

    document.querySelectorAll('.map-container').forEach(container => {
        mapObserver.observe(container);
    });
}

// Enhanced project data loading
async function loadProjectData() {
    try {
        // For demo purposes, we'll create enhanced mock data
        projectData = {
            type: 'FeatureCollection',
            features: generateEnhancedMockData()
        };
        
        console.log('Project data loaded:', projectData.features.length, 'features');
        loadInteractiveMapData();
    } catch (error) {
        console.error('Error loading project data:', error);
        // Fallback to sample data with visible marker
        projectData = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {
                    project_type: 'Borehole',
                    subcounty: 'Mogotio',
                    status: 'Operational',
                    beneficiaries: 350,
                    ward: 'Ward 3',
                    color: '#0d6efd',
                    icon: 'fa-water'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [35.905, 0.497]
                }
            }]
        };
    }
}

// Enhanced mock data generator with clustered distribution
function generateEnhancedMockData() {
    const subcounties = [
        {name: 'Mogotio', count: 198, center: [0.3, 35.8], spread: 0.2},
        {name: 'Baringo South', count: 197, center: [0.1, 35.9], spread: 0.15},
        {name: 'Baringo North', count: 187, center: [0.7, 35.7], spread: 0.25},
        {name: 'Baringo Central', count: 175, center: [0.5, 35.6], spread: 0.3},
        {name: 'Tiaty', count: 165, center: [0.8, 36.1], spread: 0.4},
        {name: 'Eldama Ravine', count: 155, center: [0.2, 35.5], spread: 0.2},
        {name: 'Koibatek', count: 44, center: [0.4, 36.0], spread: 0.1}
    ];
    
    const projectTypes = [
        {name: 'Borehole', count: 601, color: '#0d6efd', icon: 'fa-water'},
        {name: 'Water Pan', count: 301, color: '#198754', icon: 'fa-tint'},
        {name: 'Protected Spring', count: 95, color: '#ffc107', icon: 'fa-umbrella'},
        {name: 'Water Supply System', count: 81, color: '#0dcaf0', icon: 'fa-network-wired'},
        {name: 'Other', count: 43, color: '#6c757d', icon: 'fa-circle'}
    ];
    
    const statuses = ['Operational', 'Non-operational', 'Under Construction', 'Maintenance'];
    const wards = Array.from({length: 30}, (_, i) => `Ward ${i+1}`);
    
    const features = [];
    let projectId = 0;
    
    subcounties.forEach(subcounty => {
        for (let i = 0; i < subcounty.count; i++) {
            // Generate coordinates clustered around subcounty center
            const lat = subcounty.center[0] + (Math.random() - 0.5) * subcounty.spread;
            const lng = subcounty.center[1] + (Math.random() - 0.5) * subcounty.spread;
            
            // Assign project type proportionally
            projectTypes.forEach(type => {
                if (projectId < type.count) {
                    features.push({
                        type: 'Feature',
                        properties: {
                            project_type: type.name,
                            subcounty: subcounty.name,
                            status: statuses[Math.floor(Math.random() * statuses.length)],
                            beneficiaries: Math.floor(Math.random() * 500) + 100,
                            ward: wards[Math.floor(Math.random() * wards.length)],
                            color: type.color,
                            icon: type.icon
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [lng, lat]
                        }
                    });
                    projectId++;
                }
            });
        }
    });
    
    return features;
}

// Improved interactive map data loading
function loadInteractiveMapData() {
    if (!projectData || !interactiveMap) return;

    // Clear existing layers except base layer
    interactiveMap.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.FeatureGroup) {
            interactiveMap.removeLayer(layer);
        }
    });

    // Create feature group for better performance
    const featureGroup = L.featureGroup().addTo(interactiveMap);

    // Add markers for each project with improved styling
    projectData.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const props = feature.properties;
        
        // Create custom icon with better visibility
        const icon = L.divIcon({
            html: `<div style="background-color: ${props.color || '#0d6efd'}; 
                   width: 16px; height: 16px; border-radius: 50%; 
                   border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                   display: flex; align-items: center; justify-content: center;">
                   <i class="fas ${props.icon || 'fa-water'} text-white" style="font-size: 8px;"></i></div>`,
            className: 'custom-marker',
            iconSize: [16, 16],
            iconAnchor: [8, 8]
        });

        // Create popup with better formatting
        const popupContent = `
            <div style="min-width: 200px; font-family: 'Segoe UI', sans-serif;">
                <h6 style="color: ${props.color || '#0d6efd'}; margin-bottom: 10px; font-weight: 600;">
                    <i class="fas ${props.icon || 'fa-water'} me-2"></i>${props.project_type}
                </h6>
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; width: 100px; color: #6c757d;">Subcounty:</span>
                    <strong>${props.subcounty || 'N/A'}</strong>
                </div>
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; width: 100px; color: #6c757d;">Status:</span>
                    <span class="badge bg-${getStatusColor(props.status)}">${props.status || 'Unknown'}</span>
                </div>
                ${props.beneficiaries ? `
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; width: 100px; color: #6c757d;">Beneficiaries:</span>
                    <strong>${props.beneficiaries}</strong>
                </div>` : ''}
                ${props.ward ? `
                <div style="margin-bottom: 8px;">
                    <span style="display: inline-block; width: 100px; color: #6c757d;">Ward:</span>
                    <strong>${props.ward}</strong>
                </div>` : ''}
            </div>
        `;

        const marker = L.marker([coords[1], coords[0]], { icon: icon })
            .bindPopup(popupContent);
        
        featureGroup.addLayer(marker);
    });

    // Fit map to show all markers with padding
    if (projectData.features.length > 0) {
        interactiveMap.fitBounds(featureGroup.getBounds(), {
            padding: [50, 50],
            maxZoom: 9
        });
    }
}

// Load heatmap data
function loadHeatmapData() {
    if (!projectData) return;

    // Clear existing layers
    heatmapMap.eachLayer((layer) => {
        if (layer instanceof L.HeatLayer) {
            heatmapMap.removeLayer(layer);
        }
    });

    // Prepare heatmap data
    const heatmapData = projectData.features.map(feature => {
        const coords = feature.geometry.coordinates;
        return [coords[1], coords[0], 1]; // [lat, lng, intensity]
    });

    // Add heatmap layer
    L.heatLayer(heatmapData, {
        radius: 25,
        blur: 15,
        maxZoom: 10,
        gradient: {
            0.4: '#0d6efd',
            0.6: '#ffc107',
            0.8: '#dc3545',
            1.0: '#6f42c1'
        }
    }).addTo(heatmapMap);
}

// Get status color for badges
function getStatusColor(status) {
    const statusColors = {
        'Operational': 'success',
        'Non-operational': 'danger',
        'Under Construction': 'warning',
        'Maintenance': 'secondary'
    };
    return statusColors[status] || 'secondary';
}

// Add scroll animations
function addScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // Observe cards
    document.querySelectorAll('.card').forEach(card => {
        observer.observe(card);
    });

    // Observe stat boxes
    document.querySelectorAll('.stat-box').forEach(box => {
        observer.observe(box);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Map tab switching
    const mapTabTriggers = [].slice.call(document.querySelectorAll('#interactive-tab, #heatmap-tab'));
    mapTabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const mapContainer = document.getElementById(this.id === 'interactive-tab' ? 'interactiveMap' : 'heatmapMap');
            showLoading(mapContainer);
            setTimeout(() => {
                if (this.id === 'interactive-tab') {
                    loadInteractiveMapData();
                } else {
                    loadHeatmapData();
                }
                hideLoading(mapContainer, '');
            }, 500);
        });
    });

    // Smooth scrolling for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Window resize handling with debounce
    window.addEventListener('resize', debounce(() => {
        if (interactiveMap) interactiveMap.invalidateSize();
        if (heatmapMap) heatmapMap.invalidateSize();
    }, 250));
}

// Add loading states
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        if (interactiveMap) interactiveMap.closePopup();
        if (heatmapMap) heatmapMap.closePopup();
    }
});

// Add touch gestures for mobile
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;

    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) console.log('Swipe left detected');
        else if (diffX < -50) console.log('Swipe right detected');
    }

    touchStartX = 0;
    touchStartY = 0;
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
});

// Analytics tracking (optional)
function trackEvent(category, action, label) {
    console.log('Event tracked:', category, action, label);
}

document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link')) {
        trackEvent('Navigation', 'Click', e.target.textContent.trim());
    }
    if (e.target.matches('.btn')) {
        trackEvent('Button', 'Click', e.target.textContent.trim());
    }
});
