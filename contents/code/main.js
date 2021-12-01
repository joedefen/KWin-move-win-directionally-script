/*
KWin Script Move Win Directionally
(C) 2021 Joe Defen <joe@jdef.ga>
GNU General Public License v3.0
*/

const DB = true;
function db(...args) {if (DB) {console.debug(...args);}}
db("initializing Move Win Directionally");

function screen_to_the(direction, current_screen) {
    // shift the current screen in the given direction and compute screen_to_the
    // overlap with all other screens to find the one with the most.
    // If returns the best overlapping screen if any; otherwise returns the current screen.
    const screen_geo = workspace.clientArea(KWin.MaximizeArea, current_screen, workspace.currentDesktop);
    // const shifted_geo = Object.assign({}, screen_geo);
    const shifted_geo = JSON.parse(JSON.stringify(screen_geo));
                                    
    if (direction == "right") {
        shifted_geo.x += shifted_geo.width;
    } else if (direction == "left") {
        shifted_geo.x -= shifted_geo.width;
    } else if (direction == "down") {
        shifted_geo.y += shifted_geo.height;
    } else if (direction == "up") {
        shifted_geo.y -= shifted_geo.height;
    }
    var best_overlap = 0;
    var best_screen = current_screen;
    for (var i = 0; i < nscreens; i++) {
        var geo = workspace.clientArea(KWin.MaximizeArea, i, workspace.currentDesktop);
        var tlx = Math.max(shifted_geo.x, geo.x);
        var tly = Math.max(shifted_geo.y, geo.y);
        var brx = Math.min(shifted_geo.x + shifted_geo.width, geo.x + geo.width);
        var bry = Math.min(shifted_geo.y + shifted_geo.height, geo.y + geo.height);
        var overlap = Math.max(0, brx-tlx) * Math.max(0, bry - tly);
        if (overlap > best_overlap) {
            best_overlap = overlap;
            best_screen = i;
        }
    }
    return best_screen;
}

if (DB) {
    var client = workspace.activeClient;
    var nscreens = workspace.numScreens;
    db("nscreens", nscreens)
    for (var i = 0; i < nscreens; i++) {
        var geo = workspace.clientArea(KWin.MaximizeArea, i, workspace.currentDesktop);
        db(i, JSON.stringify(geo), "screen_to_the", "right", screen_to_the("right", i));
        db(i, JSON.stringify(geo), "screen_to_the", "left", screen_to_the("left", i));
        db(i, JSON.stringify(geo), "screen_to_the", "up", screen_to_the("up", i));
        db(i, JSON.stringify(geo), "screen_to_the", "down", screen_to_the("down", i));
    }
}

function move_win(direction) {
    if (DB) db("move_win(", direction, ")");
    var client = workspace.activeClient;
    if (client == null || !client.normalWindow) return;
    new_screen = screen_to_the(direction);
    workspace.sendClientToScreen(client, new_screen);
    // clip and move client into bounds of screen dimensions
    if (!client.moveable) return;
    area = workspace.clientArea(KWin.WorkArea, client);
    // window width/height maximally screen width/height
    client.geometry.width = Math.min(client.width, area.width);
    client.geometry.height = Math.min(client.height, area.height);
    // left/top window edge between left and right/top and bottom screen edges
    client.geometry.x = Math.max(area.x, Math.min(area.x + area.width - client.width, client.x));
    client.geometry.y = Math.max(area.y, Math.min(area.y + area.height - client.height, client.y));
}
    
function move_win_right() { move_win("right"); }
function move_win_left() { move_win("left"); }
function move_win_up() { move_win("up"); }
function move_win_down() { move_win("down"); }

registerShortcut("Move Window Left", "Move Window Left", "Alt+H", move_win_left);
registerShortcut("Move Window Up", "Move Window Up", "Alt+K", move_win_up);
registerShortcut("Move Window Down", "Move Window Down", "Alt+J", move_win_down);
registerShortcut("Move Window Right", "Move Window Right", "Alt+L", move_win_right);
