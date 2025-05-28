# Repeat To Cycle

Gnome extension that implements enhanced `Super + <number>` behavior from [gnome-shell #2725](https://gitlab.gnome.org/GNOME/gnome-shell/-/issues/2725).

This is how it works:
1. Launch the nth dash application if not running.
2. Focus the application's most recent window if running but unfocused.
3. Cycle to the next window if application is focused (repeated presses cycle through all windows).
4. No action if application has focus and only one window exists.

This adds app window cycling to Gnome's dash shortcuts (`switch-to-application-<number>`).

## Installation
This extension is available on [extensions.gnome.org](https://extensions.gnome.org/extension/8222/repeat-to-cycle/). You can install from there or install manually. By installing from extensions.gnome.org you will always have the latest update.

### Manual
The following commands will install the extension:
```sh
git clone https://github.com/alternateved/gnome-repeat-to-cycle.git
cd gnome-repeat-to-cycle
make install
```

Logout and login required after manual installation.
