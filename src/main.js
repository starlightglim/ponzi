document.addEventListener('DOMContentLoaded', function() {
  const slider = document.getElementById('timeSlider');
  const burnButton = document.getElementById('burnButton');
  const currentSupply = document.querySelector('.current-supply');
  const yearDisplay = document.querySelector('.year-display');
  const ctx = document.getElementById('supplyChart');

  let supplyPoints = [
    { year: 2024, supply: 100000000000, value: 0.0000001 },  // 100 billion
    { year: 2099, supply: 1000000000, value: 0.01 },         // 1 billion
    { year: 2675, supply: 1000000, value: 100 },             // 1 million
    { year: 4287, supply: 1000, value: 1000000 },            // 1 thousand
    { year: 32672, supply: 1, value: 1000000000000 }         // 1 token
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
                if (value === 100000000000) return '100B $PONZI';
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
                  0.0000001,     // Added for initial price
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
                  if (value >= 1000000000) {
                    return `Supply: ${(value/1000000000).toFixed(1)}B $PONZI`;
                  } else if (value >= 1000000) {
                    return `Supply: ${(value/1000000).toFixed(1)}M $PONZI`;
                  } else if (value >= 1000) {
                    return `Supply: ${(value/1000).toFixed(1)}K $PONZI`;
                  }
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
    
    chart.data.labels = visiblePoints.map(point => point.year);
    chart.data.datasets[0].data = visiblePoints.map(point => point.supply);
    chart.data.datasets[1].data = visiblePoints.map(point => point.value);
    
    const nextMilestone = Math.min(year + 1000, 32672);
    chart.options.scales.x.max = nextMilestone;
    
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
    let supplyDisplay;
    let valueDisplay;
    
    // Format supply display
    if (supply >= 1000000000) {
      supplyDisplay = `${(supply/1000000000).toFixed(1)}B`;
    } else if (supply >= 1000000) {
      supplyDisplay = `${(supply/1000000).toFixed(1)}M`;
    } else if (supply >= 1000) {
      supplyDisplay = `${(supply/1000).toFixed(1)}K`;
    } else {
      supplyDisplay = supply.toString();
    }
    
    // Format value display
    if (value >= 1000000000000) {
      valueDisplay = `$${(value/1000000000000).toFixed(2)}T`;
    } else if (value >= 1000000000) {
      valueDisplay = `$${(value/1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      valueDisplay = `$${(value/1000000).toFixed(2)}M`;
    } else if (value >= 1) {
      valueDisplay = `$${value.toFixed(2)}`;
    } else {
      valueDisplay = `$${value.toFixed(7)}`;
    }

    currentSupply.innerHTML = `
        Token Supply: ${supplyDisplay} $PONZI<br>
        Price Per Token: ${valueDisplay}<br>
        Year: ${year}
    `;
    yearDisplay.style.display = 'none';
  }

  function stopAllAnimations() {
    isSimulating = false;
    burnButton.disabled = false;
    burnButton.innerHTML = 'INITIATE BURN SEQUENCE';
  }

  slider.addEventListener('input', () => {
    const year = parseInt(slider.value);
    updateDisplay(year);
    updateChartToYear(year);
  });

  burnButton.addEventListener('click', async () => {
    if (isSimulating) {
        stopAllAnimations();
        return;
    }

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
  initializeMugshotGenerator();
});
function initializeMugshotGenerator() {
  const mugshotSection = document.createElement('div');
  mugshotSection.className = 'mugshot-generator';
  mugshotSection.innerHTML = `
      <h2>🚨 $PONZI MUGSHOT 🚨</h2>
      <div class="mugshot-container">
          <div class="mugshot-preview">
              <canvas id="mugshotCanvas"></canvas>
              <div class="preview-overlay">Drop image here or click to upload</div>
          </div>
          <div class="mugshot-controls">
              <div class="control-group">
                  <div class="twitter-input-group">
                      <input type="text" id="twitterHandle" class="ponzi-input" placeholder="Enter Twitter handle (without @)">
                      <button id="fetchTwitter" class="twitter-btn">Fetch</button>
                  </div>
                  <input type="file" id="fileInput" style="display: none" accept="image/*">
              </div>
              <div class="control-group">
                  <input type="text" id="suspectName" class="ponzi-input" placeholder="SUSPECT NAME">
                  <input type="text" id="crimeCaption" class="caption-input" placeholder="CRIME">
              </div>
              <button id="downloadMugshot" class="download-btn">SAVE EVIDENCE</button>
          </div>
      </div>
  `;

  const wealthManifesto = document.querySelector('.wealth-manifesto');
  wealthManifesto.parentNode.insertBefore(mugshotSection, wealthManifesto);

  // Initialize elements
  const canvas = document.getElementById('mugshotCanvas');
  const ctx = canvas.getContext('2d');
  const fileInput = document.getElementById('fileInput');
  const preview = document.querySelector('.mugshot-preview');
  const twitterInput = document.getElementById('twitterHandle');
  const fetchTwitterBtn = document.getElementById('fetchTwitter');
  const suspectName = document.getElementById('suspectName');
  const crimeCaption = document.getElementById('crimeCaption');
  const downloadBtn = document.getElementById('downloadMugshot');

  // Set canvas dimensions
  canvas.width = 400;
  canvas.height = 400;

  // Load prison bars overlay
  const barsOverlay = new Image();
  barsOverlay.src = '/prison-bars.png';

  // Handle drag and drop
  preview.addEventListener('dragover', (e) => {
      e.preventDefault();
      preview.classList.add('drag-active');
  });

  preview.addEventListener('dragleave', (e) => {
      e.preventDefault();
      preview.classList.remove('drag-active');
  });

  preview.addEventListener('drop', (e) => {
      e.preventDefault();
      preview.classList.remove('drag-active');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
          processUploadedImage(file);
      }
  });

  // Handle click to upload
  preview.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) {
          processUploadedImage(e.target.files[0]);
      }
  });

  // Handle Twitter fetch button click
  fetchTwitterBtn.addEventListener('click', fetchTwitterImage);
  
  // Also fetch when Enter is pressed in the input
  twitterInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
          fetchTwitterImage();
      }
  });

  async function fetchTwitterImage() {
    const handle = twitterInput.value.trim();
    if (handle) {
        try {
            fetchTwitterBtn.textContent = 'Loading...';
            fetchTwitterBtn.disabled = true;

            // Using twivatar as an alternative service
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.src = `https://images.weserv.nl/?url=https://unavatar.io/twitter/${handle}`;
            
            img.onload = function() {
                // Convert image to blob
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob((blob) => {
                    processUploadedImage(blob);
                });
            };

            img.onerror = function() {
                alert('Could not fetch Twitter profile picture. Make sure the handle is correct or try uploading an image.');
            };
        } catch (error) {
            console.error('Error fetching Twitter avatar:', error);
            alert('Could not fetch Twitter profile picture. Make sure the handle is correct or try uploading an image.');
        } finally {
            fetchTwitterBtn.textContent = 'Fetch';
            fetchTwitterBtn.disabled = false;
        }
    }
}
  // Handle download
  downloadBtn.addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'ponzi-mugshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
  });

  function processUploadedImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Black background
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Calculate image sizing to maintain aspect ratio
            const scale = Math.max(
                canvas.width / img.width,
                (canvas.height - 100) / img.height
            );
            
            // Center the image
            const newWidth = img.width * scale;
            const newHeight = img.height * scale;
            const x = (canvas.width - newWidth) / 2;
            const y = ((canvas.height - 100) - newHeight) / 2 + 50; // 50px down from top
            
            // Draw grayscale image
            ctx.filter = 'grayscale(100%) contrast(1.2)';
            ctx.drawImage(img, x, y, newWidth, newHeight);
            ctx.filter = 'none';

            // Draw prison bars
            ctx.drawImage(barsOverlay, 0, 0, canvas.width, canvas.height);

            // Draw department header - now after the bars
            // Black background for header text to stand out
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, 70);

            // Draw the text
            ctx.fillStyle = '#FFFFFF';
            ctx.font = 'bold 24px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('$PONZI DEPT.', canvas.width/2, 30);

            // Draw booking number
            const bookingNum = String(Math.floor(Math.random() * 900000) + 100000);
            ctx.font = 'bold 20px monospace';
            ctx.fillText(bookingNum, canvas.width/2, 60);
            
            // Hide upload overlay
            document.querySelector('.preview-overlay').style.display = 'none';

            // Add name and crime text
            updateText();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

  function updateText() {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      ctx.putImageData(imageData, 0, 0);
      
      const nameText = suspectName.value.trim();
      const crimeText = crimeCaption.value.trim();
      
      // Draw name
      if (nameText) {
          // White background for name
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(20, canvas.height - 80, canvas.width - 40, 30);
          
          ctx.fillStyle = '#000000';
          ctx.font = '12px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('NAME', 25, canvas.height - 60);
          
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(nameText.toUpperCase(), canvas.width/2, canvas.height - 60);
      }
      
      // Draw crime
      if (crimeText) {
          // White background for crime
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(20, canvas.height - 40, canvas.width - 40, 30);
          
          ctx.fillStyle = '#000000';
          ctx.font = '12px monospace';
          ctx.textAlign = 'left';
          ctx.fillText('CRIME', 25, canvas.height - 20);
          
          ctx.font = 'bold 20px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(crimeText.toUpperCase(), canvas.width/2, canvas.height - 20);
      }
  }

  // Update text when inputs change
  suspectName.addEventListener('input', updateText);
  crimeCaption.addEventListener('input', updateText);
}