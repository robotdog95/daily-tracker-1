//so, promptview is not responsible of much except rendering the right components.

import { AppComponent, loadHTML } from "./AppComponent.mjs";
import { Tracker, Category } from "./Tracker.mjs";
import { AddEntry } from "./AddEntry.mjs";
import { RenderTrackerInput } from "./RenderTrackerInput.mjs";

export class PromptView extends AppComponent {

    constructor(day) {
        super();
        if (day) {
            this.day = day;
        }
        else { this.today = Date(Date.now()); }

    }

    static htmlpath = "./views/promptView.html";

    init() {

        this.innerHTML = this.getHTML();
    }


    async connectedCallback() {
        this.trackers = await (window.db.findByPrefix("tracker"));
        this.categories = await (window.db.findByPrefix("cat"));
        //this.prefs - user preferences such as filters for asleep trackers

        this.load();
        
    }

    async load(){
        console.log("loading...")
        /*it will look like a list:

           v CAT1
            tracker 1: xxxxx
            tracker 2: xxxxx
           > CAT2
           > CAT3

            SAVE
        */

            this.categories.forEach(category => {
                console.log("now loading ",category)
                let catEl=document.createElement("ul");
                catEl.id=category.id;
                catEl.innerText=category.name;
                let cat = new Category(category.name);
                let thisCatTrackers = cat.updatePointers(this.trackers);
                console.log("trackers in cat ",cat.name,": ",thisCatTrackers);

                thisCatTrackers.forEach(tracker => {
                 catEl.append(new AddEntry(tracker,false));
                })
                this.append(catEl);
            });
    }

    async getHTML() {
        return await loadHTML(PromptView.htmlpath);
    }

    render(el) {
        while (el.firstChild) {
            el.removeChild(el.firstChild);
        }
        el.appendChild(this);
        console.warn(el, this)
    }

}

customElements.define("ac-promptview", PromptView);
