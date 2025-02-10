import { LightningElement, track } from 'lwc';

export default class LoadExcelData extends LightningElement {

    @track fileName = '';
    @track UploadFileLabel = 'Upload CSV File';
    @track filesUploaded = [];
    @track data;
    @track isModalOpen = false;


    /*************************************************************************************
     *  NOTE: The columns in the uploaded Excel file must be ".csv" and match the following headers:
     *  ID, Last Name, Email, Phone, Account, Source
     *  If the headers do not match, the data will not be processed correctly.
     *************************************************************************************/

    @track columns = [
        { label: 'ID', fieldName: 'Id', type: 'text' },
        { label: 'Last Name', fieldName: 'Lastname', type: 'text' },
        { label: 'Email', fieldName: 'Email', type: 'email' },
        { label: 'Phone', fieldName: 'Phone', type: 'phone' },
        { label: 'Account', fieldName: 'Account', type: 'text' },
        { label: 'Source', fieldName: 'Source', type: 'text' }
    ];

    /**
     * Handles the file upload event. It processes the uploaded file (CSV), 
     * reads its content and maps it into a JSON format. 
     * The CSV data is then stored in the JSON array property `data`, which is used to display
     * the data on the UI. The file name is stored in `fileName` and uploaded 
     * files are stored in `filesUploaded`.
     * 
     * This method also handles opening a modal for displaying the data.
     * 
     * @param {Event} event - The file upload event triggered when a file is selected.
     */

    handleUploadedFile(event) {
        const uploadedFiles = event.target.files;

        if (event.target.files.length > 0) {
            // Store the uploaded files and file name
            this.filesUploaded = event.target.files;
            this.fileName = this.filesUploaded[0].name;

            const file = uploadedFiles[0];
            const reader = new FileReader();

            // Read the content of the uploaded file
            reader.onload = (e) => {
                const text = e.target.result;

                const rows = text.split('\n');
                const headers = rows[0].split(',');
                const jsonData = [];

                // Loop through each row and create a JSON object for each
                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i].trim();

                    if (row && !/^,*$/.test(row)) { //Slips empty rows
                        const columns = row.split(',');
                        const jsonObject = {};

                        // Map each header to its corresponding column value
                        for (let j = 0; j < headers.length; j++) {
                            jsonObject[headers[j].trim()] = columns[j] ? columns[j].trim() : null;
                        }
                        jsonData.push(jsonObject);
                    }
                }
                this.data = jsonData;
            };
            reader.readAsText(file);
            this.openModal();
        }
    }

    // Method to open the modal for displaying the csv data
    openModal() {
        this.isModalOpen = true;
    }

    // Method to close the modal for displaying the csv data
    closeModal() {
        this.isModalOpen = false;
    }
}