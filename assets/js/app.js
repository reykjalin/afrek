// If you want to use Phoenix channels, run `mix help phx.gen.channel`
// to get started and then uncomment the line below.
// import "./user_socket.js"

// You can include dependencies in two ways.
//
// The simplest option is to put them in assets/vendor and
// import them using relative paths:
//
//     import "../vendor/some-package.js"
//
// Alternatively, you can `npm install some-package --prefix assets` and import
// them using a path starting with the package name:
//
//     import "some-package"
//

// Include phoenix_html to handle method=PUT/DELETE in forms and buttons.
import "phoenix_html";
// Establish Phoenix Socket and LiveView configuration.
import { Socket } from "phoenix";
import { LiveSocket } from "phoenix_live_view";
import topbar from "../vendor/topbar";
import Sortable from "../vendor/sortable";

const hooks = {
  // Squire is included via <script> tag in the root.html.heex template.
  Editor: {
    mounted() {
      const editorElem = this.el.querySelector(`#${this.el.id}-editor`);
      this.editor = new Squire(editorElem, { blockTag: "P" });

      this.registerEvents();

      // Window event listeners with server-pushed events.
      window.addEventListener("phx:task_added", (e) => {
        if (this.editor) {
          this.editor.setHTML("<p><br></p>");
        }
      });
    },

    beforeUpdate() {
      // Save the content since the Phoenix LiveView form updates will reset the form data.
      this.editorContent = this.editor.getHTML();

      this.editor.destroy();
    },

    updated() {
      const editorElem = this.el.querySelector(`#${this.el.id}-editor`);
      this.editor = new Squire(editorElem, { blockTag: "P" });
      this.editor.setHTML(this.editorContent);

      this.registerEvents();
    },

    registerEvents() {
      this.el.addEventListener("toggle_code", () => {
        this.editor.toggleCode();
      });
      this.el.addEventListener("toggle_bold", () => {
        if (this.editor.hasFormat("b")) {
          this.editor.removeBold();
        } else {
          this.editor.bold();
        }
      });
      this.el.addEventListener("toggle_italic", () => {
        if (this.editor.hasFormat("i")) {
          this.editor.removeItalic();
        } else {
          this.editor.italic();
        }
      });
      this.el.addEventListener("toggle_underline", () => {
        if (this.editor.hasFormat("u")) {
          this.editor.removeUnderline();
        } else {
          this.editor.underline();
        }
      });
      this.el.addEventListener("toggle_ordered_list", () => {
        if (this.editor.hasFormat("ol")) {
          this.editor.removeList();
        } else {
          this.editor.makeOrderedList();
        }
      });
      this.el.addEventListener("toggle_unordered_list", () => {
        if (this.editor.hasFormat("ul")) {
          this.editor.removeList();
        } else {
          this.editor.makeUnorderedList();
        }
      });
      this.el.addEventListener("undo", () => {
        this.editor.undo();
      });
      this.el.addEventListener("redo", () => {
        this.editor.redo();
      });
      this.el.addEventListener("toggle_link", () => {
        if (this.editor.hasFormat("a")) {
          this.editor.removeLink();
        } else {
          const url = prompt("Enter the URL");
          if (url) {
            this.editor.makeLink(url);
          }
        }
      });
    },
  },
  SubmitTask: {
    mounted() {
      this.el.addEventListener("formdata", (event) => {
        const formData = event.formData;
        const editorElem = this.el.querySelector(`div[contenteditable="true"]`);

        // Append the Squire editor contents to the form data submitted to the server.
        formData.append("details", editorElem.innerHTML);
      });
    },
  },
  Sortable: {
    mounted() {
      this.sortable = new Sortable(this.el, {
        draggable: ".task-item",
        animation: 150,
        easing: "cubic-bezier(0.87, 0, 0.13, 1)",
        dragClass: "drag-item",
        ghostClass: "drag-ghost",
        onEnd: (event) => {
          const { newIndex, item } = event;
          const id = parseInt(item.id.split("-")[1]) ?? "";

          if (!id) {
            console.error("No ID found for the task that was moved.", event);
            return;
          }

          this.pushEvent("reposition_task", {
            task: id,
            "new-pos": newIndex,
          });
        },
      });
    },
  },
};

let csrfToken = document
  .querySelector("meta[name='csrf-token']")
  .getAttribute("content");
let liveSocket = new LiveSocket("/live", Socket, {
  params: {
    _csrf_token: csrfToken,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  },
  hooks,
});

// Show progress bar on live navigation and form submits
topbar.config({ barColors: { 0: "#29d" }, shadowColor: "rgba(0, 0, 0, .3)" });
window.addEventListener("phx:page-loading-start", (_info) => topbar.show(300));
window.addEventListener("phx:page-loading-stop", (_info) => topbar.hide());

// connect if there are any LiveViews on the page
liveSocket.connect();

// expose liveSocket on window for web console debug logs and latency simulation:
// >> liveSocket.enableDebug()
// >> liveSocket.enableLatencySim(1000)  // enabled for duration of browser session
// >> liveSocket.disableLatencySim()
window.liveSocket = liveSocket;
