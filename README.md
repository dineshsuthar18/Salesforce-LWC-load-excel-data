# Load Excel Data LWC Component

This Lightning Web Component (LWC) allows users to upload a CSV file, process the data, and display it in a DataTable. 
The component ensures that the uploaded file's columns match a predefined set of headers before processing the data.

### Features:
1. Upload a .csv file.
2. Display CSV data in a DataTable.
3. Modal to show the processed data.

### How to Use:
1. Add the component to a Lightning Page.
2. Use the "Upload CSV File" button to upload a file.
3. Click on open to preview the loaded Lightning datatable records
4. The data will be displayed in a table format.

### Notes:
1. Ensure that the uploaded file is in .csv format.
2. The column names in the CSV file must match with lightning datatable columns: ID, Last Name, Email, Phone, Account, and Source for the data to be processed correctly.
