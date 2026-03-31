import { StarSystem } from "./StarSystem.mjs";
import {IconCheckbox} from "./IconCheckbox.mjs";
import { TimeSlider } from "./TimeSlider.mjs";

export class RenderTrackerInput{

    constructor(tracker, inputField, output){
        this.tracker=tracker;
        this.inputField=inputField;
        this.output=output;
        this.makeInput();

    }

    makeInput(){
        let el;
        let wrapper = document.createElement("div");

        switch (this.tracker.mode) {

            case "starsys":
   

                el = new StarSystem(this.output);
                el = document.createElement("ac-starsystem");
                wrapper.append(el);
                this.inputField.replaceChildren(wrapper);
                break;

            case "checkbox":

               
                wrapper.className = "flex-row"
                el = new IconCheckbox(this.output);
                wrapper.append(el);
                this.inputField.replaceChildren(wrapper);
                break;

            case "time":

                el = new TimeSlider(this.output);

                wrapper.append(el);
                this.inputField.replaceChildren(wrapper);
                break;
            case "freetext":

            
                el = document.createElement("ac-freetextinput");

                wrapper.append(el);
                this.inputField.replaceChildren(wrapper);
                break;
            default:
                console.log("case default: ", this.tracker.mode);
                el = document.createElement("span");

                el.innerText = "No tracker mode assigned to tracker."
                wrapper.append(el);
                this.inputField.replaceChildren(wrapper);
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
        console.log("element generated with options: ",el.dataset.options);
        return el;
    }

}