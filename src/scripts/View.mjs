import { AppComponent } from "./AppComponent.mjs";

export class View extends AppComponent{
    constructor(){
        super();
     
            this.addEventListener('update:trackers', (e) => {

                this.refetchData();
            })
        

    }





    refetchData(){
        console.log("no refetch data method override");
    }
}