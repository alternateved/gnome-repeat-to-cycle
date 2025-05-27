import Gio from "gi://Gio";
import Meta from "gi://Meta";
import Shell from "gi://Shell";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as AppFavorites from "resource:///org/gnome/shell/ui/appFavorites.js";
import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";

export default class RepeatToCycle extends Extension {
  #settings = null;
  #lastActivatedApp = null;
  #cachedWindowOrder = null;

  _getAppWindows(app) {
    return app
      .get_windows()
      .sort((a, b) => b.get_user_time() - a.get_user_time());
  }

  _getNthFavoriteApp(n) {
    if (!Main.sessionMode.hasOverview) return null;
    const apps = AppFavorites.getAppFavorites().getFavorites();
    return apps[n];
  }

  _overrideSwitchToApplication() {
    for (let i = 1; i < 10; i++) {
      const key = `switch-to-application-${i}`;

      if (global.display.remove_keybinding(key)) {
        const handler = (_, __, ___, keybinding) => {
          const [, , , target] = keybinding.get_name().split("-");
          const app = this._getNthFavoriteApp(target - 1);
          if (!app) return;

          Main.overview.hide();
          const windows = this._getAppWindows(app);

          if (windows.length === 0) {
            app.activate();
            this.#lastActivatedApp = app;
            this.#cachedWindowOrder = null;
            return;
          }

          if (windows.length === 1) {
            const win = windows[0];
            if (win.has_focus()) {
              return;
            } else {
              win.activate(global.get_current_time());
              this.#lastActivatedApp = app;
              this.#cachedWindowOrder = null;
            }
            return;
          }

          const currentWindow = windows.find((w) => w.has_focus());
          const shouldRefreshCache =
            this.#lastActivatedApp !== app ||
            !this.#cachedWindowOrder ||
            this.#cachedWindowOrder.length !== windows.length;

          if (shouldRefreshCache) {
            this.#cachedWindowOrder = windows;
          }

          let nextWindow;
          if (currentWindow) {
            const currentIndex = this.#cachedWindowOrder.indexOf(currentWindow);
            const nextIndex =
              (currentIndex + 1) % this.#cachedWindowOrder.length;
            nextWindow = this.#cachedWindowOrder[nextIndex];
          } else {
            nextWindow = windows[0];
          }

          nextWindow.activate(global.get_current_time());
          this.#lastActivatedApp = app;
        };

        global.display.add_keybinding(
          key,
          this.#settings,
          Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
          handler,
        );
      }
    }
  }

  _restoreSwitchToApplication() {
    for (let i = 1; i < 10; i++) {
      const key = `switch-to-application-${i}`;

      if (global.display.remove_keybinding(key)) {
        Main.wm.addKeybinding(
          key,
          this.#settings,
          Meta.KeyBindingFlags.IGNORE_AUTOREPEAT,
          Shell.ActionMode.NORMAL | Shell.ActionMode.OVERVIEW,
          Main.wm._switchToApplication.bind(Main.wm),
        );
      }
    }
  }

  enable() {
    this.#settings = new Gio.Settings({
      schema_id: "org.gnome.shell.keybindings",
    });

    this._overrideSwitchToApplication();
  }

  disable() {
    this._restoreSwitchToApplication();
    this.#settings = null;
    this.#lastActivatedApp = null;
    this.#cachedWindowOrder = null;
  }
}
