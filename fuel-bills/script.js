// Fuel Bills Management Script

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeFuelBills();
    setupFuelBillsEventListeners();
    updatePreview();
});

// Initialize fuel bills page
function initializeFuelBills() {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    const fuelDate = document.getElementById('fuelDate');
    if (fuelDate) {
        fuelDate.value = today;
    }

    // Generate initial random receipt number
    generateRandomReceiptNumber();
}

// Generate random receipt number
function generateRandomReceiptNumber() {
    const randomNumber = Math.floor(Math.random() * 1000000) + 1;
    document.getElementById('receiptNumber').value = randomNumber.toString().padStart(6, '0');
}

// Set up event listeners for fuel bills page
function setupFuelBillsEventListeners() {
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

// Get fuel form data
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

// Update preview
function updatePreview() {
    const formData = getFuelFormData();
    const previewHtml = generateBillPreview(formData);
    document.getElementById('billPreview').innerHTML = previewHtml;
}

// Generate bill preview
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

// Download preview PDF
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

// Clear fuel form
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

// Export functions for global access
window.clearFuelForm = clearFuelForm;
window.downloadPreviewPDF = downloadPreviewPDF; 