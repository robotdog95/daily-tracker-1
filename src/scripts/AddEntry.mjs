import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
import { Entry } from "./Entry.mjs";
import { RenderTrackerInput } from "./RenderTrackerInput.mjs";


export class AddEntry extends AppComponent { 

    constructor(tracker, alone) {
        super();
        this.tracker=tracker;
        this.alone=alone;
        

    }

    static htmlpath = "./views/addEntry.html";

    init() {
        this.today = Date(Date.now());
        this.innerHTML = this.getHTML();
    }


    async connectedCallback() {

        this.innerHTML = await this.getHTML();
        console.warn("create new entry initiated. Tracker: ", this.tracker);

        this.form=this.querySelector("#add-entry");
        this.value=this.querySelector("#value");


        this.querySelector("#tracker-name").innerText=this.tracker.name;
        this.querySelector("#tracker-icon").classList.replace("ph-star", this.tracker.icon);
        this.input=this.querySelector("#tracker-input");
        const inputHidden=this.querySelector("#value");
        inputHidden.id=this.tracker.elId+"output";

        this.inputContent = new RenderTrackerInput(this.tracker,this.input, inputHidden);

        const submitButton = this.querySelector("#submitentry");
        if(!this.alone){
            submitButton.classList.toggle("hidden", true);
        }

        else {
            submitButton.classList.toggle("hidden", false);
            submitButton.addEventListener("click", (e) => {
                e.preventDefault;
                console.log("submitting entry...")
                const formData = new FormData(this.form);
                const value=formData.get("value");
                if(value){
                    this.entry = new Entry();
                    this.tracker.entries.push(this.entry);
                    console.log("updated tracker: ", this.tracker);
                }
                else{
                    console.log("something went wrong")
                }

            })
        }




        //2. Process edit: send to main and overwrite the previous tracker
    }



    async getHTML() {
        return await loadHTML(AddEntry.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }
    
} 

customElements.define("ac-addentry", AddEntry);
