import { AppComponent, loadHTML } from "./AppComponent.mjs";
export class CreateTracker extends AppComponent {
    constructor() {
        super();
    }

    static htmlpath = "./views/createTracker.html";


    init() {
        console.log("hallo from create tracker");
        this.today = Date(Date.now());
        console.log(this.today.toString());
        this.innerHTML = this.getHTML();
    }

    async connectedCallback() {
        this.innerHTML = await this.getHTML();
        const modeContainer = this.querySelector("#ct-track-mode");
        

        // Select all number input wrappers
        this.querySelectorAll('.number-input-wrapper').forEach(wrapper => {
            const input = wrapper.querySelector('.custom-number-input');
            console.log("hello im trying to make the buttons work")
            // Add click event listener to the wrapper
            wrapper.addEventListener('click', (e) => {
                // Get wrapper dimensions
                const rect = wrapper.getBoundingClientRect();
                // Calculate click position relative to the wrapper
                const clickY = e.clientY - rect.top;
                const arrowHeight = rect.height / 2; // Split height into two arrows

                // Trigger stepUp() if click is on the top arrow, stepDown() if on bottom
                if (clickY < arrowHeight) {
                    input.stepUp();
                } else {
                    input.stepDown();
                }

                // Dispatch "input" event to update form listeners (e.g., React state)
                input.dispatchEvent(new Event('input'));
            });
        });

        const iconSelectorButton = this.querySelector("#iconselector-invoker");


        document.addEventListener("icon-change", (e) =>{
            
            console.log("message recieved: ");
            const currentIconInput = document.querySelector("#is-input");
            console.log("icon input:", currentIconInput);
            iconSelectorButton.querySelector("#icon-contour").classList = "ph " + currentIconInput.value;
            iconSelectorButton.querySelector("#icon-fill").classList = "ph-fill " + currentIconInput.value;
        })

        console.log(modeContainer);
        Array.from(modeContainer.children).forEach(el => {
            el.classList.add("input-hidden");
        });
        let chosenMode;
        let lastClicked;

        const modeButtons = this.querySelector(".button-group");
        modeButtons.addEventListener("click", (e) => {
            e.preventDefault;
            chosenMode = e.target.id;

            switch (chosenMode) {
                case "ct-starsys":
                    console.log("star system");
                    if (lastClicked) {
                        lastClicked.classList.add("input-hidden")
                    }
                    var itemToDisplay = this.querySelector("ac-starsystem");
                    itemToDisplay.classList.remove("input-hidden");
                    lastClicked = itemToDisplay;

                    break;
                case "ct-checkbox":
                    console.log("checkbox");
                    if (lastClicked) {
                        lastClicked.classList.add("input-hidden")
                    }
                    var itemToDisplay = this.querySelector("ac-iconcheckbox");
                    itemToDisplay.classList.remove("input-hidden");
                    lastClicked = itemToDisplay;
                    break;
                case "ct-time":
                    console.log("time");
                    if (lastClicked) {
                        lastClicked.classList.add("input-hidden")
                    }
                    var itemToDisplay = this.querySelector("#ct-number-input");
                    itemToDisplay.classList.remove("input-hidden");
                    lastClicked = itemToDisplay;
                    break;
                case "ct-free":
                    console.log("free text");
                    if (lastClicked) {
                        lastClicked.classList.add("input-hidden")
                    }
                    var itemToDisplay = this.querySelector("textarea");
                    itemToDisplay.classList.remove("input-hidden");
                    lastClicked = itemToDisplay;
                    break;
                default: console.warn("id ", chosenMode, " is not valid id.");
                    break;
            }

        })
    


    
    }
    async getHTML() {
        return await loadHTML(CreateTracker.htmlpath);
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