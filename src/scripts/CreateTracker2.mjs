import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class CreateTracker extends AppComponent {
    constructor() {
        super();
    }

    static htmlpath = "./views/createTracker2.html";


    init() {
        this.today = Date(Date.now());
        console.log(this.today.toString());
        this.innerHTML = this.getHTML();
        
    }

    async connectedCallback() {

        this.innerHTML = await this.getHTML();
        const form = this.querySelector("#form-new-tracker");
        const closeButton = this.querySelector("#ct-close");
        closeButton.addEventListener("click", (e) =>{
            this.resetWindow();
        });
        const iconSelectorButton = this.querySelector("#iconselector-invoker");

        const submitButton = this.querySelector("#submitcreatetracker");
        console.log(submitButton)
        submitButton.addEventListener("click", (e) =>{
            e.preventDefault;
            this.makeFormData();
            this.displayConfirm();
        })

        document.addEventListener("icon-change", (e) =>{
            
            console.log("message recieved: ");
            const currentIconInput = document.querySelector("#icon-input");
            console.log("icon input:", currentIconInput);
            iconSelectorButton.querySelector("#icon-contour").classList = "ph " + currentIconInput.value;
            iconSelectorButton.querySelector("#icon-fill").classList = "ph-fill " + currentIconInput.value;
        })

    
        form.addEventListener("change", (e) => {
            e.preventDefault;
            if (e.target.id != "timeslider-preview"){
                console.warn("target of event change : ", e.target, ". Whole event: ", e)
                
                this.makeFormData();
                


            }

        })


    
    
    }


    async getHTML() {
        return await loadHTML(CreateTracker.htmlpath);
    }

    displayConfirm(){
        const confirmDiv = this.querySelector("#cc-confirm-make");
        confirmDiv.classList.toggle("hidden", false);
        this.querySelector("form").classList.toggle("hidden", true);
    }

    resetWindow(){
        //check if the displayconfirm is active
        //reset the form
        const confirmDiv = this.querySelector("#cc-confirm-make");
        confirmDiv.classList.toggle("hidden", true);
        const form = this.querySelector("#form-new-tracker");
        form.reset();
        form.classList.toggle("hidden", false);
        this.makeFormData();

    }

    makeFormData(){
        const form = this.querySelector("#form-new-tracker");
        console.log(form);
        const formData = new FormData(form);
        console.log(formData);

        const name = formData.get("name");
        const icon = formData.get("icon");
        const color = "gray"
        const maxValue = formData.get("max-value");
        const defValue = formData.get("def-value");
        const mode = formData.get("track-mode");
        const tracker = new Tracker(name, mode, color, icon, maxValue, defValue);
        updatePreview(tracker);

        function updatePreview(tracker) {
            /* access form data and inject it to preview */
            const trackerCard = document.querySelector("#ct-preview");
            if (trackerCard) {
                trackerCard.dataset.name = tracker.name;
                trackerCard.dataset.color = tracker.color;
                trackerCard.dataset.icon = tracker.icon;
                trackerCard.dataset.mode = tracker.mode;
                trackerCard.dataset.maxvalue = tracker.maxValue;
                trackerCard.dataset.defvalue = tracker.defValue;

                console.log(trackerCard);
                trackerCard.dispatchEvent(new Event('updatepreview'));
                console.log("event dispatched")

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

customElements.define("ac-createtracker", CreateTracker);