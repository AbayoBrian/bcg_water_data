// Baringo Water Resource Mapping Dashboard JavaScript

// Global variables
let interactiveMap, heatmapMap;
let projectData = null;
let projectTypeChart, subcountyChart;

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeCharts();
    initializeMaps();
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

// Load project data
async function loadProjectData() {
    try {
        // In a real implementation, fetch actual GeoJSON data
        // const response = await fetch('./baringo_water_points.geojson');
        // projectData = await response.json();
        
        // For demo, create mock data matching the statistics
        projectData = generateMockData();
        
        console.log('Project data loaded:', projectData.features.length, 'features');
        
        // Load initial map data
        loadInteractiveMapData();
    } catch (error) {
        console.error('Error loading project data:', error);
        // Fallback to minimal sample data
        projectData = {
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                properties: {
                    project_type: 'Borehole',
                    subcounty: 'Mogotio',
                    status: 'Operational',
                    beneficiaries: 350,
                    ward: 'Ward 3'
                },
                geometry: {
                    type: 'Point',
                    coordinates: [35.905, 0.497]
                }
            }]
        };
    }
}

// Generate mock data matching the statistics
function generateMockData() {
    const subcounties = [
        {name: 'Mogotio', count: 198},
        {name: 'Baringo South', count: 197},
        {name: 'Baringo North', count: 187},
        {name: 'Baringo Central', count: 175},
        {name: 'Tiaty', count: 165},
        {name: 'Eldama Ravine', count: 155},
        {name: 'Koibatek', count: 44}
    ];
    
    const projectTypes = [
        {name: 'Borehole', count: 601},
        {name: 'Water Pan', count: 301},
        {name: 'Protected Spring', count: 95},
        {name: 'Water Supply System', count: 81},
        {name: 'Other', count: 43}
    ];
    
    const statuses = ['Operational', 'Non-operational', 'Under Construction', 'Maintenance'];
    const wards = Array.from({length: 30}, (_, i) => `Ward ${i+1}`);
    
    const features = [];
    let projectId = 0;
    
    // Distribute projects by subcounty
    subcounties.forEach(subcounty => {
        for (let i = 0; i < subcounty.count; i++) {
            // Generate random coordinates within Baringo County bounds
            const lat = 0.3 + Math.random() * 1.2;
            const lng = 35.5 + Math.random() * 1.2;
            
            // Assign project type proportionally
            let typeAssigned = false;
            projectTypes.forEach(type => {
                if (!typeAssigned && projectId < type.count) {
                    features.push({
                        type: 'Feature',
                        properties: {
                            project_type: type.name,
                            subcounty: subcounty.name,
                            status: statuses[Math.floor(Math.random() * statuses.length)],
                            beneficiaries: Math.floor(Math.random() * 500) + 100,
                            ward: wards[Math.floor(Math.random() * wards.length)]
                        },
                        geometry: {
                            type: 'Point',
                            coordinates: [lng, lat]
                        }
                    });
                    typeAssigned = true;
                    projectId++;
                }
            });
        }
    });
    
    return {
        type: 'FeatureCollection',
        features: features
    };
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
        
        const icon = createProjectIcon(properties.project_type);
        
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
        'Other': '#6c757d'
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
        'Maintenance': 'secondary'
    };
    return statusColors[status] || 'secondary';
}

// Setup event listeners
function setupEventListeners() {
    // Map tab switching
    const mapTabTriggers = [].slice.call(document.querySelectorAll('#interactive-tab, #heatmap-tab'));
    mapTabTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            setTimeout(() => {
                if (this.id === 'interactive-tab') {
                    loadInteractiveMapData();
                } else {
                    loadHeatmapData();
                }
            }, 100);
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
}
