
import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { EditTracker } from "./EditTracker.mjs";
import { AddEntry } from "./AddEntry.mjs";
import { Tracker } from "./Tracker.mjs";
export class TrackerCard extends AppComponent {
    constructor(tracker, dialogable) {
        super();
        if (tracker) {
            this.tracker = tracker;
            console.log("TrackerCard: this tracker exists: ", this.tracker);
        }
        else {

            console.log("TrackerCard: no tracker assigned yet. Assigning new tracker...")
            this.tracker = new Tracker(); 
            console.log("created empty tracker for TrackerCard: ", this.tracker);
        }

        this.dialogable = dialogable;



    }

    elid() {
        
        console.log("tracker name: ", this.tracker.name) //wtf why is it both here and in Tracker
        //let a = this.tracker.name.toLowerCase();
        //return a.replaceAll(" ", "");
    }

    static htmlpath = "./views/trackerCard.html";


    init() {
        this.today = Date(Date.now());
        console.log(this.today.toString());
        this.innerHTML = this.getHTML();

    }

    async connectedCallback() {

        this.innerHTML = await this.getHTML();

        if (this.id == "ct-preview") {
            console.log("This tc is a preview: ", this.id);
        }

        else{
            console.log("This tc is not a preview. Tracker assigned: ", this.tracker);
            this.id=this.tracker.elId;
        }




        this.nameField = this.querySelector("#tracker-name");
        this.iconField = this.querySelector("#tracker-icon");
        this.inputField = this.querySelector("#tracker-input");
        this.statsField = this.querySelector(".trackercard-stats");
    


        if (document.getElementById("form-new-tracker") && this.id == "ct-preview") {
            console.warn("trakcer card is a preview")
            this.form = document.getElementById("form-new-tracker")
            this.update()
            this.addEventListener('refreshoptions', (e) => {
                e.preventDefault;
                console.log("recieved cue to refresh options");
                this.tracker.options=this.dataset.options;
                console.log("tracker options: ",this.tracker.options);
                //now, options mean we need to update the input zone
                this.input.dataset.options=this.dataset.options;
               //but we need to go further, all the way to the actual element so maybe assign the element as this.inputElement or smh
            })
            this.addEventListener('updatepreview', (e) => {
                e.preventDefault;
                console.log("received updatepreview");
                this.update();
            })

            this.querySelector(".trackercard-nav").style.display = "none";
        }
        else {
            this.populateFromDb()
            this.style = "--tracker-color: " + this.tracker.color;
        }

        if (this.dialogable == true) {
            this.makeDialogable()
        }


    }

    populateFromDb(nameField, iconField, inputField, statsField) {

        if(!nameField){
            nameField=this.nameField;
            iconField=this.iconField;
            statsField=this.statsField;
        }

        console.log("populating from db : ", this.tracker);
        nameField.innerText = this.tracker.name;
        if (this.tracker.icon) { iconField.classList.replace("ph-star", this.tracker.icon); }

        const numberOfEntries = this.tracker.entries.length;
        const entriesEl = document.createElement("span");
        entriesEl.innerText = numberOfEntries + " entries";
        statsField.append(entriesEl);

    }

    makeDialogable() {
        const clickableZone = this.querySelector(".trackercard-header");
        if (clickableZone) {
            const dialog = this.querySelector(".tc-dialog");
            const nameField = this.querySelector("#dialog-tracker-name");
            const iconField = this.querySelector("#dialog-tracker-icon");
            const inputField = this.querySelector("#dialog-tracker-input");
            const statsField = this.querySelector("#dialog-trackercard-stats");
            this.populateFromDb(nameField, iconField, inputField, statsField);



            dialog.id = this.id + "-dialog";

            const entryButton = this.querySelector("#add-entry");
            entryButton.addEventListener("click", (e) => {
                var addEntryEl = this.querySelector("ac-addentry");
                if (!addEntryEl) {
                    console.log("no entry form found. Making one...")
                    addEntryEl = new AddEntry(this.tracker, true);
                    addEntryEl.classList.toggle("hidden", true);
                    dialog.append(addEntryEl);
                }
                console.log("add entry el: ", addEntryEl);
                addEntryEl.classList.toggle("hidden", false);
            })

            const editButton = this.querySelector("#tc-edit");
            editButton.addEventListener("click", (e)=>{
                var editTrackerEl=this.querySelector("ac-edittracker");
                if(!editTrackerEl){
                    console.log("no edit tracker found. Making one...")
                    editTrackerEl=new EditTracker(this.tracker);
                    editTrackerEl.classList.toggle("hidden", true);
                    dialog.append(editTrackerEl);
                }
                console.log("edit tracker: ",editTrackerEl);
                editTrackerEl.classList.toggle("hidden", false);
            })

            const closeButton = this.querySelector("#tc-close");
            closeButton.addEventListener("click", (e) => {
                dialog.close();
            })

            clickableZone.addEventListener("click", (e) => {
                dialog.showModal();
            })

        }
    }



    update() {

        if (this.dataset.name) { this.tracker.name = this.dataset.name; }
        else { this.tracker.name = "new tracker"; }
        if (this.dataset.mode) { this.tracker.mode = this.dataset.mode; }
        else { this.tracker.mode = "none"; }
        if (this.dataset.icon) { this.tracker.icon = this.dataset.icon; }
        else { this.tracker.icon = "ph-star"; }
        if (this.dataset.color) { this.tracker.color = this.dataset.color; }
        
        else { this.tracker.color = "var(--color-shade-1)"; }


        if (this.dataset.maxvalue) {
            this.tracker.maxValue = this.dataset.maxvalue;
        }

        if (this.dataset.defvalue) {
            this.tracker.defValue = this.dataset.defvalue;
        }
        else {
            this.tracker.defValue = 1;
        }


        this.iconField.classList.replace("ph-star", this.tracker.icon);





        let el;
        let instructions;

        switch (this.tracker.mode) {

            case "starsys":

                let maxvalue;
                el = document.createElement("ac-starsystem");
                
                if (this.tracker.maxValue > 5) {
                    maxvalue = 5;
                }
                else { maxvalue = this.tracker.maxValue };
                instructions = [];
                instructions.push("max-value," + maxvalue, "def-value");
                this.toggleInputs(instructions);
                this.inputField.replaceChildren(el);
                
                break;

            case "checkbox":

                const wrapper = document.createElement("div");
                wrapper.className = "flex-row"
                this.tracker.maxValue = "2";
                instructions = [];
                instructions.push("options,Checkbox Stages:on/off&empty/partial/full");
                this.toggleInputs(instructions);
                el = document.createElement("ac-iconcheckbox");


                const title = document.createElement("span");
                title.innerText = this.tracker.name;
                wrapper.append(el, title);

                this.inputField.replaceChildren(wrapper);
                break;

            case "time":

                el = document.createElement("ac-timeslider");
                instructions = [];
                instructions.push("max-value,1000", "options,timeunit:minutes&hours&seconds");
                this.toggleInputs(instructions);

                this.inputField.replaceChildren(el);
                break;
            case "freetext":

                el = document.createElement("ac-freetextinput");

                instructions = [];
                instructions.push("options,textboxsize");
                this.toggleInputs(instructions);

                this.inputField.replaceChildren(el);
                break;
            default:
                console.log("case default: ", this.tracker.mode);
                el = document.createElement("span");

                el.innerText = "Select a tracking mode to preview it."
                this.inputField.replaceChildren(el);
                break;
        }

        el.id = "tracker-mode";
        el.name = this.tracker.name;
        el.dataset.maxvalue = this.tracker.maxValue;
        el.dataset.defvalue = this.tracker.defValue;
        el.dataset.icon = this.tracker.icon;
        el.dataset.color = this.tracker.color;
        el.dataset.options = this.tracker.options;
        this.style = "--tracker-color: " + this.tracker.color;
        this.nameField.innerText = this.tracker.name;
        this.input = el;
    }
    async getHTML() {
        return await loadHTML(TrackerCard.htmlpath);
    }

    toggleInputs(instructions) {


        const inputs = this.form.querySelectorAll(".ct-option");
        for (let i = 0; i < inputs.length; i++) {
            inputs[i].classList.toggle("hidden", true);
        }

        //instructions are of type: [] with
        // 0: "instruction(something)"
        // 1: "instruction" etc

        for (let i = 0; i < instructions.length; i++) {

            const instruction = instructions[i];
            const splitInstruction = instruction.split(",");
            let value;


            if (splitInstruction[1]) {
                value = splitInstruction[1]

            }




            for (let i = 0; i < inputs.length; i++) {

                if (inputs[i].id == splitInstruction[0]) {
                    inputs[i].classList.toggle("hidden", false);


                    if (splitInstruction[0] == "options") { //perform a special action for case options

                       
                        const splitValue = value.split(":");
                        const radioLabel = splitValue[0];
                        const radioOptions = splitValue[1].split("&");
                        const radioZone = document.createElement("fieldset");
                        radioZone.id = radioLabel;
                        for (let i = 0; i < radioOptions.length; i++) {
                            
                            var radio = document.createElement("input");
                            radio.type = "radio";
                            radio.name = "tracker-radio-option"
                            radio.value = radioOptions[i];
                            this.tracker.options=radio.value;

                            const label = document.createElement("label");
                            label.innerText = radioOptions[i];

                            const wrapper = document.createElement("div");
                            wrapper.className = "radio-label";
                            wrapper.append(radio, label);
                            radioZone.append(wrapper);
                        }

                        inputs[i].replaceChildren(radioZone);
                    }

                    if (splitInstruction[0] == "max-value") {
                        this.tracker.maxValue = value;
                    }
                    if (value && splitInstruction[0] != "options") {
                        const input = inputs[i].querySelector("input");
                        if(input&&value!="undefined"){
                            console.warn("input: ", input, "value: ", value);
                            input.value = value;
                            input.dataset.value = value;
                            input.max = value;
                        }

                    }
                }

            }


        }


    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-trackercard", TrackerCard);