// Global variables
let salaryEntries = JSON.parse(localStorage.getItem('salaryEntries')) || [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();

    // Only render salary entries if we're on the salary page
    if (document.getElementById('salaryEntries')) {
        renderSalaryEntries();
    }

    // Only show salary receipt if we're on the salary page
    if (document.getElementById('salaryReceipt')) {
        updateSalaryReceipt();
    }

    // Only show preview if we're on the fuel page
    if (document.getElementById('billPreview')) {
        updatePreview();
    }

    // Only show telecom preview if we're on the telecom page
    if (document.getElementById('billPreview') && document.getElementById('telecomForm')) {
        updateTelecomPreview();
    }

    // Only show car hire preview if we're on the car hire page
    if (document.getElementById('billPreview') && document.getElementById('carHireForm')) {
        updateCarHirePreview();
    }

    // Only show tax filing preview if we're on the tax filing page
    if (document.getElementById('billPreview') && document.getElementById('taxFilingForm')) {
        updateTaxFilingPreview();
    }

    // Only show tax calculator results if we're on the tax calculator page
    if (document.getElementById('taxResults') && document.getElementById('taxCalculatorForm')) {
        updateTaxCalculatorResults();
    }
});

// Initialize the application
function initializeApp() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];

    // Set up fuel form if it exists
    const fuelDate = document.getElementById('fuelDate');
    if (fuelDate) {
        fuelDate.value = today;
    }

    // Set up salary form if it exists
    const salaryDate = document.getElementById('salaryDate');
    if (salaryDate) {
        salaryDate.value = today;
    }

    // Set up receipt date if it exists
    const receiptDate = document.getElementById('receiptDate');
    if (receiptDate) {
        receiptDate.value = today;
    }

    // Set up salary calculation if on salary page
    if (document.getElementById('salaryAmount')) {
        setupSalaryCalculation();
    }

    // Generate initial random receipt number if on fuel page
    if (document.getElementById('receiptNumber')) {
        generateRandomReceiptNumber();
    }

    // Generate initial random bill number if on telecom page
    if (document.getElementById('billNumber')) {
        generateRandomBillNumber();
    }

    // Generate initial random invoice number if on car hire page
    if (document.getElementById('invoiceNumber')) {
        generateRandomInvoiceNumber();
    }

    // Generate initial random invoice number if on tax filing page
    if (document.getElementById('invoiceNumber') && document.getElementById('taxFilingForm')) {
        generateRandomTaxInvoiceNumber();
    }
}

// Generate random receipt number
function generateRandomReceiptNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('receiptNumber').value = randomNumber.toString().padStart(6, '0');
}

// Generate random bill number for telecom
function generateRandomBillNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('billNumber').value = 'TEL' + randomNumber.toString().padStart(6, '0');
}

// Generate random invoice number for car hire
function generateRandomInvoiceNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('invoiceNumber').value = 'CAR' + randomNumber.toString().padStart(6, '0');
}

// Generate random invoice number for tax filing
function generateRandomTaxInvoiceNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('invoiceNumber').value = 'TAX' + randomNumber.toString().padStart(6, '0');
}

// Set up event listeners
function setupEventListeners() {
    // Salary form submission
    const salaryForm = document.getElementById('salaryForm');
    if (salaryForm) {
        salaryForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveSalaryEntry();
        });
    }

    // Salary calculation listeners
    const basicSalary = document.getElementById('basicSalary');
    const allowances = document.getElementById('allowances');
    const deductions = document.getElementById('deductions');

    if (basicSalary) {
        basicSalary.addEventListener('input', calculateNetSalary);
    }
    if (allowances) {
        allowances.addEventListener('input', calculateNetSalary);
    }
    if (deductions) {
        deductions.addEventListener('input', calculateNetSalary);
    }

    // Driver salary receipt listeners
    const salaryFormInputs = document.querySelectorAll('#salaryForm input, #salaryForm select');
    salaryFormInputs.forEach(input => {
        input.addEventListener('input', updateSalaryReceipt);
        input.addEventListener('change', updateSalaryReceipt);
    });

    // Fuel calculation listeners
    const fuelAmount = document.getElementById('fuelAmount');
    const ratePerLiter = document.getElementById('ratePerLiter');

    if (fuelAmount) {
        fuelAmount.addEventListener('input', calculateFuelLiters);
    }
    if (ratePerLiter) {
        ratePerLiter.addEventListener('input', calculateFuelLiters);
    }

    // Real-time preview updates
    const fuelFormInputs = document.querySelectorAll('#fuelForm input, #fuelForm select');
    fuelFormInputs.forEach(input => {
        input.addEventListener('input', updatePreview);
        input.addEventListener('change', updatePreview);
    });

    // Telecom form event listeners
    const telecomFormInputs = document.querySelectorAll('#telecomForm input, #telecomForm select');
    telecomFormInputs.forEach(input => {
        input.addEventListener('input', updateTelecomPreview);
        input.addEventListener('change', updateTelecomPreview);
    });

    // Telecom calculation listeners
    const billAmount = document.getElementById('billAmount');
    if (billAmount) {
        billAmount.addEventListener('input', calculateTelecomAmounts);
    }

    // Car hire form event listeners
    const carHireFormInputs = document.querySelectorAll('#carHireForm input, #carHireForm select');
    carHireFormInputs.forEach(input => {
        input.addEventListener('input', updateCarHirePreview);
        input.addEventListener('change', updateCarHirePreview);
    });

    // Car hire calculation listeners
    const rentalDate = document.getElementById('rentalDate');
    const returnDate = document.getElementById('returnDate');
    const dailyRate = document.getElementById('dailyRate');

    if (rentalDate) {
        rentalDate.addEventListener('change', calculateCarHireAmounts);
    }
    if (returnDate) {
        returnDate.addEventListener('change', calculateCarHireAmounts);
    }
    if (dailyRate) {
        dailyRate.addEventListener('input', calculateCarHireAmounts);
    }

    // Tax filing form event listeners
    const taxFilingFormInputs = document.querySelectorAll('#taxFilingForm input, #taxFilingForm select, #taxFilingForm textarea');
    taxFilingFormInputs.forEach(input => {
        input.addEventListener('input', updateTaxFilingPreview);
        input.addEventListener('change', updateTaxFilingPreview);
    });

    // Tax filing calculation listeners
    const consultationHours = document.getElementById('consultationHours');
    const hourlyRate = document.getElementById('hourlyRate');

    if (consultationHours) {
        consultationHours.addEventListener('input', calculateTaxFilingAmounts);
    }
    if (hourlyRate) {
        hourlyRate.addEventListener('input', calculateTaxFilingAmounts);
    }

    // Tax calculator form event listeners
    const taxCalculatorFormInputs = document.querySelectorAll('#taxCalculatorForm input, #taxCalculatorForm select');
    taxCalculatorFormInputs.forEach(input => {
        input.addEventListener('input', updateTaxCalculatorResults);
        input.addEventListener('change', updateTaxCalculatorResults);
    });

    // Tax type change listener
    const taxType = document.getElementById('taxType');
    if (taxType) {
        taxType.addEventListener('change', toggleTaxSections);
    }
}

// Tab navigation
function showTab(tabName) {
    // Hide all tab panes
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));

    // Remove active class from all tab buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => btn.classList.remove('active'));

    // Show selected tab pane
    document.getElementById(tabName).classList.add('active');

    // Add active class to the corresponding tab button
    const activeButton = document.querySelector(`[onclick="showTab('${tabName}')"]`);
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Driver Salary Functions
function addSalaryEntry() {
    // Scroll to form
    document.getElementById('salaryForm').scrollIntoView({ behavior: 'smooth' });
}

function setupSalaryCalculation() {
    updateSalaryReceipt();
}

function saveSalaryEntry() {
    updateSalaryReceipt();
    showMessage('Salary receipt generated successfully!', 'success');
}

function clearSalaryForm() {
    document.getElementById('salaryForm').reset();
    document.getElementById('receiptDate').value = new Date().toISOString().split('T')[0];
    updateSalaryReceipt();
}

function updateSalaryReceipt() {
    const formData = getSalaryFormData();
    const receiptHtml = generateSalaryReceipt(formData);
    document.getElementById('salaryReceipt').innerHTML = receiptHtml;
}

function getSalaryFormData() {
    return {
        employerName: document.getElementById('employerName').value || 'Employer Name',
        driverName: document.getElementById('driverName').value || 'Driver Name',
        dlNumber: document.getElementById('dlNumber').value || 'DL Number',
        carNumber: document.getElementById('carNumber').value || 'Car Number',
        monthYear: document.getElementById('monthYear').value || 'Month Year',
        salaryAmount: parseFloat(document.getElementById('salaryAmount').value) || 0,
        receiptDate: document.getElementById('receiptDate').value || new Date().toISOString().split('T')[0]
    };
}

function generateSalaryReceipt(data) {
    return `
        <div class="bill-header" style="text-decoration: underline; margin-bottom: 20px;">DRIVER SALARY RECEIPT</div>
        
        <div class="bill-section" style="margin-bottom: 20px;">
            <div class="bill-row" style="text-align: justify; line-height: 1.6;">
                <span>Received with thanks from <strong>${data.driverName}</strong> INR <strong>₹${data.salaryAmount.toFixed(2)}</strong> cash as a remuneration for Driving Car No. <strong>${data.carNumber}</strong> for the month of <strong>${data.monthYear}</strong>.</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-row">
                <span class="bill-label">Name:</span>
                <span class="bill-value">${data.driverName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">DL No:</span>
                <span class="bill-value">${data.dlNumber}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Date:</span>
                <span class="bill-value">${formatDate(data.receiptDate)}</span>
            </div>
        </div>
        
        <div class="bill-footer" style="margin-top: 30px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-end;">
                <div style="text-align: center;">
                    <p style="margin-bottom: 10px;">Sign of Driver</p>
                    <img src="sign.jpg" alt="Driver Signature" style="max-width: 150px; max-height: 60px; object-fit: contain;" onerror="this.style.display='none'" onload="this.style.display='block'">
                    <div style="border-bottom: 1px solid #000; width: 150px; height: 1px; margin-top: 5px;"></div>
                </div>
                <div style="text-align: center;">
                    <p style="margin-bottom: 10px;">Affix Revenue Stamp</p>
                    <img src="revenueStamp.jpg" alt="Revenue Stamp" style="max-width: 80px; max-height: 60px; object-fit: contain;" onerror="this.style.display='none'" onload="this.style.display='block'">
                    <div style="border: 1px solid #000; width: 80px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 8px; margin-top: 5px;">STAMP</div>
                </div>
            </div>
        </div>
    `;
}

function deleteSalaryEntry(id) {
    if (confirm('Are you sure you want to delete this salary entry?')) {
        salaryEntries = salaryEntries.filter(entry => entry.id !== id);
        localStorage.setItem('salaryEntries', JSON.stringify(salaryEntries));
        renderSalaryEntries();
        showMessage('Salary entry deleted successfully!', 'success');
    }
}

function renderSalaryEntries() {
    const container = document.getElementById('salaryEntries');

    if (salaryEntries.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-tie"></i>
                <h3>No Salary Entries</h3>
                <p>Add your first salary entry to get started.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = salaryEntries.map(entry => `
        <div class="entry-card">
            <div class="entry-header">
                <div class="entry-title">${entry.driverName}</div>
                <div class="entry-date">${formatDate(entry.date)}</div>
            </div>
            <div class="entry-details">
                <div class="entry-detail">
                    <div class="entry-detail-label">Basic Salary</div>
                    <div class="entry-detail-value">₹${entry.basicSalary.toFixed(2)}</div>
                </div>
                <div class="entry-detail">
                    <div class="entry-detail-label">Allowances</div>
                    <div class="entry-detail-value">₹${entry.allowances.toFixed(2)}</div>
                </div>
                <div class="entry-detail">
                    <div class="entry-detail-label">Deductions</div>
                    <div class="entry-detail-value">₹${entry.deductions.toFixed(2)}</div>
                </div>
                <div class="entry-detail">
                    <div class="entry-detail-label">Net Salary</div>
                    <div class="entry-detail-value">₹${entry.netSalary.toFixed(2)}</div>
                </div>
            </div>
            ${entry.notes ? `<div class="entry-notes">${entry.notes}</div>` : ''}
            <div class="entry-actions">
                <button class="btn btn-danger btn-small" onclick="deleteSalaryEntry(${entry.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `).join('');
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;

    // Insert at the top of the page content
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(messageDiv, container.firstChild);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Fuel calculation function
function calculateFuelLiters() {
    const amount = parseFloat(document.getElementById('fuelAmount').value) || 0;
    const rate = parseFloat(document.getElementById('ratePerLiter').value) || 0;

    if (rate > 0) {
        const litres = amount / rate;
        document.getElementById('fuelLiters').value = litres.toFixed(2);
    } else {
        document.getElementById('fuelLiters').value = '';
    }
}

// Preview Functions
function previewFuelBill() {
    const formData = getFuelFormData();
    if (!formData) return;

    const previewHtml = generateBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
    document.getElementById('previewSection').style.display = 'block';

    // Scroll to preview
    document.getElementById('previewSection').scrollIntoView({ behavior: 'smooth' });
}

function getFuelFormData() {
    const amount = parseFloat(document.getElementById('fuelAmount').value) || 0;
    const rate = parseFloat(document.getElementById('ratePerLiter').value) || 0;

    // Return default data even when form is empty
    return {
        station: document.getElementById('fuelStation').value || 'BP FUEL STATION',
        address: document.getElementById('fuelAddress').value || '123 Main Street, City, State',
        cstNumber: document.getElementById('cstNumber').value || 'CST123456789',
        telNumber: document.getElementById('telNumber').value || '+91 98765 43210',
        receiptNumber: document.getElementById('receiptNumber').value,
        nozzleNumber: document.getElementById('nozzleNumber').value || '1',
        product: document.getElementById('product').value || 'Petrol',
        ratePerLiter: rate || 96.76,
        amount: amount || 500.00,
        liters: rate > 0 ? amount / rate : (amount || 500.00) / (rate || 96.76),
        vehicleType: document.getElementById('vehicleType').value || 'Car',
        vehicleNumber: document.getElementById('vehicleNumber').value || 'N/A',
        customerName: document.getElementById('customerName').value || 'N/A',
        date: document.getElementById('fuelDate').value || new Date().toISOString().split('T')[0],
        paymentMode: document.getElementById('paymentMode').value || 'Cash',
        attendantId: document.getElementById('attendantId').value || 'not available'
    };
}

function generateBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="BP Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.station.toUpperCase()}</div>
        <div class="bill-subheader">${data.address}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">FUEL RECEIPT</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Receipt No:</span>
                    <span class="bill-value">${data.receiptNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Date:</span>
                    <span class="bill-value">${formatDate(data.date)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Time:</span>
                    <span class="bill-value">${new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Nozzle:</span>
                    <span class="bill-value">${data.nozzleNumber}</span>
                </div>
            </div>
            <div class="bill-detail-right">
                <div class="bill-row">
                    <span class="bill-label">CST No:</span>
                    <span class="bill-value">${data.cstNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Tel:</span>
                    <span class="bill-value">${data.telNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Product:</span>
                    <span class="bill-value">${data.product}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Mode:</span>
                    <span class="bill-value">${data.paymentMode}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">VEHICLE DETAILS:</div>
            <div class="bill-row">
                <span class="bill-label">Vehicle Type:</span>
                <span class="bill-value">${data.vehicleType}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Vehicle No:</span>
                <span class="bill-value">${data.vehicleNumber}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Customer:</span>
                <span class="bill-value">${data.customerName}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">FUEL DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Rate/L</span>
                    <span class="bill-table-col">Amount</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.product}</span>
                    <span class="bill-table-col">₹${data.ratePerLiter.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.amount.toFixed(2)}</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">Volume: ${data.liters.toFixed(2)} L</span>
                    <span class="bill-table-col"></span>
                    <span class="bill-table-col"></span>
                </div>
            </div>
        </div>
        
        <div class="bill-total">
            <div class="bill-total-line"></div>
            <div class="bill-row">
                <span class="bill-label">TOTAL AMOUNT:</span>
                <span class="bill-value">₹${data.amount.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank You! Visit Again</p>
            <p>Save Fuel, Save Money</p>
            <p>For queries/complaints call: 1800 226344 (Toll-Free)</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Attendant ID: ${data.attendantId}</span>
            <span class="bill-bottom-right">Generated: ${new Date().toLocaleString('en-IN')}</span>
        </div>
    `;
}

async function downloadPreviewPDF() {
    const formData = getFuelFormData();
    if (!formData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    try {
        // Add logo with better error handling
        const logo = new Image();
        logo.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            logo.onload = () => {
                try {
                    // Calculate logo dimensions to fit properly
                    const maxWidth = 50;
                    const maxHeight = 35;
                    let logoWidth = logo.width;
                    let logoHeight = logo.height;

                    // Scale down if too large
                    if (logoWidth > maxWidth || logoHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / logoWidth, maxHeight / logoHeight);
                        logoWidth *= ratio;
                        logoHeight *= ratio;
                    }

                    // Center the logo above the station name
                    const logoX = 25 ;
                    const logoY = 15; // Position logo above station name
                    doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);
                    resolve();
                } catch (error) {
                    console.log('Error adding logo to PDF:', error);
                    resolve();
                }
            };
            logo.onerror = () => {
                console.log('Logo not found or CORS blocked, continuing without logo');
                resolve();
            };

            logo.src = 'logo.jpeg';
        });
    } catch (error) {
        console.log('Error loading logo:', error);
    }

    // Station header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.station.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.address, pageWidth/2, 70, { align: 'center' });

    // Receipt details in a structured format
    let yPos = 85;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;

    // Add a line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos - 5, rightMargin, yPos - 5);

    // Receipt header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('FUEL RECEIPT', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Receipt details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Receipt No: ${formData.receiptNumber}`, leftMargin, yPos);
    doc.text(`Date: ${formatDate(formData.date)}`, leftMargin, yPos + 8);
    doc.text(`Time: ${new Date().toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'})}`, leftMargin, yPos + 16);
    doc.text(`Nozzle: ${formData.nozzleNumber}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`CST No: ${formData.cstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Tel: ${formData.telNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Product: ${formData.product}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Mode: ${formData.paymentMode}`, rightMargin - 60, yPos + 24, { align: 'right' });

    yPos += 35;

    // Vehicle and customer details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('VEHICLE DETAILS:', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Vehicle Type: ${formData.vehicleType}`, leftMargin, yPos);
    doc.text(`Vehicle No: ${formData.vehicleNumber}`, leftMargin, yPos + 8);
    doc.text(`Customer: ${formData.customerName}`, leftMargin, yPos + 16);

    yPos += 30;

    // Fuel details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FUEL DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = rightMargin - 40;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Rate/L', col2, tableY);
    doc.text('Amount', col3, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.product}`, col1, yPos);
    doc.text(`₹${formData.ratePerLiter.toFixed(2)}`, col2, yPos);
    doc.text(`₹${formData.amount.toFixed(2)}`, col3, yPos, { align: 'right' });

    yPos += 8;
    doc.text(`Volume: ${formData.liters.toFixed(2)} L`, col1, yPos);

    yPos += 15;

    // Total section
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', leftMargin, yPos);
    doc.text(`₹${formData.amount.toFixed(2)}`, rightMargin, yPos, { align: 'right' });

    yPos += 15;

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank You! Visit Again', pageWidth/2, yPos, { align: 'center' });
    doc.text('Save Fuel, Save Money', pageWidth/2, yPos + 6, { align: 'center' });
    doc.text('YOU CAN NOW CALL US ON 1800 226344 (TOLL-FREE) FOR QUERIES/COMPLAINTS.', pageWidth/2, yPos + 12, { align: 'center' });

    // Add attendant info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Attendant ID: ${formData.attendantId}`, leftMargin, yPos);
    doc.text(`Generated: ${new Date().toLocaleString('en-IN')}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`fuel-receipt-${formData.receiptNumber}.pdf`);
    showMessage('Fuel receipt downloaded successfully!', 'success');
}

// Real-time preview update
function updatePreview() {
    const formData = getFuelFormData();
    const previewHtml = generateBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Telecom form data collection
function getTelecomFormData() {
    const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;

    // Return default data even when form is empty
    return {
        serviceProvider: document.getElementById('serviceProvider').value || 'AIRTEL TELECOM',
        providerAddress: document.getElementById('providerAddress').value || '123 Telecom Street, City, State',
        gstNumber: document.getElementById('gstNumber').value || 'GST123456789',
        contactNumber: document.getElementById('contactNumber').value || '+91 98765 43210',
        billNumber: document.getElementById('billNumber').value,
        accountNumber: document.getElementById('accountNumber').value || 'ACC123456789',
        serviceType: document.getElementById('serviceType').value || 'Mobile',
        planName: document.getElementById('planName').value || 'Premium Plan',
        billAmount: billAmount || 500.00,
        gstAmount: billAmount * 0.18 || 90.00,
        totalAmount: billAmount * 1.18 || 590.00,
        dueDate: document.getElementById('dueDate').value || new Date().toISOString().split('T')[0],
        customerName: document.getElementById('customerName').value || 'John Doe',
        customerAddress: document.getElementById('customerAddress').value || '456 Customer Street, City, State',
        billingPeriod: document.getElementById('billingPeriod').value || 'Jan 2024',
        paymentMode: document.getElementById('paymentMode').value || 'Online'
    };
}

// Telecom preview update
function updateTelecomPreview() {
    const formData = getTelecomFormData();
    const previewHtml = generateTelecomBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate telecom bill preview
function generateTelecomBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="Telecom Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.serviceProvider.toUpperCase()}</div>
        <div class="bill-subheader">${data.providerAddress}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">TELECOM BILL</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Bill No:</span>
                    <span class="bill-value">${data.billNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Account No:</span>
                    <span class="bill-value">${data.accountNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Service Type:</span>
                    <span class="bill-value">${data.serviceType}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Plan Name:</span>
                    <span class="bill-value">${data.planName}</span>
                </div>
            </div>
            <div class="bill-detail-right">
                <div class="bill-row">
                    <span class="bill-label">GST No:</span>
                    <span class="bill-value">${data.gstNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Contact:</span>
                    <span class="bill-value">${data.contactNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Due Date:</span>
                    <span class="bill-value">${formatDate(data.dueDate)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Payment Mode:</span>
                    <span class="bill-value">${data.paymentMode}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">CUSTOMER DETAILS:</div>
            <div class="bill-row">
                <span class="bill-label">Customer Name:</span>
                <span class="bill-value">${data.customerName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Customer Address:</span>
                <span class="bill-value">${data.customerAddress}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Billing Period:</span>
                <span class="bill-value">${data.billingPeriod}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">BILL DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Amount</span>
                    <span class="bill-table-col">Total</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.serviceType} Service</span>
                    <span class="bill-table-col">₹${data.billAmount.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.billAmount.toFixed(2)}</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">GST (18%)</span>
                    <span class="bill-table-col">₹${data.gstAmount.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.gstAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-total">
            <div class="bill-total-line"></div>
            <div class="bill-row">
                <span class="bill-label">TOTAL AMOUNT:</span>
                <span class="bill-value">₹${data.totalAmount.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank You! Visit Again</p>
            <p>For queries call: ${data.contactNumber}</p>
            <p>Pay before due date to avoid late fees</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Generated: ${new Date().toLocaleString('en-IN')}</span>
            <span class="bill-bottom-right">Due Date: ${formatDate(data.dueDate)}</span>
        </div>
    `;
}

function clearFuelForm() {
    document.getElementById('fuelForm').reset();
    document.getElementById('fuelDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('nozzleNumber').value = '1';
    document.getElementById('product').value = 'Petrol';
    document.getElementById('vehicleType').value = 'Car';
    document.getElementById('paymentMode').value = 'Cash';
    document.getElementById('vehicleNumber').value = 'N/A';
    document.getElementById('customerName').value = 'N/A';
    document.getElementById('attendantId').value = 'not available';
    document.getElementById('fuelLiters').value = '';

    // Generate new random receipt number
    generateRandomReceiptNumber();

    // Show preview with default values
    updatePreview();
}

function clearTelecomForm() {
    document.getElementById('telecomForm').reset();
    document.getElementById('dueDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('serviceType').value = 'Mobile';
    document.getElementById('paymentMode').value = 'Online';
    document.getElementById('gstAmount').value = '';
    document.getElementById('totalAmount').value = '';

    // Generate new random bill number
    generateRandomBillNumber();

    // Show preview with default values
    updateTelecomPreview();
}

function clearCarHireForm() {
    document.getElementById('carHireForm').reset();
    document.getElementById('rentalDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('returnDate').value = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    document.getElementById('vehicleType').value = 'Sedan';
    document.getElementById('paymentMode').value = 'Cash';
    document.getElementById('driverName').value = 'Self';
    document.getElementById('licenseNumber').value = 'N/A';
    document.getElementById('numberOfDays').value = '';
    document.getElementById('subtotal').value = '';
    document.getElementById('gstAmount').value = '';
    document.getElementById('totalAmount').value = '';

    // Generate new random invoice number
    generateRandomInvoiceNumber();

    // Show preview with default values
    updateCarHirePreview();
}

function clearTaxFilingForm() {
    document.getElementById('taxFilingForm').reset();
    document.getElementById('serviceDate').value = new Date().toISOString().split('T')[0];
    document.getElementById('serviceType').value = 'Income Tax Filing';
    document.getElementById('paymentMode').value = 'Online';
    document.getElementById('panNumber').value = 'N/A';
    document.getElementById('aadharNumber').value = 'N/A';
    document.getElementById('subtotal').value = '';
    document.getElementById('gstAmount').value = '';
    document.getElementById('totalAmount').value = '';

    // Generate new random invoice number
    generateRandomTaxInvoiceNumber();

    // Show preview with default values
    updateTaxFilingPreview();
}

// Export functions for global access
window.clearFuelForm = clearFuelForm;
window.addSalaryEntry = addSalaryEntry;
window.saveSalaryEntry = saveSalaryEntry;
window.clearSalaryForm = clearSalaryForm;
window.deleteSalaryEntry = deleteSalaryEntry;
window.downloadSalaryPDF = downloadSalaryPDF;
window.downloadPreviewPDF = downloadPreviewPDF;
window.clearTelecomForm = clearTelecomForm;
window.downloadTelecomPreviewPDF = downloadTelecomPreviewPDF;
window.clearCarHireForm = clearCarHireForm;
window.downloadCarHirePreviewPDF = downloadCarHirePreviewPDF;
window.clearTaxFilingForm = clearTaxFilingForm;
window.downloadTaxFilingPreviewPDF = downloadTaxFilingPreviewPDF;

async function downloadSalaryPDF() {
    const formData = getSalaryFormData();
    if (!formData || formData.driverName === 'Driver Name') {
        showMessage('Please fill in the form first before downloading the receipt.', 'error');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    generateSalaryReceiptPDF(doc, formData);
    doc.save(`driver-salary-receipt-${formData.driverName}-${new Date().toISOString().split('T')[0]}.pdf`);
}

function generateSalaryReceiptPDF(doc, data) {
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('DRIVER SALARY RECEIPT', pageWidth/2, 30, { align: 'center' });

    // Add underline
    const textWidth = doc.getTextWidth('DRIVER SALARY RECEIPT');
    doc.setLineWidth(0.5);
    doc.line((pageWidth - textWidth) / 2, 35, (pageWidth + textWidth) / 2, 35);

    // Receipt text
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const receiptText = `Received with thanks from ${data.employerName} INR ₹${data.salaryAmount.toFixed(2)} cash as a remuneration for Driving Car No. ${data.carNumber} for the month of ${data.monthYear}.`;

    // Split text into lines that fit the page width
    // const maxWidth = pageWidth - 40;
    // const lines = doc.splitTextToSize(receiptText, maxWidth);
    // let yPos = 60;
    //
    // lines.forEach(line => {
    //     doc.text(line, 20, yPos);
    //     yPos += 8;
    // });

    yPos += 20;

    // Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`Name: ${data.driverName}`, 20, yPos);
    yPos += 12;
    doc.text(`DL No: ${data.dlNumber}`, 20, yPos);
    yPos += 12;
    doc.text(`Date: ${formatDate(data.receiptDate)}`, 20, yPos);

    yPos += 30;

    // Signature and stamp area
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Driver signature
    doc.text('Sign of Driver', 20, yPos);

    // Add sign image
    const signImg = new Image();
    signImg.src = 'sign.jpg';
    signImg.onload = function() {
        try {
            doc.addImage(signImg, 'JPEG', 20, yPos + 5, 60, 30);
        } catch (e) {
            console.log('Sign image loading failed:', e);
        }
    };
    signImg.onerror = function() {
        console.log('Sign image not found');
    };

    doc.setLineWidth(0.5);
    doc.line(20, yPos + 40, 100, yPos + 40);

    // Revenue stamp
    doc.text('Affix Revenue Stamp', pageWidth - 60, yPos);

    // Add revenue stamp image
    const stampImg = new Image();
    stampImg.src = 'revenueStamp.jpg';
    stampImg.onload = function() {
        try {
            doc.addImage(stampImg, 'JPEG', pageWidth - 80, yPos + 5, 40, 30);
        } catch (e) {
            console.log('Stamp image loading failed:', e);
        }
    };
    stampImg.onerror = function() {
        console.log('Stamp image not found');
    };

    // doc.rect(pageWidth - 80, yPos + 10, 40, 30);
    // doc.setFontSize(8);
    // doc.text('STAMP', pageWidth - 60, yPos + 25, { align: 'center' });
}

async function downloadTelecomPreviewPDF() {
    const formData = getTelecomFormData();
    if (!formData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    try {
        // Add logo with better error handling
        const logo = new Image();
        logo.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            logo.onload = () => {
                try {
                    // Calculate logo dimensions to fit properly
                    const maxWidth = 50;
                    const maxHeight = 35;
                    let logoWidth = logo.width;
                    let logoHeight = logo.height;

                    // Scale down if too large
                    if (logoWidth > maxWidth || logoHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / logoWidth, maxHeight / logoHeight);
                        logoWidth *= ratio;
                        logoHeight *= ratio;
                    }

                    // Center the logo above the service provider name
                    const logoX = 25;
                    const logoY = 15;
                    doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);
                    resolve();
                } catch (error) {
                    console.log('Error adding logo to PDF:', error);
                    resolve();
                }
            };
            logo.onerror = () => {
                console.log('Logo not found or CORS blocked, continuing without logo');
                resolve();
            };

            logo.src = 'logo.jpeg';
        });
    } catch (error) {
        console.log('Error loading logo:', error);
    }

    // Service provider header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.serviceProvider.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.providerAddress, pageWidth/2, 70, { align: 'center' });

    // Bill details in a structured format
    let yPos = 85;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;

    // Add a line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos - 5, rightMargin, yPos - 5);

    // Bill header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TELECOM BILL', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Bill details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Bill No: ${formData.billNumber}`, leftMargin, yPos);
    doc.text(`Account No: ${formData.accountNumber}`, leftMargin, yPos + 8);
    doc.text(`Service Type: ${formData.serviceType}`, leftMargin, yPos + 16);
    doc.text(`Plan Name: ${formData.planName}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`GST No: ${formData.gstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Contact: ${formData.contactNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Due Date: ${formatDate(formData.dueDate)}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Payment Mode: ${formData.paymentMode}`, rightMargin - 60, yPos + 24, { align: 'right' });

    yPos += 35;

    // Customer details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS:', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Customer Name: ${formData.customerName}`, leftMargin, yPos);
    doc.text(`Customer Address: ${formData.customerAddress}`, leftMargin, yPos + 8);
    doc.text(`Billing Period: ${formData.billingPeriod}`, leftMargin, yPos + 16);

    yPos += 30;

    // Bill details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('BILL DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = rightMargin - 40;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Amount', col2, tableY);
    doc.text('Total', col3, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.serviceType} Service`, col1, yPos);
    doc.text(`₹${formData.billAmount.toFixed(2)}`, col2, yPos);
    doc.text(`₹${formData.billAmount.toFixed(2)}`, col3, yPos, { align: 'right' });

    yPos += 8;
    doc.text(`GST (18%)`, col1, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col2, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col3, yPos, { align: 'right' });

    yPos += 15;

    // Total section
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', leftMargin, yPos);
    doc.text(`₹${formData.totalAmount.toFixed(2)}`, rightMargin, yPos, { align: 'right' });

    yPos += 15;

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank You! Visit Again', pageWidth/2, yPos, { align: 'center' });
    doc.text(`For queries call: ${formData.contactNumber}`, pageWidth/2, yPos + 6, { align: 'center' });
    doc.text('Pay before due date to avoid late fees', pageWidth/2, yPos + 12, { align: 'center' });

    // Add generation info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, leftMargin, yPos);
    doc.text(`Due Date: ${formatDate(formData.dueDate)}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`telecom-bill-${formData.billNumber}.pdf`);
    showMessage('Telecom bill downloaded successfully!', 'success');
}

async function downloadCarHirePreviewPDF() {
    const formData = getCarHireFormData();
    if (!formData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    try {
        // Add logo with better error handling
        const logo = new Image();
        logo.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            logo.onload = () => {
                try {
                    // Calculate logo dimensions to fit properly
                    const maxWidth = 50;
                    const maxHeight = 35;
                    let logoWidth = logo.width;
                    let logoHeight = logo.height;

                    // Scale down if too large
                    if (logoWidth > maxWidth || logoHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / logoWidth, maxHeight / logoHeight);
                        logoWidth *= ratio;
                        logoHeight *= ratio;
                    }

                    // Center the logo above the rental company name
                    const logoX = 25;
                    const logoY = 15;
                    doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);
                    resolve();
                } catch (error) {
                    console.log('Error adding logo to PDF:', error);
                    resolve();
                }
            };
            logo.onerror = () => {
                console.log('Logo not found or CORS blocked, continuing without logo');
                resolve();
            };

            logo.src = 'logo.jpeg';
        });
    } catch (error) {
        console.log('Error loading logo:', error);
    }

    // Rental company header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.rentalCompany.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.companyAddress, pageWidth/2, 70, { align: 'center' });

    // Invoice details in a structured format
    let yPos = 85;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;

    // Add a line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos - 5, rightMargin, yPos - 5);

    // Invoice header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CAR HIRE INVOICE', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Invoice details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Invoice No: ${formData.invoiceNumber}`, leftMargin, yPos);
    doc.text(`Vehicle No: ${formData.vehicleNumber}`, leftMargin, yPos + 8);
    doc.text(`Vehicle Model: ${formData.vehicleModel}`, leftMargin, yPos + 16);
    doc.text(`Vehicle Type: ${formData.vehicleType}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`GST No: ${formData.gstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Contact: ${formData.contactNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Rental Date: ${formatDate(formData.rentalDate)}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Return Date: ${formatDate(formData.returnDate)}`, rightMargin - 60, yPos + 24, { align: 'right' });

    yPos += 35;

    // Customer details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CUSTOMER DETAILS:', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Customer Name: ${formData.customerName}`, leftMargin, yPos);
    doc.text(`Customer Address: ${formData.customerAddress}`, leftMargin, yPos + 8);
    doc.text(`Driver Name: ${formData.driverName}`, leftMargin, yPos + 16);
    doc.text(`License No: ${formData.licenseNumber}`, leftMargin, yPos + 24);

    yPos += 30;

    // Rental details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('RENTAL DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = leftMargin + 120; // Added for Days
    const col4 = rightMargin - 40; // Added for Amount

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Rate/Day', col2, tableY);
    doc.text('Days', col3, tableY);
    doc.text('Amount', col4, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.vehicleType} Rental`, col1, yPos);
    doc.text(`₹${formData.dailyRate.toFixed(2)}`, col2, yPos);
    doc.text(`${formData.numberOfDays}`, col3, yPos);
    doc.text(`₹${formData.subtotal.toFixed(2)}`, col4, yPos, { align: 'right' });

    yPos += 8;
    doc.text(`GST (18%)`, col1, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col4, yPos, { align: 'right' });

    yPos += 15;

    // Total section
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', leftMargin, yPos);
    doc.text(`₹${formData.totalAmount.toFixed(2)}`, rightMargin, yPos, { align: 'right' });

    yPos += 15;

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank You! Visit Again', pageWidth/2, yPos, { align: 'center' });
    doc.text(`For queries call: ${formData.contactNumber}`, pageWidth/2, yPos + 6, { align: 'center' });
    doc.text('Safe driving! Return vehicle in good condition', pageWidth/2, yPos + 12, { align: 'center' });

    // Add generation info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, leftMargin, yPos);
    doc.text(`Payment Mode: ${formData.paymentMode}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`car-hire-invoice-${formData.invoiceNumber}.pdf`);
    showMessage('Car hire invoice downloaded successfully!', 'success');
}

async function downloadTaxFilingPreviewPDF() {
    const formData = getTaxFilingFormData();
    if (!formData) return;

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set page dimensions
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    try {
        // Add logo with better error handling
        const logo = new Image();
        logo.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
            logo.onload = () => {
                try {
                    // Calculate logo dimensions to fit properly
                    const maxWidth = 50;
                    const maxHeight = 35;
                    let logoWidth = logo.width;
                    let logoHeight = logo.height;

                    // Scale down if too large
                    if (logoWidth > maxWidth || logoHeight > maxHeight) {
                        const ratio = Math.min(maxWidth / logoWidth, maxHeight / logoHeight);
                        logoWidth *= ratio;
                        logoHeight *= ratio;
                    }

                    // Center the logo above the consultant name
                    const logoX = 25;
                    const logoY = 15;
                    doc.addImage(logo, 'JPEG', logoX, logoY, logoWidth, logoHeight);
                    resolve();
                } catch (error) {
                    console.log('Error adding logo to PDF:', error);
                    resolve();
                }
            };
            logo.onerror = () => {
                console.log('Logo not found or CORS blocked, continuing without logo');
                resolve();
            };

            logo.src = 'logo.jpeg';
        });
    } catch (error) {
        console.log('Error loading logo:', error);
    }

    // Consultant header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(formData.consultantName.toUpperCase(), pageWidth/2, 60, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.consultantAddress, pageWidth/2, 70, { align: 'center' });

    // Invoice details in a structured format
    let yPos = 85;
    const leftMargin = 20;
    const rightMargin = pageWidth - 20;

    // Add a line separator
    doc.setDrawColor(0);
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos - 5, rightMargin, yPos - 5);

    // Invoice header
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TAX CONSULTATION INVOICE', pageWidth/2, yPos, { align: 'center' });
    yPos += 15;

    // Invoice details in two columns
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    // Left column
    doc.text(`Invoice No: ${formData.invoiceNumber}`, leftMargin, yPos);
    doc.text(`Service Date: ${formatDate(formData.serviceDate)}`, leftMargin, yPos + 8);
    doc.text(`Service Type: ${formData.serviceType}`, leftMargin, yPos + 16);
    doc.text(`Assessment Year: ${formData.assessmentYear}`, leftMargin, yPos + 24);

    // Right column
    doc.text(`GST No: ${formData.gstNumber}`, rightMargin - 60, yPos, { align: 'right' });
    doc.text(`Contact: ${formData.contactNumber}`, rightMargin - 60, yPos + 8, { align: 'right' });
    doc.text(`Hours: ${formData.consultationHours}`, rightMargin - 60, yPos + 16, { align: 'right' });
    doc.text(`Rate/Hour: ₹${formData.hourlyRate.toFixed(2)}`, rightMargin - 60, yPos + 24, { align: 'right' });

    yPos += 35;

    // Client details
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('CLIENT DETAILS:', leftMargin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client Name: ${formData.clientName}`, leftMargin, yPos);
    doc.text(`Client Address: ${formData.clientAddress}`, leftMargin, yPos + 8);
    doc.text(`PAN Number: ${formData.panNumber}`, leftMargin, yPos + 16);
    doc.text(`Aadhar Number: ${formData.aadharNumber}`, leftMargin, yPos + 24);

    yPos += 30;

    // Service details in a table format
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('SERVICE DETAILS:', leftMargin, yPos);
    yPos += 8;

    // Add a table-like structure
    const tableY = yPos;
    const col1 = leftMargin;
    const col2 = leftMargin + 80;
    const col3 = leftMargin + 120; // Added for Hours
    const col4 = rightMargin - 40; // Added for Amount

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Item', col1, tableY);
    doc.text('Hours', col2, tableY);
    doc.text('Rate/Hour', col3, tableY);
    doc.text('Amount', col4, tableY, { align: 'right' });

    yPos += 8;
    doc.setLineWidth(0.2);
    doc.line(leftMargin, yPos - 2, rightMargin, yPos - 2);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.serviceType}`, col1, yPos);
    doc.text(`${formData.consultationHours}`, col2, yPos);
    doc.text(`₹${formData.hourlyRate.toFixed(2)}`, col3, yPos);
    doc.text(`₹${formData.subtotal.toFixed(2)}`, col4, yPos, { align: 'right' });

    yPos += 8;
    doc.text(`GST (18%)`, col1, yPos);
    doc.text(`₹${formData.gstAmount.toFixed(2)}`, col4, yPos, { align: 'right' });

    yPos += 15;

    // Total section
    doc.setLineWidth(0.5);
    doc.line(leftMargin, yPos, rightMargin, yPos);
    yPos += 8;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT:', leftMargin, yPos);
    doc.text(`₹${formData.totalAmount.toFixed(2)}`, rightMargin, yPos, { align: 'right' });

    yPos += 15;

    // Footer
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Thank You! Visit Again', pageWidth/2, yPos, { align: 'center' });
    doc.text(`For queries call: ${formData.contactNumber}`, pageWidth/2, yPos + 6, { align: 'center' });
    doc.text('Professional tax services with complete confidentiality', pageWidth/2, yPos + 12, { align: 'center' });

    // Add generation info at bottom
    yPos += 25;
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, leftMargin, yPos);
    doc.text(`Payment Mode: ${formData.paymentMode}`, rightMargin, yPos, { align: 'right' });

    // Save the PDF
    doc.save(`tax-consultation-invoice-${formData.invoiceNumber}.pdf`);
    showMessage('Tax consultation invoice downloaded successfully!', 'success');
}

// Telecom calculation function
function calculateTelecomAmounts() {
    const billAmount = parseFloat(document.getElementById('billAmount').value) || 0;
    const gstRate = 0.18; // 18% GST
    const gstAmount = billAmount * gstRate;
    const totalAmount = billAmount + gstAmount;

    document.getElementById('gstAmount').value = gstAmount.toFixed(2);
    document.getElementById('totalAmount').value = totalAmount.toFixed(2);
}

// Car hire form data collection
function getCarHireFormData() {
    const rentalDate = new Date(document.getElementById('rentalDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    const dailyRate = parseFloat(document.getElementById('dailyRate').value) || 0;

    let numberOfDays = 0;
    let subtotal = 0;
    let gstAmount = 0;
    let totalAmount = 0;

    if (rentalDate && returnDate && returnDate >= rentalDate) {
        const timeDiff = returnDate.getTime() - rentalDate.getTime();
        numberOfDays = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
        subtotal = numberOfDays * dailyRate;
        gstAmount = subtotal * 0.18;
        totalAmount = subtotal + gstAmount;
    }

    // Return default data even when form is empty
    return {
        rentalCompany: document.getElementById('rentalCompany').value || 'PREMIUM CAR RENTALS',
        companyAddress: document.getElementById('companyAddress').value || '123 Rental Street, City, State',
        gstNumber: document.getElementById('gstNumber').value || 'GST123456789',
        contactNumber: document.getElementById('contactNumber').value || '+91 98765 43210',
        invoiceNumber: document.getElementById('invoiceNumber').value,
        vehicleNumber: document.getElementById('vehicleNumber').value || 'MH01AB1234',
        vehicleModel: document.getElementById('vehicleModel').value || 'Swift Dzire',
        vehicleType: document.getElementById('vehicleType').value || 'Sedan',
        rentalDate: document.getElementById('rentalDate').value || new Date().toISOString().split('T')[0],
        returnDate: document.getElementById('returnDate').value || new Date(Date.now() + 86400000).toISOString().split('T')[0],
        dailyRate: dailyRate || 1500.00,
        numberOfDays: numberOfDays || 1,
        subtotal: subtotal || 1500.00,
        gstAmount: gstAmount || 270.00,
        totalAmount: totalAmount || 1770.00,
        paymentMode: document.getElementById('paymentMode').value || 'Cash',
        customerName: document.getElementById('customerName').value || 'John Doe',
        customerAddress: document.getElementById('customerAddress').value || '456 Customer Street, City, State',
        driverName: document.getElementById('driverName').value || 'Self',
        licenseNumber: document.getElementById('licenseNumber').value || 'N/A'
    };
}

// Car hire preview update
function updateCarHirePreview() {
    const formData = getCarHireFormData();
    const previewHtml = generateCarHireBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate car hire bill preview
function generateCarHireBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="Car Rental Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.rentalCompany.toUpperCase()}</div>
        <div class="bill-subheader">${data.companyAddress}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">CAR HIRE INVOICE</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Invoice No:</span>
                    <span class="bill-value">${data.invoiceNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Vehicle No:</span>
                    <span class="bill-value">${data.vehicleNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Vehicle Model:</span>
                    <span class="bill-value">${data.vehicleModel}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Vehicle Type:</span>
                    <span class="bill-value">${data.vehicleType}</span>
                </div>
            </div>
            <div class="bill-detail-right">
                <div class="bill-row">
                    <span class="bill-label">GST No:</span>
                    <span class="bill-value">${data.gstNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Contact:</span>
                    <span class="bill-value">${data.contactNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Rental Date:</span>
                    <span class="bill-value">${formatDate(data.rentalDate)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Return Date:</span>
                    <span class="bill-value">${formatDate(data.returnDate)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">CUSTOMER DETAILS:</div>
            <div class="bill-row">
                <span class="bill-label">Customer Name:</span>
                <span class="bill-value">${data.customerName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Customer Address:</span>
                <span class="bill-value">${data.customerAddress}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Driver Name:</span>
                <span class="bill-value">${data.driverName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">License No:</span>
                <span class="bill-value">${data.licenseNumber}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">RENTAL DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Rate/Day</span>
                    <span class="bill-table-col">Days</span>
                    <span class="bill-table-col">Amount</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.vehicleType} Rental</span>
                    <span class="bill-table-col">₹${data.dailyRate.toFixed(2)}</span>
                    <span class="bill-table-col">${data.numberOfDays}</span>
                    <span class="bill-table-col">₹${data.subtotal.toFixed(2)}</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">GST (18%)</span>
                    <span class="bill-table-col"></span>
                    <span class="bill-table-col"></span>
                    <span class="bill-table-col">₹${data.gstAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-total">
            <div class="bill-total-line"></div>
            <div class="bill-row">
                <span class="bill-label">TOTAL AMOUNT:</span>
                <span class="bill-value">₹${data.totalAmount.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank You! Visit Again</p>
            <p>For queries call: ${data.contactNumber}</p>
            <p>Safe driving! Return vehicle in good condition</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Generated: ${new Date().toLocaleString('en-IN')}</span>
            <span class="bill-bottom-right">Payment Mode: ${data.paymentMode}</span>
        </div>
    `;
}

// Car hire calculation function
function calculateCarHireAmounts() {
    const rentalDate = new Date(document.getElementById('rentalDate').value);
    const returnDate = new Date(document.getElementById('returnDate').value);
    const dailyRate = parseFloat(document.getElementById('dailyRate').value) || 0;

    if (rentalDate && returnDate && returnDate >= rentalDate) {
        const timeDiff = returnDate.getTime() - rentalDate.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end day

        document.getElementById('numberOfDays').value = daysDiff;

        const subtotal = daysDiff * dailyRate;
        const gstRate = 0.18; // 18% GST
        const gstAmount = subtotal * gstRate;
        const totalAmount = subtotal + gstAmount;

        document.getElementById('subtotal').value = subtotal.toFixed(2);
        document.getElementById('gstAmount').value = gstAmount.toFixed(2);
        document.getElementById('totalAmount').value = totalAmount.toFixed(2);
    } else {
        document.getElementById('numberOfDays').value = '';
        document.getElementById('subtotal').value = '';
        document.getElementById('gstAmount').value = '';
        document.getElementById('totalAmount').value = '';
    }
}

// Tax filing form data collection
function getTaxFilingFormData() {
    const consultationHours = parseFloat(document.getElementById('consultationHours').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;

    const subtotal = consultationHours * hourlyRate;
    const gstAmount = subtotal * 0.18;
    const totalAmount = subtotal + gstAmount;

    // Return default data even when form is empty
    return {
        consultantName: document.getElementById('consultantName').value || 'ABC TAX CONSULTANTS',
        consultantAddress: document.getElementById('consultantAddress').value || '123 Tax Street, City, State',
        gstNumber: document.getElementById('gstNumber').value || 'GST123456789',
        contactNumber: document.getElementById('contactNumber').value || '+91 98765 43210',
        invoiceNumber: document.getElementById('invoiceNumber').value,
        serviceDate: document.getElementById('serviceDate').value || new Date().toISOString().split('T')[0],
        serviceType: document.getElementById('serviceType').value || 'Income Tax Filing',
        assessmentYear: document.getElementById('assessmentYear').value || '2024-25',
        consultationHours: consultationHours || 2.0,
        hourlyRate: hourlyRate || 1000.00,
        subtotal: subtotal || 2000.00,
        gstAmount: gstAmount || 360.00,
        totalAmount: totalAmount || 2360.00,
        paymentMode: document.getElementById('paymentMode').value || 'Online',
        clientName: document.getElementById('clientName').value || 'John Doe',
        clientAddress: document.getElementById('clientAddress').value || '456 Client Street, City, State',
        panNumber: document.getElementById('panNumber').value || 'N/A',
        aadharNumber: document.getElementById('aadharNumber').value || 'N/A',
        serviceDescription: document.getElementById('serviceDescription').value || 'Professional tax consultation and filing services provided as per client requirements.'
    };
}

// Tax filing preview update
function updateTaxFilingPreview() {
    const formData = getTaxFilingFormData();
    const previewHtml = generateTaxFilingBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate tax filing bill preview
function generateTaxFilingBillPreview(data) {
    return `
        <div class="bill-logo">
            <img src="logo.jpeg" alt="Tax Consultant Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
        </div>
        <div class="bill-header">${data.consultantName.toUpperCase()}</div>
        <div class="bill-subheader">${data.consultantAddress}</div>
        <div class="bill-separator"></div>
        <div class="bill-title">TAX CONSULTATION INVOICE</div>
        
        <div class="bill-details-grid">
            <div class="bill-detail-left">
                <div class="bill-row">
                    <span class="bill-label">Invoice No:</span>
                    <span class="bill-value">${data.invoiceNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Service Date:</span>
                    <span class="bill-value">${formatDate(data.serviceDate)}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Service Type:</span>
                    <span class="bill-value">${data.serviceType}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Assessment Year:</span>
                    <span class="bill-value">${data.assessmentYear}</span>
                </div>
            </div>
            <div class="bill-detail-right">
                <div class="bill-row">
                    <span class="bill-label">GST No:</span>
                    <span class="bill-value">${data.gstNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Contact:</span>
                    <span class="bill-value">${data.contactNumber}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Hours:</span>
                    <span class="bill-value">${data.consultationHours}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Rate/Hour:</span>
                    <span class="bill-value">₹${data.hourlyRate.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">CLIENT DETAILS:</div>
            <div class="bill-row">
                <span class="bill-label">Client Name:</span>
                <span class="bill-value">${data.clientName}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Client Address:</span>
                <span class="bill-value">${data.clientAddress}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">PAN Number:</span>
                <span class="bill-value">${data.panNumber}</span>
            </div>
            <div class="bill-row">
                <span class="bill-label">Aadhar Number:</span>
                <span class="bill-value">${data.aadharNumber}</span>
            </div>
        </div>
        
        <div class="bill-section">
            <div class="bill-section-title">SERVICE DETAILS:</div>
            <div class="bill-table">
                <div class="bill-table-header">
                    <span class="bill-table-col">Item</span>
                    <span class="bill-table-col">Hours</span>
                    <span class="bill-table-col">Rate/Hour</span>
                    <span class="bill-table-col">Amount</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">${data.serviceType}</span>
                    <span class="bill-table-col">${data.consultationHours}</span>
                    <span class="bill-table-col">₹${data.hourlyRate.toFixed(2)}</span>
                    <span class="bill-table-col">₹${data.subtotal.toFixed(2)}</span>
                </div>
                <div class="bill-table-row">
                    <span class="bill-table-col">GST (18%)</span>
                    <span class="bill-table-col"></span>
                    <span class="bill-table-col"></span>
                    <span class="bill-table-col">₹${data.gstAmount.toFixed(2)}</span>
                </div>
            </div>
        </div>
        
        <div class="bill-total">
            <div class="bill-total-line"></div>
            <div class="bill-row">
                <span class="bill-label">TOTAL AMOUNT:</span>
                <span class="bill-value">₹${data.totalAmount.toFixed(2)}</span>
            </div>
        </div>
        
        <div class="bill-footer">
            <p>Thank You! Visit Again</p>
            <p>For queries call: ${data.contactNumber}</p>
            <p>Professional tax services with complete confidentiality</p>
        </div>
        
        <div class="bill-bottom">
            <span class="bill-bottom-left">Generated: ${new Date().toLocaleString('en-IN')}</span>
            <span class="bill-bottom-right">Payment Mode: ${data.paymentMode}</span>
        </div>
    `;
}

// Tax filing calculation function
function calculateTaxFilingAmounts() {
    const consultationHours = parseFloat(document.getElementById('consultationHours').value) || 0;
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value) || 0;

    const subtotal = consultationHours * hourlyRate;
    const gstRate = 0.18; // 18% GST
    const gstAmount = subtotal * gstRate;
    const totalAmount = subtotal + gstAmount;

    document.getElementById('subtotal').value = subtotal.toFixed(2);
    document.getElementById('gstAmount').value = gstAmount.toFixed(2);
    document.getElementById('totalAmount').value = totalAmount.toFixed(2);
}

// Tax calculator form data collection
function getTaxCalculatorFormData() {
    const taxableIncome = parseFloat(document.getElementById('taxableIncome').value) || 0;
    const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;

    const taxAmount = taxableIncome * taxRate;
    const netIncome = taxableIncome - taxAmount;

    return {
        taxableIncome: taxableIncome.toFixed(2),
        taxRate: taxRate.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        netIncome: netIncome.toFixed(2)
    };
}

// Tax calculator preview update
function updateTaxCalculatorResults() {
    const formData = getTaxCalculatorFormData();
    const previewHtml = generateTaxCalculatorPreview(formData);
    document.getElementById('taxResults').innerHTML = previewHtml;
}

// Generate tax calculator preview
function generateTaxCalculatorPreview(data) {
    return `
        <div class="tax-result">
            <h3>Tax Calculation Results</h3>
            <p>Taxable Income: ₹${data.taxableIncome}</p>
            <p>Tax Rate: ${data.taxRate}%</p>
            <p>Tax Amount: ₹${data.taxAmount}</p>
            <p>Net Income: ₹${data.netIncome}</p>
        </div>
    `;
}

// Tax type change listener
function toggleTaxSections() {
    const taxType = document.getElementById('taxType').value;
    const incomeTaxSection = document.getElementById('incomeTaxSection');
    const gstSection = document.getElementById('gstSection');

    if (taxType === 'income-tax') {
        incomeTaxSection.style.display = 'block';
        gstSection.style.display = 'none';
    } else if (taxType === 'gst') {
        incomeTaxSection.style.display = 'none';
        gstSection.style.display = 'block';
    } else {
        incomeTaxSection.style.display = 'none';
        gstSection.style.display = 'none';
    }
}

// Calculate tax based on selected type
function calculateTax() {
    const taxType = document.getElementById('taxType').value;
    let results = {};

    if (taxType === 'income-tax') {
        results = calculateIncomeTax();
    } else if (taxType === 'gst') {
        results = calculateGST();
    } else if (taxType === 'tds') {
        results = calculateTDS();
    } else if (taxType === 'property-tax') {
        results = calculatePropertyTax();
    }

    displayTaxResults(results);
}

// Calculate Income Tax
function calculateIncomeTax() {
    const basicSalary = parseFloat(document.getElementById('basicSalary').value) || 0;
    const hra = parseFloat(document.getElementById('hra').value) || 0;
    const allowances = parseFloat(document.getElementById('allowances').value) || 0;
    const bonus = parseFloat(document.getElementById('bonus').value) || 0;
    const rentIncome = parseFloat(document.getElementById('rentIncome').value) || 0;
    const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;

    // Deductions
    const pfContribution = parseFloat(document.getElementById('pfContribution').value) || 0;
    const insurance = parseFloat(document.getElementById('insurance').value) || 0;
    const nps = parseFloat(document.getElementById('nps').value) || 0;
    const homeLoan = parseFloat(document.getElementById('homeLoan').value) || 0;
    const elss = parseFloat(document.getElementById('elss').value) || 0;
    const medicalInsurance = parseFloat(document.getElementById('medicalInsurance').value) || 0;

    // Calculate gross income
    const grossIncome = basicSalary + hra + allowances + bonus + rentIncome + otherIncome;

    // Calculate total deductions
    const totalDeductions = Math.min(pfContribution + insurance + nps + homeLoan + elss + medicalInsurance, 150000);

    // Calculate taxable income
    const taxableIncome = Math.max(grossIncome - totalDeductions - 50000, 0); // Standard deduction of 50,000

    // Calculate tax based on slabs (2024-25)
    let taxAmount = 0;
    let taxBreakdown = [];

    if (taxableIncome <= 300000) {
        taxAmount = 0;
        taxBreakdown.push({ slab: '0 - 3,00,000', rate: '0%', amount: 0 });
    } else if (taxableIncome <= 600000) {
        const slabAmount = taxableIncome - 300000;
        taxAmount = slabAmount * 0.05;
        taxBreakdown.push({ slab: '0 - 3,00,000', rate: '0%', amount: 0 });
        taxBreakdown.push({ slab: '3,00,001 - 6,00,000', rate: '5%', amount: taxAmount });
    } else if (taxableIncome <= 900000) {
        taxAmount = 15000 + (taxableIncome - 600000) * 0.10;
        taxBreakdown.push({ slab: '0 - 3,00,000', rate: '0%', amount: 0 });
        taxBreakdown.push({ slab: '3,00,001 - 6,00,000', rate: '5%', amount: 15000 });
        taxBreakdown.push({ slab: '6,00,001 - 9,00,000', rate: '10%', amount: (taxableIncome - 600000) * 0.10 });
    } else if (taxableIncome <= 1200000) {
        taxAmount = 45000 + (taxableIncome - 900000) * 0.15;
        taxBreakdown.push({ slab: '0 - 3,00,000', rate: '0%', amount: 0 });
        taxBreakdown.push({ slab: '3,00,001 - 6,00,000', rate: '5%', amount: 15000 });
        taxBreakdown.push({ slab: '6,00,001 - 9,00,000', rate: '10%', amount: 30000 });
        taxBreakdown.push({ slab: '9,00,001 - 12,00,000', rate: '15%', amount: (taxableIncome - 900000) * 0.15 });
    } else if (taxableIncome <= 1500000) {
        taxAmount = 90000 + (taxableIncome - 1200000) * 0.20;
        taxBreakdown.push({ slab: '0 - 3,00,000', rate: '0%', amount: 0 });
        taxBreakdown.push({ slab: '3,00,001 - 6,00,000', rate: '5%', amount: 15000 });
        taxBreakdown.push({ slab: '6,00,001 - 9,00,000', rate: '10%', amount: 30000 });
        taxBreakdown.push({ slab: '9,00,001 - 12,00,000', rate: '15%', amount: 45000 });
        taxBreakdown.push({ slab: '12,00,001 - 15,00,000', rate: '20%', amount: (taxableIncome - 1200000) * 0.20 });
    } else {
        taxAmount = 150000 + (taxableIncome - 1500000) * 0.30;
        taxBreakdown.push({ slab: '0 - 3,00,000', rate: '0%', amount: 0 });
        taxBreakdown.push({ slab: '3,00,001 - 6,00,000', rate: '5%', amount: 15000 });
        taxBreakdown.push({ slab: '6,00,001 - 9,00,000', rate: '10%', amount: 30000 });
        taxBreakdown.push({ slab: '9,00,001 - 12,00,000', rate: '15%', amount: 45000 });
        taxBreakdown.push({ slab: '12,00,001 - 15,00,000', rate: '20%', amount: 60000 });
        taxBreakdown.push({ slab: 'Above 15,00,000', rate: '30%', amount: (taxableIncome - 1500000) * 0.30 });
    }

    // Add cess
    const cess = taxAmount * 0.04;
    const totalTax = taxAmount + cess;

    return {
        type: 'Income Tax',
        grossIncome: grossIncome.toFixed(2),
        totalDeductions: totalDeductions.toFixed(2),
        taxableIncome: taxableIncome.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        cess: cess.toFixed(2),
        totalTax: totalTax.toFixed(2),
        netIncome: (grossIncome - totalTax).toFixed(2),
        taxBreakdown: taxBreakdown,
        effectiveRate: ((totalTax / taxableIncome) * 100).toFixed(2)
    };
}

// Calculate GST
function calculateGST() {
    const amount = parseFloat(document.getElementById('gstAmount').value) || 0;
    const rate = parseFloat(document.getElementById('gstRate').value) || 0;

    const gstAmount = amount * (rate / 100);
    const totalAmount = amount + gstAmount;

    return {
        type: 'GST',
        baseAmount: amount.toFixed(2),
        gstRate: rate.toFixed(2),
        gstAmount: gstAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2)
    };
}

// Calculate TDS
function calculateTDS() {
    return {
        type: 'TDS',
        message: 'TDS calculation will be implemented based on specific requirements'
    };
}

// Calculate Property Tax
function calculatePropertyTax() {
    return {
        type: 'Property Tax',
        message: 'Property tax calculation will be implemented based on local municipal rates'
    };
}

// Display tax results
function displayTaxResults(results) {
    const resultsHtml = generateTaxResultsHTML(results);
    document.getElementById('taxResults').innerHTML = resultsHtml;
}

// Generate tax results HTML
function generateTaxResultsHTML(results) {
    if (results.type === 'Income Tax') {
        return `
            <div class="bill-logo">
                <img src="logo.jpeg" alt="Tax Calculator Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
            </div>
            <div class="bill-header">INCOME TAX CALCULATION</div>
            <div class="bill-subheader">Assessment Year: ${document.getElementById('assessmentYear').value}</div>
            <div class="bill-separator"></div>
            
            <div class="bill-section">
                <div class="bill-section-title">INCOME BREAKDOWN:</div>
                <div class="bill-row">
                    <span class="bill-label">Gross Income:</span>
                    <span class="bill-value">₹${results.grossIncome}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Total Deductions:</span>
                    <span class="bill-value">₹${results.totalDeductions}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Taxable Income:</span>
                    <span class="bill-value">₹${results.taxableIncome}</span>
                </div>
            </div>
            
            <div class="bill-section">
                <div class="bill-section-title">TAX BREAKDOWN:</div>
                <div class="bill-table">
                    <div class="bill-table-header">
                        <span class="bill-table-col">Income Slab</span>
                        <span class="bill-table-col">Rate</span>
                        <span class="bill-table-col">Tax Amount</span>
                    </div>
                    ${results.taxBreakdown.map(slab => `
                        <div class="bill-table-row">
                            <span class="bill-table-col">₹${slab.slab}</span>
                            <span class="bill-table-col">${slab.rate}</span>
                            <span class="bill-table-col">₹${slab.amount.toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bill-total">
                <div class="bill-total-line"></div>
                <div class="bill-row">
                    <span class="bill-label">Basic Tax:</span>
                    <span class="bill-value">₹${results.taxAmount}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">Health & Education Cess (4%):</span>
                    <span class="bill-value">₹${results.cess}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">TOTAL TAX:</span>
                    <span class="bill-value">₹${results.totalTax}</span>
                </div>
            </div>
            
            <div class="bill-footer">
                <p>Effective Tax Rate: ${results.effectiveRate}%</p>
                <p>Net Income After Tax: ₹${results.netIncome}</p>
                <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
        `;
    } else if (results.type === 'GST') {
        return `
            <div class="bill-logo">
                <img src="logo.jpeg" alt="Tax Calculator Logo" onerror="this.style.display='none'" onload="this.style.display='block'">
            </div>
            <div class="bill-header">GST CALCULATION</div>
            <div class="bill-separator"></div>
            
            <div class="bill-section">
                <div class="bill-section-title">GST DETAILS:</div>
                <div class="bill-row">
                    <span class="bill-label">Base Amount:</span>
                    <span class="bill-value">₹${results.baseAmount}</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">GST Rate:</span>
                    <span class="bill-value">${results.gstRate}%</span>
                </div>
                <div class="bill-row">
                    <span class="bill-label">GST Amount:</span>
                    <span class="bill-value">₹${results.gstAmount}</span>
                </div>
            </div>
            
            <div class="bill-total">
                <div class="bill-total-line"></div>
                <div class="bill-row">
                    <span class="bill-label">TOTAL AMOUNT:</span>
                    <span class="bill-value">₹${results.totalAmount}</span>
                </div>
            </div>
            
            <div class="bill-footer">
                <p>Generated on: ${new Date().toLocaleString('en-IN')}</p>
            </div>
        `;
    } else {
        return `
            <div class="empty-preview">
                <i class="fas fa-info-circle"></i>
                <h4>${results.type}</h4>
                <p>${results.message}</p>
            </div>
        `;
    }
}

// Clear tax calculator form
function clearTaxCalculatorForm() {
    const form = document.getElementById('taxCalculatorForm');
    if (form) {
        form.reset();
        // Reset all input values to 0
        const inputs = form.querySelectorAll('input[type="number"]');
        inputs.forEach(input => {
            input.value = '0';
        });
        // Reset select elements to first option
        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            select.selectedIndex = 0;
        });
        updateTaxCalculatorResults();
    }
}

// Download tax calculation PDF
function downloadTaxCalculationPDF() {
    const resultsDiv = document.getElementById('taxResults');
    if (!resultsDiv || resultsDiv.innerHTML.includes('empty-preview')) {
        alert('Please calculate tax first before downloading the report.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set font
    doc.setFont('helvetica');

    // Add logo
    const logoImg = new Image();
    logoImg.src = 'logo.jpeg';
    logoImg.onload = function() {
        try {
            doc.addImage(logoImg, 'JPEG', 85, 10, 30, 20);
        } catch (e) {
            console.log('Logo loading failed:', e);
        }

        // Add content
        const taxType = document.getElementById('taxType').value;
        const assessmentYear = document.getElementById('assessmentYear').value;

        if (taxType === 'income-tax') {
            generateIncomeTaxPDF(doc, assessmentYear);
        } else if (taxType === 'gst') {
            generateGSTPDF(doc);
        } else {
            generateGenericTaxPDF(doc, taxType);
        }

        // Save PDF
        doc.save(`tax-calculation-${taxType}-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    logoImg.onerror = function() {
        // Continue without logo if it fails to load
        const taxType = document.getElementById('taxType').value;
        const assessmentYear = document.getElementById('assessmentYear').value;

        if (taxType === 'income-tax') {
            generateIncomeTaxPDF(doc, assessmentYear);
        } else if (taxType === 'gst') {
            generateGSTPDF(doc);
        } else {
            generateGenericTaxPDF(doc, taxType);
        }

        doc.save(`tax-calculation-${taxType}-${new Date().toISOString().split('T')[0]}.pdf`);
    };
}

// Generate Income Tax PDF
function generateIncomeTaxPDF(doc, assessmentYear) {
    const results = calculateIncomeTax();

    // Header
    doc.setFontSize(18);
    doc.text('INCOME TAX CALCULATION', 105, 50, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`Assessment Year: ${assessmentYear}`, 105, 60, { align: 'center' });

    // Income breakdown
    doc.setFontSize(14);
    doc.text('INCOME BREAKDOWN:', 20, 80);

    doc.setFontSize(12);
    doc.text(`Gross Income: ₹${results.grossIncome}`, 20, 90);
    doc.text(`Total Deductions: ₹${results.totalDeductions}`, 20, 100);
    doc.text(`Taxable Income: ₹${results.taxableIncome}`, 20, 110);

    // Tax breakdown
    doc.setFontSize(14);
    doc.text('TAX BREAKDOWN:', 20, 130);

    let yPos = 140;
    results.taxBreakdown.forEach((slab, index) => {
        if (slab.amount > 0 || index === 0) {
            doc.setFontSize(10);
            doc.text(`${slab.slab} (${slab.rate}): ₹${slab.amount.toFixed(2)}`, 25, yPos);
            yPos += 8;
        }
    });

    // Total tax
    doc.setFontSize(14);
    doc.text('TOTAL TAX:', 20, yPos + 10);

    doc.setFontSize(12);
    doc.text(`Basic Tax: ₹${results.taxAmount}`, 20, yPos + 20);
    doc.text(`Health & Education Cess (4%): ₹${results.cess}`, 20, yPos + 30);
    doc.text(`TOTAL TAX: ₹${results.totalTax}`, 20, yPos + 40);

    // Footer
    doc.setFontSize(10);
    doc.text(`Effective Tax Rate: ${results.effectiveRate}%`, 20, yPos + 55);
    doc.text(`Net Income After Tax: ₹${results.netIncome}`, 20, yPos + 65);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 20, yPos + 75);
}

// Generate GST PDF
function generateGSTPDF(doc) {
    const results = calculateGST();

    // Header
    doc.setFontSize(18);
    doc.text('GST CALCULATION', 105, 50, { align: 'center' });

    // GST details
    doc.setFontSize(14);
    doc.text('GST DETAILS:', 20, 80);

    doc.setFontSize(12);
    doc.text(`Base Amount: ₹${results.baseAmount}`, 20, 95);
    doc.text(`GST Rate: ${results.gstRate}%`, 20, 105);
    doc.text(`GST Amount: ₹${results.gstAmount}`, 20, 115);

    // Total
    doc.setFontSize(14);
    doc.text('TOTAL AMOUNT:', 20, 135);
    doc.setFontSize(12);
    doc.text(`₹${results.totalAmount}`, 20, 145);

    // Footer
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 20, 160);
}

// Generate generic tax PDF
function generateGenericTaxPDF(doc, taxType) {
    doc.setFontSize(18);
    doc.text(`${taxType.toUpperCase()} CALCULATION`, 105, 50, { align: 'center' });

    doc.setFontSize(12);
    doc.text('This calculation will be implemented based on specific requirements.', 20, 80);
    doc.text(`Generated on: ${new Date().toLocaleString('en-IN')}`, 20, 100);
}