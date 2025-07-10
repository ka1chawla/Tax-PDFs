# Tax Management System

A modern, responsive web application for managing fuel bills and driver salaries with PDF export functionality. Built with vanilla HTML, CSS, and JavaScript.

## Features

### 🏠 Home Page
- **Welcome Section**: Beautiful introduction with feature overview
- **Feature Cards**: Highlighting key functionalities
- **Responsive Design**: Works perfectly on all devices

### ⛽ Fuel Bill Management
- **Add Fuel Entries**: Track date, amount, liters, fuel station, and notes
- **Automatic Calculations**: Price per liter calculation
- **Data Storage**: Local storage for persistent data
- **PDF Export**: Generate detailed fuel bill reports
- **Delete Entries**: Remove unwanted entries

### 👨‍💼 Driver Salary Management
- **Salary Calculator**: Automatic net salary calculation
- **Comprehensive Tracking**: Basic salary, allowances, deductions
- **Driver Information**: Track multiple drivers
- **PDF Export**: Generate salary reports
- **Data Management**: Add, view, and delete salary entries

### 📄 PDF Reports
- **Professional Formatting**: Clean, organized PDF layouts
- **Summary Statistics**: Totals and averages
- **Detailed Tables**: Complete entry listings
- **Multiple Pages**: Automatic pagination for large datasets

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients and animations
- **JavaScript (ES6+)**: Interactive functionality
- **jsPDF**: PDF generation library
- **Font Awesome**: Beautiful icons
- **Local Storage**: Data persistence

## Setup Instructions

### For Local Development

1. **Clone or Download** the repository
2. **Open** `index.html` in your web browser
3. **Start Using** the application immediately

### For GitHub Pages Deployment

1. **Create a new repository** on GitHub
2. **Upload all files** to the repository:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `README.md`

3. **Enable GitHub Pages**:
   - Go to repository **Settings**
   - Scroll down to **Pages** section
   - Select **Source**: "Deploy from a branch"
   - Choose **Branch**: "main" (or "master")
   - Click **Save**

4. **Access your site** at: `https://yourusername.github.io/repository-name`

### File Structure
```
taxManagementSite/
├── index.html          # Main HTML file
├── styles.css          # CSS styling
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

### Adding Fuel Entries
1. Click on the **"Fuel Bills"** tab
2. Fill in the form with:
   - Date of purchase
   - Amount paid
   - Liters purchased
   - Fuel station name
   - Optional notes
3. Click **"Save Entry"**
4. View your entries in the list below

### Adding Salary Entries
1. Click on the **"Driver Salary"** tab
2. Fill in the form with:
   - Date
   - Driver name
   - Basic salary
   - Allowances (optional)
   - Deductions (optional)
   - Notes (optional)
3. The net salary is calculated automatically
4. Click **"Save Entry"**

### Downloading PDF Reports
1. Navigate to the respective section (Fuel Bills or Driver Salary)
2. Click the **"Download PDF"** button
3. The PDF will be generated and downloaded automatically
4. Reports include summaries and detailed entry tables

## Features in Detail

### Data Persistence
- All data is stored in browser's local storage
- Data persists between browser sessions
- No server required

### Responsive Design
- Mobile-friendly interface
- Adaptive layouts for different screen sizes
- Touch-friendly buttons and forms

### PDF Generation
- Professional report formatting
- Automatic calculations and summaries
- Multi-page support for large datasets
- Clean, readable layouts

### User Experience
- Smooth animations and transitions
- Intuitive navigation with tabs
- Success/error messages
- Confirmation dialogs for deletions

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Customization

### Styling
- Modify `styles.css` to change colors, fonts, and layout
- Update the gradient backgrounds in the CSS variables
- Adjust responsive breakpoints as needed

### Functionality
- Add new fields to forms in `index.html`
- Update JavaScript functions in `script.js`
- Modify PDF generation logic for custom reports

### Data Structure
- Fuel entries: `{id, date, amount, liters, station, notes}`
- Salary entries: `{id, date, driverName, basicSalary, allowances, deductions, netSalary, notes}`

## Troubleshooting

### PDF Not Downloading
- Ensure you have entries to export
- Check browser permissions for downloads
- Try refreshing the page

### Data Not Saving
- Check if local storage is enabled in your browser
- Clear browser cache and try again
- Ensure JavaScript is enabled

### Styling Issues
- Clear browser cache
- Check for CSS conflicts
- Verify all files are in the same directory

## Contributing

Feel free to fork this project and submit pull requests for improvements!

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ for efficient business management** 