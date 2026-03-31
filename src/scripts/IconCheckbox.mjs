import { AppComponent, loadHTML } from "./AppComponent.mjs";
export class IconCheckbox extends AppComponent {
    constructor(inputEl) {
        super();
        this.phosphorId = "ph-plant"
        if(inputEl){
            this.inputEl =inputEl;
        }
        else{
            this.inputEl=document.createElement("input");
        this.inputEl.className="input-hidden";        }

    }

    static htmlpath = "./views/iconCheckbox.html";


    init() {

        this.innerHTML = this.getHTML();
    }

    async connectedCallback() {
        this.innerHTML = await this.getHTML();

        if(this.dataset.icon){
            this.phosphorId = this.dataset.icon
        }


        
        const icon = this.querySelector("#icon-content");
        const contour = this.querySelector("#icon-contour");
        icon.classList="ph-fill "+this.phosphorId;
        contour.classList="ph "+this.phosphorId;

        this.addEventListener("click", (e) => {this.manageClick();
            });

    }
    async getHTML() {
        return await loadHTML(IconCheckbox.htmlpath);
    }

    adjustMode(){
        const mode=this.dataset.options;
        console.log("adjusting mode...", mode)
        switch(mode){
            case "on/off": 
            console.log("case on off")
            return true;
           

            case "empty/partial/full":
                console.log("case 3 step")
                return false;
           

            default: console.log("case default");
            return true;
        }
    }

    manageClick(){
        
        const icon = this.querySelector("#icon-content");
        console.log("clicked. ", icon.classList);

        if (this.isNormalCheckbox){

   

            switch (icon.classList[2]) {
                case "empty":
                    console.log("star was empty. make it full")

                    icon.classList.replace("empty", "full");
                    this.inputEl.value = "full";
                    break;
                case "full":
                    console.log("star was full. make it empty")
                    icon.classList.replace("full", "empty");
                    this.inputEl.value = "empty";
                    break;
                default:
                    console.log("star was nothing, make it empty");
                    icon.classList.add("empty");
                    this.inputEl.value = "empty";
            }
        }

        else{


                    switch (icon.classList[2]) {
            case "empty":
                console.log("star was empty. make it half")

                icon.classList.replace("empty", "half");
                            this.inputEl.value = "half";
                break;
                
            case "half":
                console.log("star was half. make it full")
                icon.classList.replace("half", "full");
                            this.inputEl.value = "full";


                break;
            case "full":
                console.log("star was full. make it empty")
                icon.classList.replace("full", "empty");
                            this.inputEl.value = "empty";
                break;
            default:
                console.log("star was nothing, make nothing");
                icon.classList.add("empty");
                    this.inputEl.value = "empty";
            }
        }

        this.isNormalCheckbox = this.adjustMode();

    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }


}

customElements.define("ac-iconcheckbox", IconCheckbox);