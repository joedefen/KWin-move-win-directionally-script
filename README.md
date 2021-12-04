# Kwin Move Window Directionally Script

Extension for KDE’s window manager adding keyboard shortcuts to move windows directionally
(i.e., left, up, down, right).

- The window will be refit to the new screen if necessary.
- If there is no screen in that direction, then the window will be refit to the current screen.
    - **ALT-H** - move window left
    - **ALT-J** - move window down
    - **ALT-K** - move window up
    - **ALT-L** - move window right

The advantages over KDE's built-in window movers are:
- For some fingers, the vim-key bindings will be more memorable.
- For moving an off-screen or over-sized window fully onto the same screen, the same key-bindings work
  if the target is the same screen (e.g., move down with no screen below fits the window to the current screen).
- The moved window is raised above other windows in the destination screen.

NOTE: just as for the built-in movers, the mouse cursor is left behind. For this script,
the design intent was to move the mouse into the moved window,
but no practical way to do that from a KWin script has been found.

[TBD: view in KDE Store](https://store.kde.org/p/xxxxxxx).
* There are no current plans to add this script to the KDE store since I do not use this script on a regular basis.
  because of the current unrectifiable mouse cursor left behind deficiency.
* Instead, I use [MoveWindow](https://github.com/joedefen/MoveWindow) which has less annoying caveats for my personal use.

## Installation

### Dependencies

`kwin` (tested with v5.23 on X11).

### Method 1: via command line

```bash
git clone https://github.com/joedefen/KWin-move-win-directionally-script.git
plasmapkg2 --type kwinscript -i KWin-move-win-directionally-script
kwriteconfig5 --file kwinrc --group Plugins --key movewindirectionallyEnabled true
qdbus org.kde.KWin /KWin reconfigure
```

### Method 2: via graphical interface (TBD)

1. Install the script via *System Settings* > *Window Management* > *KWin Scripts* > *Get New Scripts …* > search for *Move Directionally* > *Install*.
2. Activate the script by selecting the checkbox in the respective entry.

## Configuration

To set the shortcuts to trigger the actions, go to *Settings* > *Shortcuts* > search for *Move Directionally* … > set your preferred shortcuts.


## Small Print

© 2021 Joe Defen \<joe@jdef.ga\>

And many thanks to [@nclarius](https://github.com/nclarius) for consultation needed to develop this project.

This work is licensed under the GNU General Public License v3.0.  
This program comes with absolutely no warranty.  
This is free software, and you are welcome to redistribute and/or modify it under certain conditions.  
