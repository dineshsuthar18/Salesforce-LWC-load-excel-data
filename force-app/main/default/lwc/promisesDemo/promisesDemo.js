import { LightningElement } from 'lwc';
import getUserSessionId from '@salesforce/apex/PromisesDemo.getUserSessionId';
import getFiveAccounts from '@salesforce/apex/PromisesDemo.getFiveAccounts';
import updateFiveAccounts from '@salesforce/apex/PromisesDemo.updateFiveAccounts';

const print = console.log;

export default class PromisesDemo extends LightningElement {

    connectedCallback(){
        //this.handlePromises();
        //this.handlePromises2();
        //this.handlePromises3();
       // this.handlePromises4();
    }

    async handlePromises(){
        try{
            const sessionId = await getUserSessionId();
            const fiveAccounts = await getFiveAccounts();
            const updatefiveAccounts = await updateFiveAccounts({accountLimit: 5});

            print('### sessionId '+ sessionId);
            print('### five '+ JSON.stringify(fiveAccounts));
            print('### updatefiveAccounts '+ updatefiveAccounts);

            const fiveAccountsAfter = await getFiveAccounts();
            print('### fiveAccountsAfter '+ JSON.stringify(fiveAccountsAfter));
            // In this way let say if getUserSessionId and  getFiveAccounts ran successfully and got error on updateFiveAccounts then first two will give result not 3 and 4th wont even run
        }catch(error){
            print('@@@@ error' + JSON.stringify(error))
        }
    }


    async handlePromises2(){
        try{
            var sessionIdPromise = getUserSessionId();
            var fiveAccountsPromise = getFiveAccounts();
            var updatefiveAccountsPromise = updateFiveAccounts({accountLimit: 5});
            
            const [sessionIdResult, 
                fiveAccountsResult, 
                updatefiveAccountsResult
            ] = await Promise.all([sessionIdPromise, fiveAccountsPromise, updatefiveAccountsPromise]);
            
            print('### sessionId '+ sessionIdResult);
            print('### five '+ JSON.stringify(fiveAccountsResult));
            print('### updatefiveAccounts '+ updatefiveAccountsResult);

            const fiveAccountsAfter = await getFiveAccounts();
            print('### fiveAccountsAfter '+ JSON.stringify(fiveAccountsAfter));

            //Promise.all()
    
        }catch(error){
            print('@@@@ error' + JSON.stringify(error))
        }
    }

    async handlePromises3(){
        var sessionIdPromise = getUserSessionId();
        var fiveAccountsPromise = getFiveAccounts();
        var updatefiveAccountsPromise = updateFiveAccounts({accountLimit: 5});
        
        await Promise.all(
            [sessionIdPromise, fiveAccountsPromise, updatefiveAccountsPromise]
        ).then (([sessionIdPromiseResult, fiveAccountsPromiseResult, updatefiveAccountsPromiseResult]) =>{
            print('### sessionId '+ sessionIdPromiseResult);
            print('### five '+ JSON.stringify(fiveAccountsPromiseResult));
            print('### updatefiveAccounts '+ updatefiveAccountsPromiseResult);
        }).catch(error =>{
            print('@@@@ error' + JSON.stringify(error))
        })

        const fiveAccountsAfter = await getFiveAccounts();
        print('### fiveAccountsAfter '+ JSON.stringify(fiveAccountsAfter));
    }

    async handlePromises4(){
        await getUserSessionId().then().then(getFiveAccounts).then(updatefiveAccountsPromise)
    }
}