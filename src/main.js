document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('timeSlider');
  const burnButton = document.getElementById('burnButton');
  const currentSupply = document.querySelector('.current-supply');
  const yearDisplay = document.querySelector('.year-display');
  const ctx = document.getElementById('supplyChart');

  let supplyPoints = [
    { year: 2024, supply: 1000000000, value: 0.0000001 },
    { year: 2099, supply: 100000000, value: 0.01 },
    { year: 2675, supply: 1000000, value: 100 },
    { year: 4287, supply: 1000, value: 1000000 },
    { year: 32672, supply: 1, value: 1000000000000 }
  ];

  let chart;
  let isSimulating = false;

  // Generate more data points for smoother animation
  function generateDataPoints() {
    const points = [];
    let lastPoint = null;
    
    for (let i = 0; i < supplyPoints.length - 1; i++) {
        const start = supplyPoints[i];
        const end = supplyPoints[i + 1];
        const yearDiff = end.year - start.year;
        
        // Adjust number of points based on time period
        let steps;
        if (start.year < 2100) {
            steps = Math.min(yearDiff, yearDiff / 5);
        } else if (start.year < 3000) {
            steps = Math.min(yearDiff, yearDiff / 10);
        } else if (start.year < 10000) {
            steps = Math.min(yearDiff, yearDiff / 20);
        } else {
            steps = Math.min(yearDiff, yearDiff / 50);
        }
        
        for (let j = 0; j <= steps; j++) {
            const progress = j / steps;
            const year = Math.round(start.year + yearDiff * progress);
            const supply = getSupplyAtYear(year);
            const value = getValueAtYear(year);
            const point = { year, supply, value };
            
            // Only add point if it's different from the last one
            if (!lastPoint || 
                lastPoint.supply !== point.supply || 
                lastPoint.value !== point.value) {
                points.push(point);
                lastPoint = point;
            }
        }
    }
    return points;
  }

  function initChart() {
    const allPoints = generateDataPoints();
    
    chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: allPoints.map(point => point.year),
        datasets: [{
          label: 'Token Supply',
          data: allPoints.map(point => point.supply),
          borderColor: '#ffd700',
          backgroundColor: 'rgba(255, 215, 0, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.4,
          yAxisID: 'y'
        },
        {
          label: 'Token Value',
          data: allPoints.map(point => point.value),
          borderColor: '#00ff00',
          backgroundColor: 'rgba(0, 255, 0, 0.1)',
          borderWidth: 2,
          pointRadius: 0,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0
        },
        scales: {
          y: {
            type: 'logarithmic',
            position: 'left',
            grid: {
              color: 'rgba(255, 215, 0, 0.1)'
            },
            title: {
              display: true,
              text: '$PONZI SUPPLY',
              color: '#ffd700',
              font: { 
                size: window.innerWidth < 768 ? 10 : 14 
              }
            },
            ticks: {
              color: '#ffd700',
              font: {
                size: window.innerWidth < 768 ? 8 : 12
              },
              callback: function(value) {
                if (value === 1000000000) return '1B $PONZI';
                if (value === 100000000) return '100M $PONZI';
                if (value === 1000000) return '1M $PONZI';
                if (value === 1000) return '1K $PONZI';
                if (value === 1) return '1 $PONZI';
                return '';
              }
            }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: {
              display: false
            },
            title: {
              display: true,
              text: 'PRICE PER TOKEN ($)',
              color: '#00ff00',
              font: { 
                size: window.innerWidth < 768 ? 10 : 14 
              }
            },
            min: 0,
            max: 1000000000000,
            display: true,
            ticks: {
              color: '#00ff00',
              font: {
                size: window.innerWidth < 768 ? 8 : 12
              },
              autoSkip: false,
              callback: function(value) {
                const values = [
                  1000000000000, // 1 trillion
                  100000000000,  // 100 billion
                  10000000000,   // 10 billion
                  1000000000,    // 1 billion
                  100000000,     // 100 million
                  10000000,      // 10 million
                  1000000,       // 1 million
                  100000,        // 100k
                  10000,         // 10k
                  1000,          // 1k
                  100,           // 100
                  10,            // 10
                  5,             // Added more granular steps
                  2.5,           // for better visualization
                  1,             // 1
                  0.75,          // of early price movement
                  0.5,
                  0.25,
                  0.1,
                  0.05,
                  0.01,
                  0.005,
                  0.001,
                  0
                ];
                
                if (values.includes(value)) {
                  if (value >= 1) {
                    return '$' + value.toLocaleString();
                  } else if (value === 0) {
                    return '$0';
                  } else {
                    return '$' + value.toString();
                  }
                }
                return '';
              }
            }
          },
          x: {
            grid: {
              color: 'rgba(255, 215, 0, 0.1)'
            },
            title: {
              display: true,
              text: 'YEAR',
              color: '#ffd700',
              font: { 
                size: window.innerWidth < 768 ? 10 : 14 
              }
            },
            min: 2024,
            max: 32672,
            ticks: {
              color: '#fff',
              font: {
                size: window.innerWidth < 768 ? 8 : 12
              },
              maxRotation: window.innerWidth < 768 ? 0 : 45,
              minRotation: window.innerWidth < 768 ? 0 : 45,
              stepSize: 25,
              callback: function(value) {
                const year = parseInt(value);
                if (year < 2100 && year % 25 === 0) {
                  return `${year}`;
                } else if (year < 3000 && year % 100 === 0) {
                  return `${year}`;
                } else if (year < 10000 && year % 500 === 0) {
                  return `${year}`;
                } else if (year % 2000 === 0) {
                  return `${year}`;
                }
                return null;
              }
            }
          }
        },
        plugins: {
          legend: {
            display: true,
            labels: {
              color: '#fff',
              font: { 
                size: window.innerWidth < 768 ? 10 : 12 
              },
              padding: window.innerWidth < 768 ? 4 : 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const datasetLabel = context.dataset.label;
                const value = context.raw;
                if (datasetLabel === 'Token Supply') {
                  return `Supply: ${value.toLocaleString()} $PONZI`;
                } else {
                  if (value >= 1000000000000) return `Price: $${(value/1000000000000).toFixed(2)}T`;
                  if (value >= 1000000000) return `Price: $${(value/1000000000).toFixed(2)}B`;
                  if (value >= 1000000) return `Price: $${(value/1000000).toFixed(2)}M`;
                  if (value >= 1000) return `Price: $${(value/1000).toFixed(2)}K`;
                  if (value >= 1) return `Price: $${value.toFixed(2)}`;
                  return `Price: $${value.toFixed(7)}`;
                }
              }
            }
          }
        }
      }
    });
  }

  function updateChartToYear(year) {
    const allPoints = generateDataPoints();
    const visiblePoints = allPoints.filter(point => point.year <= year);
    
    // Update datasets with progressive visibility
    chart.data.labels = visiblePoints.map(point => point.year); // Only show years up to current point
    chart.data.datasets[0].data = visiblePoints.map(point => point.supply);
    chart.data.datasets[1].data = visiblePoints.map(point => point.value);
    
    // Update x-axis max dynamically
    const nextMilestone = Math.min(year + 1000, 32672);
    chart.options.scales.x.max = nextMilestone;
    
    // Update y1 (value) axis max dynamically based on current maximum value
    const currentMaxValue = Math.max(...visiblePoints.map(p => p.value));
    const nextValueMilestone = Math.min(currentMaxValue * 100, 1000000000000);
    chart.options.scales.y1.max = nextValueMilestone;
    
    chart.update('none');
  }

  function getSupplyAtYear(year) {
    for (let i = 0; i < supplyPoints.length - 1; i++) {
      if (year >= supplyPoints[i].year && year <= supplyPoints[i + 1].year) {
        const progress = (year - supplyPoints[i].year) / (supplyPoints[i + 1].year - supplyPoints[i].year);
        const startLog = Math.log10(supplyPoints[i].supply);
        const endLog = Math.log10(supplyPoints[i + 1].supply);
        const interpolatedLog = startLog + (endLog - startLog) * progress;
        return Math.round(Math.pow(10, interpolatedLog));
      }
    }
    return 1;
  }

  function getValueAtYear(year) {
    for (let i = 0; i < supplyPoints.length - 1; i++) {
        if (year >= supplyPoints[i].year && year <= supplyPoints[i + 1].year) {
            const progress = (year - supplyPoints[i].year) / (supplyPoints[i + 1].year - supplyPoints[i].year);
            const startLog = Math.log10(supplyPoints[i].value);
            const endLog = Math.log10(supplyPoints[i + 1].value);
            const interpolatedLog = startLog + (endLog - startLog) * progress;
            return Math.pow(10, interpolatedLog);
        }
    }
    return supplyPoints[supplyPoints.length - 1].value;
  }

  function updateDisplay(year) {
    const supply = getSupplyAtYear(year);
    const value = getValueAtYear(year);
    let valueDisplay;
    
    if (value >= 1000000000000) {
        valueDisplay = value.toLocaleString();
    } else if (value >= 1) {
        valueDisplay = value.toLocaleString();
    } else {
        valueDisplay = value.toFixed(7);
    }

    currentSupply.innerHTML = `
        Token Supply: ${supply.toLocaleString()} $PONZI<br>
        Price Per Token: $${valueDisplay}<br>
        Year: ${year}
    `;
    yearDisplay.style.display = 'none';
  }

  // Add this function to handle stopping autoplay when using slider or burn button
  function stopAllAnimations() {
    isSimulating = false;
    burnButton.disabled = false;
    burnButton.innerHTML = 'INITIATE BURN SEQUENCE';
  }

  // Modify the slider event listener to stop autoplay when manually sliding
  slider.addEventListener('input', () => {
    const year = parseInt(slider.value);
    updateDisplay(year);
    updateChartToYear(year);
  });

  // Update the burn button event listener
  burnButton.addEventListener('click', async () => {
    if (isSimulating) {
        stopAllAnimations();
        return;
    }

    // If we're at the end, reset to start
    if (parseInt(slider.value) >= 32672) {
        slider.value = 2024;
        updateDisplay(2024);
        updateChartToYear(2024);
    }

    isSimulating = true;
    burnButton.disabled = false;
    burnButton.innerHTML = 'PAUSE SEQUENCE';
    
    const startYear = parseInt(slider.value);
    const endYear = 32672;
    const duration = 5000;
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
        if (!isSimulating) break;
        
        const progress = i / steps;
        const currentYear = Math.round(startYear + (endYear - startYear) * progress);
        
        slider.value = currentYear;
        updateDisplay(currentYear);
        updateChartToYear(currentYear);
        await new Promise(resolve => setTimeout(resolve, duration / steps));
    }
    
    if (!isSimulating) {
        burnButton.innerHTML = 'RESUME SEQUENCE';
    } else {
        stopAllAnimations();
    }
  });

  function addControls() {
    const controlsHTML = `
      <div class="chart-controls">
        <div class="era-jumps">
          <button data-era="2024" class="era-btn">Genesis</button>
          <button data-era="2099" class="era-btn">very early</button>
          <button data-era="2675" class="era-btn">early</button>
          <button data-era="4287" class="era-btn">still early</button>
          <button data-era="32672" class="era-btn">endgame</button>
        </div>
      </div>
    `;
    
    const burnControls = document.querySelector('.burn-controls');
    burnControls.insertAdjacentHTML('beforeend', controlsHTML);
    
    document.querySelectorAll('.era-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const year = parseInt(e.target.dataset.era);
        jumpToYear(year);
      });
    });
  }

  // Update the jumpToYear function
  function jumpToYear(year) {
    stopAllAnimations();
    slider.value = year;
    updateDisplay(year);
    updateChartToYear(year);
  }

  // Initialize
  initChart();
  updateDisplay(2024);
  addControls();

  function initializeWealthCalculator() {
    const calculator = document.getElementById('calculateWealth');
    const greedLevel = document.getElementById('greedLevel');
    const greedDisplay = document.getElementById('greedDisplay');
    const result = document.getElementById('wealthResult');

    greedLevel.addEventListener('input', () => {
      greedDisplay.textContent = `${greedLevel.value}/10`;
    });

    calculator.addEventListener('click', () => {
      const investment = parseFloat(document.getElementById('initialInvestment').value);
      const greed = parseInt(greedLevel.value);
      
      // Completely unrealistic calculation
      const multiplier = Math.pow(10, greed);
      const futureWealth = investment * multiplier * (Math.random() * 100 + 100);
      
      result.classList.remove('hidden');
      const wealthAmount = result.querySelector('.wealth-amount');
      
      // Animate the number counting up
      let current = 0;
      const target = futureWealth;
      const duration = 2000;
      const steps = 60;
      const increment = target / steps;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        wealthAmount.textContent = `$${current.toLocaleString(undefined, {
          maximumFractionDigits: 0
        })}`;
      }, duration / steps);
    });
  }

  function initializeTestimonials() {
    const testimonials = document.querySelectorAll('.testimonial');
    const container = document.querySelector('.testimonial-dots');
    let currentIndex = 0;
    
    // Create dots
    testimonials.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (index === 0) dot.classList.add('active');
      dot.addEventListener('click', () => showTestimonial(index));
      container.appendChild(dot);
    });
    
    function showTestimonial(index) {
      testimonials.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dot').forEach(d => d.classList.remove('active'));
      testimonials[index].classList.add('active');
      document.querySelectorAll('.dot')[index].classList.add('active');
      currentIndex = index;
    }
    
    // Auto-rotate testimonials
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      showTestimonial(currentIndex);
    }, 5000);
  }

  initializeWealthCalculator();
  initializeTestimonials();
});
