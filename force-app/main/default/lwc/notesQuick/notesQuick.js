import { LightningElement, wire, track, api } from 'lwc';

//Apex
import deleteDocuments from '@salesforce/apex/TestingOut.deleteDocuments';
import { refreshApex } from '@salesforce/apex';
import USER_Id from '@salesforce/user/Id';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import NAME_FIELD from '@salesforce/schema/Account.Name';

//Lightning
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import { getRecord } from 'lightning/uiRecordApi';
import { updateRecord } from 'lightning/uiRecordApi';
import { deleteRecord } from 'lightning/uiRecordApi';
import { createRecord } from 'lightning/uiRecordApi';
import { getObjectInfo, getObjectInfos } from 'lightning/uiObjectInfoApi';
import { getPicklistValues } from 'lightning/uiObjectInfoApi';

//Custom
import MyModal from "c/myModal";
import { registerListener } from 'c/pubsub';
import { fireEvent } from 'c/pubsub';
import { MineAuthorName, STATUS_VALUE, Infos } from 'c/customUtils';
//import ADDITIONAL_TEMPLATE from './additionalTemplate.html';  //COrrect code, assume created new 'additionalTemplate' in same lwc comp

//LMS
import { publish, subscribe, MessageContext } from 'lightning/messageService';
//import LMS_CHANNEL_NAME from '@salesforce/messageChannel/lms_channel__c';  (Correct Code structure)

/* TOPICS
    ##1. PUBSUB
    ##2. How to increase SLDS-Modal width
    ##3. Names - Calling child component from parent how @api values should be named
    ##4. When to use static assinning and when to use getter
    ##5. Bubbles and composed 
    ##6. Timeout and Interval
*/

/* INTERVIEW REVISION
    $$$$$
*/

export default class NotesQuick extends NavigationMixin(LightningElement) {

    @wire(CurrentPageReference)
    pageRef;

    @wire(MessageContext)
    messageContext;

    connectedCallback() {
        //Pubsub
        fireEvent(this.pageRef, 'firingFromChild', this.name);  //Anywhere
        registerListener('firingFromGlobalSearch', this.getAccountDetails1, this);  //Must be inside connectedCallback

        //LMS (Correct Code)
        //publish(this.messageContext, LMS_CHANNEL_NAME, 'ANYDATA');
        //subscribe(this.messageContext,LMS_CHANNEL_NAME, (data) => handleLMSData(data))  //handleLMSData(data) is another method
    }

    //Getter Setter
    @track local_json;
    @api
    get readonly_api_json() {
        return this.local_json;
    }
    set readonly_api_json(value) {
        this.local_json = value;                                //Use when no modification needed
        this.local_json = JSON.parse(JSON.stringify(value));    // Use when mofication need on json
        this.local_json = { ...value }                          //Use when mofication need on json
    }

    //Wire and Asyc Approach
    @wire(deleteDocuments, { paramater: paramaterValue })
    info({ error, data }) {    //Should be error and data only 
        //Code conosle.log(error), conosle.log(data) 
    }

    @wire(deleteDocuments, { paramater: paramaterValue })
    info({ result }) {
        refreshApex(result);  ////RefreshApex will work here not in above where error,data is there
        //Code conosle.log(result.data), conosle.log(result.error) 
    }

    async fetchData() {
        await deleteDocuments({ paramater: paramaterValue })
            .then(data => {
                //code data
            }).catch(error => {
                //code error
            }).finally(() => {
                //code finally
            });
    }

    //Toast Event
    events(title, message, variant) {
        //toastEvent
        const toastEvent = new ShowToastEvent({ title: title, message: message, variant: variant, mode: 'dismissable' });
        this.dispatchEvent(toastEvent);

        //Custom Event 1
        const customEvent = new CustomEvent('name', { detail: 'ANYDATA' });
        this.dispatchEvent(customEvent);

        //Custom Event 2
        this.dispatchEvent(new CustomEvent('closebillpopup'));

        //new List<String{xxx,xxxx}
    }


    /* Query Selector Notes (Correct code commented as most of the things not availavle in html)
    QuerySelector(){
        this.template.querySelector('[data-id="dataSetId"]');
        this.template.querySelectorAll('[data-id="dataSetId"], [data-id="dataSetId2"]');
        this.template.querySelector('lighting-input[data-id="dataSetI3"], button[data-id="dataSetId4"]');
        this.template.querySelectorAll('.className');
        this.template.querySelector('c-child-lwc-component').publicMethodName(paramater);
        
        //Normal id not dataset Id
        this.template.querySelector('#divId');  //It wont work as transformed into globally unique
        this.template.querySelector('#divId-149');  

        let element =  this.template.querySelector('ANY_RESULT');
        element.value;
        element.textContent = 'Changed Button'
        element.setAttribute('label', 'Label Changed');  //May not work
        element.setAttribute('disabled', 'true');
        element.setAttribute('title', 'This is a tooltip');

        element.style.color = 'red';  //Change inline css style
        element.style.backgroundColor = 'blue'; //Change inline css style
        element.classList.contains('changeFont');
        element.classList.add('changeFont');
        element.classList.remove('changeFont');

        //if Loop querSelctorALL
        elements.forEach(element=>{
            element.textContent = 'Changed class';
        })
    }
    */



    /* EXPLANATON
    ##1. PUBSUB
        Component 1
        import { fireEvent } from 'c/pubsub';
        import { CurrentPageReference } from 'lightning/navigation';
        @wire(CurrentPageReference) pageRef;
        fireEvent(this.pageRef, 'firingFromChild', this.name);
        
        Component 2
        import {registerListener } from 'c/pubsub';
        import { CurrentPageReference } from 'lightning/navigation';
        @wire (CurrentPageReference) pageRef;
        
        connectedCallback(){
            registerListener('firingFromChild',this.getFiredDataFromChild , this);
        }

    ===================================================================================================================

    ##2. How to increase SLDS-Modal width
        .slds-modal__container {
            max-width: 80rem !important;
            width: 90% !important;
        }

    ===================================================================================================================

    ##3. Calling child component from parent how @api values should be named
    <c-child-component
        country={countryData}
        type-of-quote={typeOfQuoteData}
        owner_id={ownerIdData}
    ></c-child-component>

    childComponent.js
        @api country; //normal
        @api typeOfQuote; //CamelCase
        @api owner_id; //normal

    ===================================================================================================================

    ##4. When to use static assinning and when to use getter
    
    #Scenario 1
    options = [
                { label: 'All Favorites', value: 'all' },
             ];
             
             
    get options() {
        return this.isAdmin ? 
            [
                { label: 'All Favorites', value: 'all' },
            ] :
            [
                { label: 'Mine Favorites', value: 'Some' },
            ];
    }

    #Scenario 2
    disableButton=false;
    get disableButton(){
        if(this.chosenFavourites == null)
            return true;
        else 
            return false;
    }

    ===================================================================================================================
    
    ##5. Bubbles and composed 
    Scenario - Parent (Aura) -> LWC1(Child) -> LWC2(Child of lwc1) -> LWC3(child of lwc2)
    With bubbles: true: The event will bubble up from lwc3 through its parent components (lwc2, lwc1) and reach any ancestors that listen for the event.
    With composed: true: The event will cross Shadow DOM boundaries, allowing it to reach the Aura component (aura1), even if lwc1 is a child of aura1.
    
    ===================================================================================================================

    ##6. Timeout and Interval
    timer;
    interval;
    handle timeOut_Interval(){
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            console.log('timeout')
        }, 3000);


        this.interval = setInterval(() => {
            console.log('interval')
            if (!this.stopInterval) {
                clearInterval(this.interval);
            }
        }, 3000);
        
        NOTE: clearInterval(this.interval);  // we can use this method any other method as well as we are storing interval in class variable

    ===================================================================================================================
    ===================================================================================================================
    ===================================================================================================================
    ===================================================================================================================        


    $$$$$ INTERVIEW REVISION
    lazy loading?
    setCustomValidity, reportValidity
    Decbouncing (Reduce unnecessary sever calls)
    One way two way data binding
    Whay is CLI
    What is DOM, Shadom DOM
    What is Locker Services

    Imports
    Wire
    Asynchrouns apex call method
    LDS
    LMS
    HOOKS
    Datatable
    Navigation
    QuerySelector
    Loop
    Parent- child data pass
    Bubbles and composed

    Javascript Logics
    */

}