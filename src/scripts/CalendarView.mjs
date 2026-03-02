import { AppComponent, loadHTML } from "./AppComponent.mjs";


export class CalendarView extends AppComponent {
  constructor() {
    super();
  }

  static today = new Date();
  selectedmonth = CalendarView.today.getMonth();
  
  renderDays = () => {
    let month = new Date(CalendarView.today.getFullYear(), this.selectedmonth);
    this.querySelector(".cal-sel-month").textContent = month.toLocaleDateString(
      "fr-FR",
      { month: "long", year: "numeric" },
    );
    this.querySelector(".cal-now-weekday").textContent =
      CalendarView.today.toLocaleDateString("fr-FR", { weekday: "long" });
    this.querySelector(".cal-now-date").textContent =
      CalendarView.today.toLocaleDateString("fr-FR", { day: "numeric" });
    this.querySelector(".cal-now-month").textContent =
      CalendarView.today.toLocaleDateString("fr-FR", { month: "long" });

    let firstday = new Date( //date of the 1st of the month
      CalendarView.today.getFullYear(),
      this.selectedmonth,
      1,
    );

    let offset = -((firstday.getDay() + 6) % 7) - 1;
    console.log(offset, firstday.toDateString());

    let arrofdivs = Array.from(document.getElementsByClassName("dyn-day"));

    let calStart = new Date(firstday);
    calStart.setDate(calStart.getDate() + offset);
    let numberOfDays = new Date(firstday);
    numberOfDays.setFullYear(
      numberOfDays.getFullYear(),
      numberOfDays.getMonth() + 1,
      numberOfDays.getDate() - 1,
    );
    numberOfDays = numberOfDays.getDate();

    for (const el of arrofdivs) {
      calStart.setDate(calStart.getDate() + 1);
      offset++;
      let today = (false)
      if (offset >= 0 && offset < numberOfDays) {
        el.innerHTML = `<div class="cal-dates-cont ${today ? "today" : ""} date:"${calStart.toLocaleDateString("FR-fr", {day: "2-digit"}) + calStart.toLocaleDateString("FR-fr", {month: "2-digit"}) + calStart.getFullYear()}" style="width: 100%;">${calStart.toLocaleDateString("FR-fr", { day: "numeric" })}</div>`;
      } else {
        el.innerHTML = `<div class="cal-dates-cont cal-inactive" style="width: 100%;">${calStart.toLocaleDateString("FR-fr", { day: "numeric" })}</div>`;
      }
    }
  };

  async connectedCallback() {
    console.log("from connectedCallback:", this.today);
    this.innerHTML = await this.getHTML();
    setTimeout(this.renderDays, 20);
    this.querySelector(".cal-next-month").addEventListener("click", (e) => {
      this.selectedmonth++;
      this.renderDays();
      console.warn(this.selectedmonth);
    });
    this.querySelector(".cal-prev-month").addEventListener("click", (e) => {
      this.selectedmonth--;
      this.renderDays();
      console.warn(this.selectedmonth);
    });
  }

  static htmlpath = "./views/calendarView.html";

  async getHTML() {
    this.innerHTML = await loadHTML(CalendarView.htmlpath);
    return this.innerHTML;
  }

  render(el) {
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
    el.appendChild(this);
  }
}

customElements.define("ac-calendar", CalendarView);