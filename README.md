# Repeat To Cycle

Gnome extension that implements enhanced `Super + <number>` behavior from [gnome-shell #2725](https://gitlab.gnome.org/GNOME/gnome-shell/-/issues/2725).

This is how it works:
1. Launch the nth dash application if not running.
2. Focus the application's most recent window if running but unfocused.
3. Cycle to the next window if application is focused (repeated presses cycle through all windows).
4. No action if application has focus and only one window exists.

This adds window cycling to Gnome's dash shortcuts (`switch-to-application-<number>`).

## Installation
```sh
make install
```

After that reload Gnome session and enable extension.
