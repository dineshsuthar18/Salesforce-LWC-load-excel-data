import { LightningElement ,api } from 'lwc';

export default class LDS extends LightningElement {
    @api recordId;
    objectApiName = 'Account';
    fields = ['Name', 'Phone', 'Industry'];

    submit(){
        console.log('Submitting');
    }

    success(){
        console.log('success');
    }

}