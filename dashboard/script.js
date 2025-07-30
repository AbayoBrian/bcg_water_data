// Baringo Water Resource Mapping Dashboard JavaScript

// Global variables
let interactiveMap, heatmapMap;
let projectData = null;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeMaps();
    addScrollAnimations();
    loadProjectData();
});

// Initialize Chart.js charts
function initializeCharts() {
    // Project Type Distribution Chart
    const projectTypeCtx = document.getElementById('projectTypeChart').getContext('2d');
    const projectTypeChart = new Chart(projectTypeCtx, {
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
    const subcountyChart = new Chart(subcountyCtx, {
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
}

// Initialize Leaflet maps
function initializeMaps() {
    // Interactive Map
    interactiveMap = L.map('interactiveMap').setView([0.497, 35.905], 9);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(interactiveMap);

    // Heatmap Map
    heatmapMap = L.map('heatmapMap').setView([0.497, 35.905], 9);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(heatmapMap);

    // Load map data when tab is clicked
    document.getElementById('interactive-tab').addEventListener('click', function() {
        setTimeout(() => {
            loadInteractiveMapData();
        }, 100);
    });

    document.getElementById('heatmap-tab').addEventListener('click', function() {
        setTimeout(() => {
            loadHeatmapData();
        }, 100);
    });
}

// Load project data from GeoJSON
async function loadProjectData() {
    try {
        const response = await fetch('./baringo_water_points.geojson');
        projectData = await response.json();
        console.log('Project data loaded:', projectData.features.length, 'features');
    } catch (error) {
        console.error('Error loading project data:', error);
        // Fallback to sample data
        projectData = {
            features: [
                {
                    type: 'Feature',
                    properties: {
                        project_type: 'Borehole',
                        subcounty: 'Mogotio',
                        status: 'Operational'
                    },
                    geometry: {
                        type: 'Point',
                        coordinates: [35.905, 0.497]
                    }
                }
            ]
        };
    }
}

// Load interactive map data
function loadInteractiveMapData() {
    if (!projectData) return;

    // Clear existing layers
    interactiveMap.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.CircleMarker) {
            interactiveMap.removeLayer(layer);
        }
    });

    // Add markers for each project
    projectData.features.forEach(feature => {
        const coords = feature.geometry.coordinates;
        const properties = feature.properties;
        
        // Create custom icon based on project type
        const icon = createProjectIcon(properties.project_type);
        
        // Create popup content
        const popupContent = `
            <div style="min-width: 200px;">
                <h6 style="color: #0d6efd; margin-bottom: 10px;">
                    <i class="fas fa-water me-2"></i>${properties.project_type || 'Water Project'}
                </h6>
                <p><strong>Subcounty:</strong> ${properties.subcounty || 'N/A'}</p>
                <p><strong>Status:</strong> <span class="badge bg-${getStatusColor(properties.status)}">${properties.status || 'Unknown'}</span></p>
                ${properties.beneficiaries ? `<p><strong>Beneficiaries:</strong> ${properties.beneficiaries}</p>` : ''}
                ${properties.ward ? `<p><strong>Ward:</strong> ${properties.ward}</p>` : ''}
            </div>
        `;

        // Add marker to map
        L.marker([coords[1], coords[0]], { icon: icon })
            .bindPopup(popupContent)
            .addTo(interactiveMap);
    });
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

// Create custom icon for project types
function createProjectIcon(projectType) {
    const iconColors = {
        'Borehole': '#0d6efd',
        'Water Pan': '#198754',
        'Protected Spring': '#ffc107',
        'Water Supply System': '#0dcaf0',
        'Dam': '#6f42c1',
        'Shallow Well': '#fd7e14',
        'Deep Well': '#20c997',
        'Water Tank': '#e83e8c',
        'Water Kiosk': '#6c757d',
        'Other': '#495057'
    };

    const color = iconColors[projectType] || '#6c757d';
    
    return L.divIcon({
        html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        className: 'custom-marker',
        iconSize: [12, 12],
        iconAnchor: [6, 6]
    });
}

// Get status color for badges
function getStatusColor(status) {
    const statusColors = {
        'Operational': 'success',
        'Non-operational': 'danger',
        'Under Construction': 'warning',
        'Planned': 'info',
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

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
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

// Add loading states
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Add map loading indicators
document.getElementById('interactive-tab').addEventListener('click', function() {
    const mapContainer = document.getElementById('interactiveMap');
    showLoading(mapContainer);
    setTimeout(() => {
        loadInteractiveMapData();
        hideLoading(mapContainer, '');
    }, 500);
});

document.getElementById('heatmap-tab').addEventListener('click', function() {
    const mapContainer = document.getElementById('heatmapMap');
    showLoading(mapContainer);
    setTimeout(() => {
        loadHeatmapData();
        hideLoading(mapContainer, '');
    }, 500);
});

// Add responsive behavior
window.addEventListener('resize', function() {
    if (interactiveMap) {
        interactiveMap.invalidateSize();
    }
    if (heatmapMap) {
        heatmapMap.invalidateSize();
    }
});

// Add keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open popups
        if (interactiveMap) {
            interactiveMap.closePopup();
        }
        if (heatmapMap) {
            heatmapMap.closePopup();
        }
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

    // Detect swipe gestures
    if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 50) {
            // Swipe left - could be used for navigation
            console.log('Swipe left detected');
        } else if (diffX < -50) {
            // Swipe right - could be used for navigation
            console.log('Swipe right detected');
        }
    }

    touchStartX = 0;
    touchStartY = 0;
});

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize map updates
const debouncedMapUpdate = debounce(() => {
    if (interactiveMap) {
        interactiveMap.invalidateSize();
    }
    if (heatmapMap) {
        heatmapMap.invalidateSize();
    }
}, 250);

window.addEventListener('resize', debouncedMapUpdate);

// Add error handling
window.addEventListener('error', function(e) {
    console.error('Dashboard error:', e.error);
    // Could add user notification here
});

// Add analytics tracking (optional)
function trackEvent(category, action, label) {
    // Google Analytics or other tracking code could go here
    console.log('Event tracked:', category, action, label);
}

// Track user interactions
document.addEventListener('click', function(e) {
    if (e.target.matches('.nav-link')) {
        trackEvent('Navigation', 'Click', e.target.textContent.trim());
    }
    if (e.target.matches('.btn')) {
        trackEvent('Button', 'Click', e.target.textContent.trim());
    }
}); 