import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker } from "./Tracker.mjs";
export class CreateTracker extends AppComponent {
    constructor() {
        super();
    }

    static htmlpath = "./views/createTracker.html";


    init() {
        this.today = Date(Date.now());
        console.log(this.today.toString());
        this.innerHTML = this.getHTML();
        this.tracker = new Tracker();
        
    }

    async connectedCallback() {



        this.innerHTML = await this.getHTML();
        this.categories = await (window.db.findByPrefix("cat"));
        const form = this.querySelector("#form-new-tracker");
        const closeButton = this.querySelector("#ct-close");
        this.makeFormData();

        closeButton.addEventListener("click", (e) =>{
            this.resetWindow();
        });
        const iconSelectorButton = this.querySelector("#iconselector-invoker");

        const catInputZone = this.querySelector("#category");
        this.categories.forEach(category => {
            let option=document.createElement("option");
            option.name="category";
            option.value=category.name;
            option.id="option-cat-"+category.name;
            option.innerText=category.name;
            catInputZone.append(option)
        });

        const submitButton = this.querySelector("#submitcreatetracker");

        submitButton.addEventListener("click", (e) =>{
            console.log("submitting tracker...")
            e.preventDefault;
            this.makeFormData();
            const check=this.checkTracker();
            console.log("check value: ", check)
            if(check!=true){
                console.log("something went wrong: ", check)
                
            }
            else { this.end(); }

        })

        document.addEventListener("icon-change", (e) =>{
            
            const currentIconInput = document.querySelector("#icon-input");
            iconSelectorButton.querySelector("#icon-contour").classList = "ph " + currentIconInput.value;
            iconSelectorButton.querySelector("#icon-fill").classList = "ph-fill " + currentIconInput.value;
        })

    
        form.addEventListener("change", (e) => {
            e.preventDefault;
            
            if (e.target.id == "track-mode" || e.target.name == "name" || e.target.id == "icon-input" || e.target.id == "color-input" || e.target.name == "max-value"){
                console.warn("target of event change : ", e.target, ". Whole event: ", e)
                
                this.makeFormData();
                
            }
            if(e.target.name=="tracker-radio-option"){
                console.log(e.target);
                this.tracker.options=e.target.value;
                console.log("options to put: ", this.tracker.options);
                const trackerCard = document.querySelector("#ct-preview");

                trackerCard.dataset.options=this.tracker.options;
                trackerCard.dispatchEvent(new Event('refreshoptions'));
            }

        })
    }


    async getHTML() {
        return await loadHTML(CreateTracker.htmlpath);
    }


    end(){
        console.warn("end: CREATING TRACKER: ",this.tracker);
        console.log("is tracker elid a function? wtf: ", this.tracker.elId);
        //send tracker to database here
        
        window.api.sendData(this.tracker, "new-tracker");


        const resume = document.createElement("span");
        resume.id="ct-resume";
        resume.innerText=this.tracker.displayData();

        const confirmDiv = this.querySelector("#cc-confirm-make");
        confirmDiv.classList.toggle("hidden", false);

        confirmDiv.append(resume);

        this.querySelector("form").classList.toggle("hidden", true);
    
    }

    resetWindow(){
        //check if the end is active
        //reset the form
        const confirmDiv = this.querySelector("#cc-confirm-make");
        confirmDiv.classList.toggle("hidden", true);
        const form = this.querySelector("#form-new-tracker");
        form.reset();
        form.classList.toggle("hidden", false);
        this.makeFormData();

    }

    checkTracker(){ //remake this one, it's wonky
        //rules:
        ////name: not blank
        ////icons: if blank, assign star
        ////color: we'll see
        ////maxValue: i think we handle it elsewhere
        ////defValue: osef
        ////mode: needed
        ////options: depending on mode, some are needed
        ////category: if blank, go to default category
        let nameok=false;
        let iconok = false;
        let categoryok = false;
        let modeok = false;

        let output=[];

        if(!this.tracker.name){
            output="noname"
            return [output, this.tracker];
        }
        else if (this.tracker.name == ""){
            output = "noname_empty";
            return [output, this.tracker];
        }

        else{
            nameok=true;
            console.log("name is ok: ", this.tracker.name)
            
        }


        if(!this.tracker.icon){
            console.log("tracker has no icon: ", this.tracker.icon);
            this.tracker.icon="ph-star";
            iconok=true;
        }
        else{
            console.log("tracker icon ok: ", this.tracker.icon);
            iconok=true;
        }


        if(!this.tracker.mode){
            output="nomode";
            return [output, this.tracker];
        }
        else{
            console.log("mode ok");
            modeok=true;
        }



        if(!this.tracker.category){
            this.tracker.category="default"
            categoryok=true;
        }
        else{
            categoryok=true;
        }


        if (iconok && nameok && modeok&&categoryok) {
            console.log("everything ok")
            return true;
        }
        else{
            output="something is missing: "
            return [output, this.tracker];
        }
        
    }

    makeFormData(){
        console.log("making form data....")
        const form = this.querySelector("#form-new-tracker");
        const formData = new FormData(form);


        let name = formData.get("name");
        let icon = formData.get("icon");
        let color = "gray"
        let maxValue = formData.get("max-value");
        let defValue = formData.get("def-value");
        let mode = formData.get("track-mode");
        let options = formData.get("tracker-radio-option");
        let category = formData.get("category");


            this.tracker = new Tracker(name, mode, color, icon, maxValue, defValue, options, category);
            this.updatePreview(this.tracker);

        
        



  
    }





    updatePreview(tracker) {
        /* access form data and inject it to preview */
        const trackerCard = document.querySelector("#ct-preview");

        if (trackerCard) {
            trackerCard.dataset.name = tracker.name;
            trackerCard.dataset.color = tracker.color;
            trackerCard.dataset.icon = tracker.icon;
            trackerCard.dataset.mode = tracker.mode;
            trackerCard.dataset.maxvalue = tracker.maxValue;
            trackerCard.dataset.defvalue = tracker.defValue;
            trackerCard.dataset.options = tracker.options;

            trackerCard.dispatchEvent(new Event('updatepreview'));

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