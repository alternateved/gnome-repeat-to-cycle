
submit:
	cd repeat-to-cycle@alternateved.com/ && zip -r ~/cycleToRepeat.zip *

install:
	rm -rf ~/.local/share/gnome-shell/extensions/repeat-to-cycle@alternateved.com
	cp -r repeat-to-cycle@alternateved.com ~/.local/share/gnome-shell/extensions/
