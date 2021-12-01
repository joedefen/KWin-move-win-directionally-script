/*
KWin Script Move Win Directionally
(C) 2021 Joe Defen <joe@jdef.ga>
GNU General Public License v3.0
*/

const DB = true;
if (DB) print("initializing Move Win Directionally");

function calc_overlap(geo1, geo2) {
    // Caculate the overlapping area of two geometries.
    var tlx = Math.max(geo1.x, geo2.x);
    var tly = Math.max(geo1.y, geo2.y);
    var brx = Math.min(geo1.x + geo1.width, geo2.x + geo2.width);
    var bry = Math.min(geo1.y + geo1.height, geo2.y + geo2.height);
    var overlap = Math.max(0, brx - tlx) * Math.max(0, bry - tly);
    return overlap;
}

function calc_distance(geo1, geo2) {
    // calculate the distance between the centers of two geometries
    delta_x = (geo2.x + geo2.width/2) - (geo1.x + geo1.width/2);
    delta_y = (geo2.y + geo2.height/2) - (geo1.y + geo1.height/2);
    return Math.sqrt(delta_x*delta_x + delta_y*delta_y);
}
    
function screen_to_the(direction, current_screen) {
    // Find the screen "most" in the given direction from the current screen by:
    //  - shift the current screen in the given direction
    //  - for all screeens, compute the overlap with the shifted screen
    //  - choose/return the screen with the most overlap (if no overlaps,
    //    return the current screen).
    // NOTE: there are some degenerate cases where this might not work; e.g.,
    // from left to right, a huge screen, a tiny screen, and another huge screen.
    // If that ever becomes an issue, the a little more work is needed.
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
    var 
    most_overlap = 0;
    var most_screen = current_screen;
    for (var i = 0; i < nscreens; i++) {
        var geo = workspace.clientArea(KWin.MaximizeArea, i, workspace.currentDesktop);
        var overlap = calc_overlap(shifted_geo, geo);
        if (overlap > most_overlap) {
            most_overlap = overlap;
            most_screen = i;
        }
    }
    return most_screen;
}

function which_screen(client_geo) {
    // find the screen that the client is most nearly on.
    // if overlapping, choose the biggest; if no overlap, choose closest.
    var most_overlap = 0;
    var most_screen = 0;
    var closest_distance = 2000*1000;
    var closest_screen = 0;
    for (var i = 0; i < nscreens; i++) {
        var geo = workspace.clientArea(KWin.MaximizeArea, i, workspace.currentDesktop);
        var overlap = calc_overlap(client_geo, geo);
        if (overlap > most_overlap) {
            most_overlap = overlap;
            most_screen = i;
        }
        var distance = calc_distance(client_geo, geo);
        if (distance < closest_distance) {
            closest_distance = distance;
            closest_screen = i;
        }
    }
    if (DB) print('most area/screen:', most_overlap, most_screen);
    if (most_overlap > 0) return most_screen;
    if (DB) print('closest distance/screen:', closest_distance, closest_screen);
    return closest_screen;
}

if (DB) {
    var client = workspace.activeClient;
    var nscreens = workspace.numScreens;
    print("nscreens", nscreens)
    for (var i = 0; i < nscreens; i++) {
        var geo = workspace.clientArea(KWin.MaximizeArea, i, workspace.currentDesktop);
        print(i, JSON.stringify(geo), "screen_to_the", "right", screen_to_the("right", i));
        print(i, JSON.stringify(geo), "screen_to_the", "left", screen_to_the("left", i));
        print(i, JSON.stringify(geo), "screen_to_the", "up", screen_to_the("up", i));
        print(i, JSON.stringify(geo), "screen_to_the", "down", screen_to_the("down", i));
    }
    const client_screen = which_screen(client.geometry);
    print("client_screen:", client_screen);
}

function move_win(direction) {
    if (DB) print("move_win(", direction, ")");
    const client = workspace.activeClient;
    if (client == null || !client.normalWindow) return;
    const old_screen = which_screen(client.geometry);
    const new_screen = screen_to_the(direction, old_screen)
    if (DB) print('new_screen:', new_screen, "old_screen:", old_screen)
    workspace.sendClientToScreen(client, new_screen);
    // clip and move client into bounds of screen dimensions
    if (DB) print("client.moveable:", client.moveable, "ogeo:",
        JSON.stringify(client.geometry));
    if (!client.moveable) return;
    area = workspace.clientArea(KWin.MaximizeArea, new_screen, workspace.currentDesktop);
    if (DB) print("new_screen_area:", JSON.stringify(area));
    // window width/height maximally screen width/height
    const width = Math.min(client.width, area.width);
    const height = Math.min(client.height, area.height);
    // left/top window edge between left and right/top and bottom screen edges
    const x = client.geometry.x = Math.max(area.x, Math.min(area.x + area.width - client.width, client.x));
    const y = client.geometry.y = Math.max(area.y, Math.min(area.y + area.height - client.height, client.y));
    client.geometry = {x: x, y: y, width: width, height: height};
    if (DB) print("ngeo:", JSON.stringify(client.geometry));
    workspace.activateClient(client); // NOTE: causes the script to bail
    if (DB) print("activated:", JSON.stringify(client)); // NOTE: so this does not run
}
    
function move_win_right() { move_win("right"); }
function move_win_left() { move_win("left"); }
function move_win_up() { move_win("up"); }
function move_win_down() { move_win("down"); }

registerShortcut("Move Window Left", "Move Window Left", "Alt+H", move_win_left);
registerShortcut("Move Window Up", "Move Window Up", "Alt+K", move_win_up);
registerShortcut("Move Window Down", "Move Window Down", "Alt+J", move_win_down);
registerShortcut("Move Window Right", "Move Window Right", "Alt+L", move_win_right);
