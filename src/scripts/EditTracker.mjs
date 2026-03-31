import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";


export class EditTracker extends AppComponent { //maybe make a class ManageTracker that extends to edit and create...

    constructor(tracker) {
        super();
        this.tracker = tracker;

    }

    static htmlpath = "./views/editTracker.html";

    init() {
        this.innerHTML = this.getHTML();
    }


    async connectedCallback() {
        let event = new CustomEvent('update:trackers', { bubbles: true });
        this.innerHTML = await this.getHTML();
        console.warn("edit tracker initiated. Tracker: ", this.tracker);

        this.categories = await (window.db.findByPrefix("cat"));


        this.form = this.querySelector("#et-form");
        this.nameField = this.querySelector("#et-name");
        this.iconField = this.querySelector("#icon-input")
        this.catField = this.querySelector("#et-category");



        this.populateFields();

        const submitButton = this.querySelector("#submitedittracker");
        submitButton.addEventListener("click", (e) => {
            e.preventDefault;
            console.log("submitting edited tracker...")
            const formData = new FormData(this.form);
            this.tracker.name = formData.get("name");
            this.tracker.icon = formData.get("icon");
            this.tracker.category = formData.get("category");
            console.log("modified tracker: ", this.tracker);

            window.db.put(this.tracker);
            this.dispatchEvent(event);
        })

        const deleteButton = this.querySelector("#deletetracker");
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault;
            if (confirm("Are you sure you want to delete this tracker?") == true) {
                //delete tracker
                let result=this.requestDelete();
                if(result){
                    alert("successfuly removed tracker");
                    this.parentElement.close();
                    this.dispatchEvent(event);
                }
            }
            else{
                alert("tracker deletion canceled")
            }
        })



        //2. Process edit: send to main and overwrite the previous tracker
    }

    async requestDelete(){
        console.warn("Edit tracker - requestDelete - elId: ",this.tracker.elId)
    const result=await window.db.removeShit("tracker"+this.tracker.elId);
    if(result){
        console.log(result);
        return true;
    }    
    else{
        return false;
    }
    }

    populateFields() {
        this.nameField.value = this.tracker.name;
        this.iconField.value = this.tracker.icon;

        this.categories.forEach(category => {
            let option = document.createElement("option");
            option.name = "category";
            option.value = category.name;
            option.id = "option-cat-" + category.name;
            option.innerText = category.name;
            this.catField.append(option);
            this.catField.value = this.tracker.category;
        });
    }

    async getHTML() {
        return await loadHTML(EditTracker.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }

}

customElements.define("ac-edittracker", EditTracker);
