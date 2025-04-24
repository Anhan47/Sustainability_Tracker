document.addEventListener('DOMContentLoaded', function() {
    // Initialize data storage
    let sustainabilityData = {
        environmental: [],
        social: [],
        economic: [],
        education: []
    };

    // Initialize charts
    const charts = {
        environmental: null,
        social: null,
        economic: null,
        education: null
    };

    // Initialize charts for each category
    initializeCharts();

    // Form submission handlers
    const forms = {
        environmentalForm: document.getElementById('environmentalForm'),
        socialForm: document.getElementById('socialForm'),
        economicForm: document.getElementById('economicForm'),
        educationForm: document.getElementById('educationForm')
    };

    Object.keys(forms).forEach(formId => {
        forms[formId].addEventListener('submit', function(e) {
            e.preventDefault();
            
            const category = formId.replace('Form', '');
            const formData = new FormData(this);
            const data = {
                timestamp: new Date().toLocaleString()
            };
            
            this.querySelectorAll('input, select, textarea').forEach(input => {
                const sanitizedValue = input.value
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
                data[input.id] = sanitizedValue;
            });

            sustainabilityData[category].unshift(data);
            
            updateDisplay(category);
            updateChart(category);
            
            this.reset();
            showSuccessMessage(category);
        });
    });

    function initializeCharts() {
        // Environmental Chart
        charts.environmental = new Chart(document.getElementById('environmentalChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Electricity Usage (kWh)',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Water Usage (L)',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }, {
                    label: 'Waste (kg)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Social Chart
        charts.social = new Chart(document.getElementById('socialChart'), {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: 'Well-being Score',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.5)'
                }, {
                    label: 'Participation Rate (%)',
                    data: [],
                    backgroundColor: 'rgba(255, 99, 132, 0.5)'
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Economic Chart
        charts.economic = new Chart(document.getElementById('economicChart'), {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'Green Procurement (%)',
                    data: [],
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }, {
                    label: 'Operational Cost ($)',
                    data: [],
                    borderColor: 'rgb(255, 99, 132)',
                    tension: 0.1
                }, {
                    label: 'Energy Savings ($)',
                    data: [],
                    borderColor: 'rgb(54, 162, 235)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        // Education Chart
        charts.education = new Chart(document.getElementById('educationChart'), {
            type: 'pie',
            data: {
                labels: ['Article', 'Video', 'Workshop', 'Report'],
                datasets: [{
                    data: [0, 0, 0, 0],
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(255, 206, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)'
                    ]
                }]
            },
            options: {
                responsive: true
            }
        });
    }

    function updateChart(category) {
        const data = sustainabilityData[category];
        const chart = charts[category];

        if (category === 'environmental') {
            const labels = data.map(entry => entry.timestamp).reverse();
            const electricity = data.map(entry => entry.electricity).reverse();
            const water = data.map(entry => entry.water).reverse();
            const waste = data.map(entry => entry.waste).reverse();

            chart.data.labels = labels;
            chart.data.datasets[0].data = electricity;
            chart.data.datasets[1].data = water;
            chart.data.datasets[2].data = waste;
        }
        else if (category === 'social') {
            const labels = data.map(entry => entry.studentName).reverse();
            const wellbeing = data.map(entry => entry.studentWellbeing).reverse();
            const participation = data.map(entry => entry.participation).reverse();

            chart.data.labels = labels;
            chart.data.datasets[0].data = wellbeing;
            chart.data.datasets[1].data = participation;
        }
        else if (category === 'economic') {
            const labels = data.map(entry => entry.timestamp).reverse();
            const procurement = data.map(entry => entry.greenProcurement).reverse();
            const cost = data.map(entry => entry.operationalCost).reverse();
            const savings = data.map(entry => entry.energySavings).reverse();

            chart.data.labels = labels;
            chart.data.datasets[0].data = procurement;
            chart.data.datasets[1].data = cost;
            chart.data.datasets[2].data = savings;
        }
        else if (category === 'education') {
            const resourceCounts = {
                article: 0,
                video: 0,
                workshop: 0,
                report: 0
            };
            
            data.forEach(entry => {
                resourceCounts[entry.resourceType]++;
            });

            chart.data.datasets[0].data = [
                resourceCounts.article,
                resourceCounts.video,
                resourceCounts.workshop,
                resourceCounts.report
            ];
        }

        chart.update();
    }

    function updateDisplay(category) {
        const displayElement = document.getElementById(`${category}Data`);
        const data = sustainabilityData[category];

        if (data.length === 0) {
            displayElement.innerHTML = '<p>No data recorded yet.</p>';
            return;
        }

        const entriesHTML = data.map(entry => {
            let entryHTML = `
                <div class="entry">
                    <p><strong>Date:</strong> ${entry.timestamp}</p>
            `;

            Object.keys(entry).forEach(key => {
                if (key !== 'timestamp') {
                    entryHTML += `<p><strong>${key.replace(/([A-Z])/g, ' $1').trim()}:</strong> ${entry[key]}</p>`;
                }
            });

            entryHTML += '</div>';
            return entryHTML;
        }).join('<hr>');

        displayElement.innerHTML = `
            <h3>Recent Entries</h3>
            ${entriesHTML}
        `;
    }

    function showSuccessMessage(category) {
        const form = document.getElementById(`${category}Form`);
        const message = document.createElement('div');
        message.className = 'success-message';
        message.textContent = 'Data saved successfully!';
        
        form.insertAdjacentElement('beforebegin', message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }
});
