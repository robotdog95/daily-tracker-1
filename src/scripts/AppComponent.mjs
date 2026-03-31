export class AppComponent extends HTMLElement {
  constructor() {
    super();
  }
  static htmlpath;
  connectedCallback() {
    console.log("stuff connected");
  }
  init() {
    this.innerHTML = this.getHTML();
    console.error("No init method overload");

  }
  async render(el) {
    console.error("No render method overload");
    el.innerHTML = `<p>No render method overload</p> `;
  }

}



export async function loadHTML(htmlPath) {
  const res = await fetch(htmlPath);
  const html = await res.text();
  return html;
}
