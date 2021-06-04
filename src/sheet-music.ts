import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { IOSMDOptions, OpenSheetMusicDisplay } from "opensheetmusicdisplay";

type BackendType = "svg" | "canvas";
type DrawingType = "compact" | "default";

@customElement("sheet-music")
export class SheetMusic extends LitElement {
  @property({ type: Boolean }) allowDrop = false;
  @property() src = "";

  @query("main") canvas!: HTMLCanvasElement;

  controller?: OpenSheetMusicDisplay;
  options: IOSMDOptions = {
    autoResize: true,
    backend: "canvas" as BackendType,
    drawingParameters: "default" as DrawingType,
  };
  _zoom = 1.0;

  static styles = css`
    main {
      overflow-x: auto;
    }
  `;

  render() {
    return html`<main></main>`;
  }

  async renderMusic(content: string) {
    if (!this.controller) return;
    await this.controller.load(content);
    this.controller.zoom = this._zoom;
    this.controller.render();
    this.requestUpdate();
  }

  private async getMusic(): Promise<string> {
    if (this.src.length > 0) return fetch(this.src).then((res) => res.text());
    const elem = this.parentElement?.querySelector(
      'script[type="text/xml"]'
    ) as HTMLScriptElement;
    if (elem) return elem.innerHTML;
    return "";
  }

  async firstUpdated() {
    this.controller = new OpenSheetMusicDisplay(this.canvas, this.options);
    this.requestUpdate();
    const music = await this.getMusic();
    if (music) this.renderMusic(music);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "sheet-music": SheetMusic;
  }
}
