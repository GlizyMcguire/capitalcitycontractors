# Capital City Contractors - CRM Dashboard v2.0 Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Accessing the Dashboard](#accessing-the-dashboard)
3. [Features](#features)
4. [User Guide](#user-guide)
5. [Technical Details](#technical-details)
6. [Future Enhancements](#future-enhancements)

---

## 🎯 Overview

The CRM Dashboard v2.0 is a professional, feature-rich Customer Relationship Management system designed specifically for Capital City Contractors. It provides comprehensive lead tracking, analytics, and management capabilities directly in your browser.

### Key Highlights
- **Modern UI**: Clean, professional design with responsive layout
- **Real-time Analytics**: Live metrics and data visualization
- **Advanced Filtering**: Multi-criteria search and filtering
- **Data Export**: CSV export and print-friendly reports
- **Inline Editing**: Quick status updates and note-taking
- **Bulk Operations**: Manage multiple leads simultaneously

---

## 🔐 Accessing the Dashboard

### Method 1: Browser Console (Current)
1. Open your website: https://capitalcitycontractors.ca
2. Press **F12** to open Developer Tools
3. Click on the **Console** tab
4. Type: `showCRM()` and press Enter
5. The dashboard will open in a full-screen overlay

### Method 2: Alternative Command
You can also use the legacy command:
```javascript
showCRMDashboard()
```

### Quick Access Tip
Create a browser bookmark with this JavaScript code:
```javascript
javascript:showCRM();
```
Click the bookmark anytime to instantly open the CRM dashboard!

---

## ✨ Features

### 1. Summary Metrics Dashboard
At the top of the dashboard, you'll see 6 key metric cards:

- **Total Leads**: All-time lead count
- **This Week**: Leads generated in the last 7 days
- **Conversion Rate**: Percentage of leads converted to customers
- **Converted**: Total number of converted leads
- **Codes Used**: Discount codes redeemed vs. available
- **Filtered Results**: Number of leads matching current filters

### 2. Advanced Filtering System

#### Status Filter
- **All Status**: Show all leads
- **New**: Fresh leads that haven't been contacted
- **Contacted**: Leads you've reached out to
- **Qualified**: Leads that are interested and qualified
- **Converted**: Leads that became customers
- **Lost**: Leads that didn't convert

#### Project Type Filter
Filter by the type of project the customer is interested in:
- Interior Painting
- Exterior Painting
- Drywall Installation/Repair
- Kitchen Renovation
- Basement Renovation
- Bathroom Renovation

#### Date Range Filter
- **All Time**: Show all leads
- **Today**: Leads from today only
- **Last 7 Days**: Leads from the past week
- **Last 30 Days**: Leads from the past month
- **Last 3 Months**: Leads from the past quarter

#### Code Status Filter
- **All Codes**: Show all discount codes
- **Unused**: Codes that haven't been redeemed yet
- **Used**: Codes that have been redeemed
- **Expired**: Codes past their expiration date

#### Search Bar
Search across multiple fields:
- Customer name
- Email address
- Phone number
- Street address
- Discount code
- Notes

### 3. Interactive Lead Table

#### Sortable Columns
Click any column header to sort:
- Date (timestamp)
- Name
- Email
- Project Type
- Status

Click again to reverse sort direction (ascending ↑ / descending ↓)

#### Table Columns
- **Checkbox**: Select leads for bulk operations
- **Date**: When the lead was generated
- **Name**: Customer's full name
- **Email**: Customer's email address
- **Phone**: Customer's phone number (if provided)
- **Project**: Type of project they're interested in
- **Code**: Their unique discount code
- **Status**: Current lead status (editable dropdown)
- **Actions**: Quick action buttons

#### Action Buttons
Each lead has 3 action buttons:

1. **👁️ View Details**: Expand row to see full information
   - Full address
   - Code expiry date
   - Whether code was used
   - Last modified timestamp
   - Notes

2. **📝 Edit Notes**: Add or update notes for this lead
   - Opens a prompt dialog
   - Notes are saved automatically
   - Searchable in the search bar

3. **🗑️ Delete**: Remove this lead permanently
   - Requires confirmation
   - Cannot be undone

#### Status Dropdown
Each lead has an inline status dropdown:
- Change status directly in the table
- Automatically tracks when leads are contacted
- Automatically tracks when leads are converted
- Updates metrics in real-time

### 4. Bulk Operations

#### Selection Tools
- **Select All**: Check all filtered leads
- **Deselect All**: Uncheck all leads
- **Delete Selected**: Remove multiple leads at once

#### How to Use
1. Check the boxes next to leads you want to manage
2. The counter shows how many are selected
3. Click "Delete Selected" to remove them all
4. Confirm the action in the dialog

### 5. Data Visualization

#### Leads by Project Type (Bar Chart)
- Visual breakdown of leads by project category
- Helps identify most popular services
- Hover to see exact counts

#### Leads Over Time (Line Chart)
- Shows lead generation trends over the last 30 days
- Identifies peak days and patterns
- Helps with capacity planning

### 6. Export & Reporting

#### Export to CSV
- Downloads a CSV file with all filtered leads
- Includes all lead data and notes
- Filename includes current date
- Opens in Excel, Google Sheets, etc.

#### Print Report
- Generates a print-friendly version
- Removes interactive elements
- Optimized for paper/PDF
- Includes all visible data

---

## 📖 User Guide

### Daily Workflow

#### Morning Routine
1. Open CRM: `showCRM()`
2. Check "This Week" metric for new leads
3. Filter by Status: "New"
4. Review and contact new leads
5. Update status to "Contacted"

#### Lead Management
1. **New Lead Arrives**
   - Automatically appears in CRM
   - Status: "New"
   - Discount code generated

2. **First Contact**
   - Call or email the customer
   - Click status dropdown → "Contacted"
   - Add notes about the conversation

3. **Qualification**
   - If interested and qualified → "Qualified"
   - If not interested → "Lost"
   - Add notes explaining why

4. **Conversion**
   - Customer books project → "Converted"
   - Automatically tracks conversion date
   - Updates conversion rate metric

#### Weekly Review
1. Filter by "Last 7 Days"
2. Check conversion rate
3. Review "Lost" leads for patterns
4. Export CSV for record-keeping

#### Monthly Reporting
1. Filter by "Last 30 Days"
2. Review charts for trends
3. Export CSV for accounting
4. Print report for management

### Best Practices

#### Note-Taking Tips
- Record date and time of contact
- Note customer's budget and timeline
- Track objections or concerns
- Record follow-up dates
- Note referral sources

Example note:
```
2025-01-04 10:30am - Called customer. Interested in kitchen reno.
Budget: $15k-20k. Timeline: Spring 2025. Wants 3 quotes.
Follow up: Jan 11. Referred by neighbor on Oak St.
```

#### Status Management
- Update status immediately after contact
- Don't leave leads in "New" for more than 24 hours
- Move to "Lost" if no response after 3 attempts
- Use "Qualified" for hot leads ready to book

#### Data Hygiene
- Review and clean data monthly
- Delete test leads
- Archive old "Lost" leads
- Keep notes current and relevant

---

## 🔧 Technical Details

### Data Storage
- **Location**: Browser localStorage
- **Key**: `ccc_leads`
- **Format**: JSON array
- **Persistence**: Survives browser restarts
- **Backup**: Export CSV regularly

### Data Structure
Each lead contains:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  phone: "(613) 555-1234",
  address: "123 Main St, Ottawa",
  project: "kitchen-renovation",
  discountCode: "CCC15-XXXXXX",
  codeExpiry: "2025-02-03T12:00:00Z",
  used: false,
  status: "new",
  notes: "Customer notes here",
  timestamp: "2025-01-04T10:30:00Z",
  lastModified: "2025-01-04T15:45:00Z",
  contactedDate: null,
  convertedDate: null,
  source: "website-discount-form"
}
```

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### Performance
- Handles 1000+ leads smoothly
- Instant filtering and sorting
- Real-time chart rendering
- Optimized for mobile devices

### Security
- Data stored locally (not on server)
- No external API calls
- Console-only access (no public UI)
- No sensitive data exposed

---

## 🚀 Future Enhancements

### Phase 2: Desktop Application
**Status**: Planned

Create a standalone desktop application:
- Windows .exe file
- Mac .app file
- Linux AppImage
- Electron-based
- Offline functionality
- System tray integration

### Phase 3: Mobile Application
**Status**: Planned

Native mobile apps:
- iOS app (App Store)
- Android app (Google Play)
- Push notifications for new leads
- Quick status updates on-the-go
- Voice notes feature

### Phase 4: Cloud Sync
**Status**: Future

Multi-device synchronization:
- Cloud database integration
- Real-time sync across devices
- Team collaboration features
- Role-based access control
- Audit logs

### Phase 5: Advanced Features
**Status**: Future

Additional capabilities:
- Email integration (send from CRM)
- SMS notifications
- Calendar integration
- Automated follow-up reminders
- AI-powered lead scoring
- Revenue tracking
- Custom fields
- Advanced reporting

---

## 📞 Support

### Getting Help
If you encounter issues:
1. Check browser console for errors (F12)
2. Try refreshing the page
3. Clear browser cache
4. Export data before troubleshooting

### Common Issues

**Dashboard won't open**
- Wait 5 seconds after page load
- Check console for errors
- Try: `window.crmDashboard = null; showCRM();`

**Data not saving**
- Check localStorage isn't full
- Try exporting and clearing old data
- Check browser privacy settings

**Charts not displaying**
- Ensure you have lead data
- Try resizing browser window
- Refresh the dashboard

---

## 📝 Changelog

### Version 2.0 (2025-01-04)
- ✨ Complete redesign with modern UI
- ✨ Added summary metrics dashboard
- ✨ Advanced filtering system
- ✨ Sortable table columns
- ✨ Inline status editing
- ✨ Bulk operations
- ✨ Data visualization charts
- ✨ CSV export functionality
- ✨ Print-friendly reports
- ✨ Responsive mobile design
- ✨ Search across all fields
- ✨ Notes system
- ✨ Status tracking with timestamps

### Version 1.0 (Previous)
- Basic lead display
- Simple table view
- Console-based access

---

## 🎓 Training Resources

### Video Tutorials (Coming Soon)
- Dashboard Overview (5 min)
- Daily Workflow (10 min)
- Advanced Features (15 min)

### Quick Reference Card
Print this for your desk:
```
QUICK COMMANDS
--------------
Open CRM:     showCRM()
Export CSV:   Click "Export CSV" button
Print:        Click "Print" button
Close:        Click "✕ Close" button

KEYBOARD SHORTCUTS
------------------
F12:          Open console
Ctrl+P:       Print
Ctrl+F:       Find in page
```

---

**Last Updated**: January 4, 2025  
**Version**: 2.0  
**Author**: Capital City Contractors Development Team

