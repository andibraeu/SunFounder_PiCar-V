const domain = window.config.jitsiURL;
const robotIP = window.config.robotIP;
const options = {
    roomName: window.config.roomName,
    width: "100%",
    height: 600,
    parentNode: document.querySelector('#jitsi-meet'),
    configOverwrite: { channelLastN: 1, disableSimulcast: true, disableAudioLevels: true, startWithAudioMuted: true, startWithVideoMuted: false, enableNoAudioDetection: false, enableWelcomePage: false, prejoinPageEnabled: false },
    // interfaceConfigOverwrite: {TOOLBAR_BUTTONS: [], DISABLE_JOIN_LEAVE_NOTIFICATIONS: true, HIDE_INVITE_MORE_HEADER: true, FILM_STRIP_MAX_HEIGHT: 0, VIDEO_QUALITY_LABEL_DISABLED: true, RECENT_LIST_ENABLED: false}, 
    interfaceConfigOverwrite: { DISABLE_JOIN_LEAVE_NOTIFICATIONS: true, HIDE_INVITE_MORE_HEADER: true, FILM_STRIP_MAX_HEIGHT: 0, VIDEO_QUALITY_LABEL_DISABLED: true, RECENT_LIST_ENABLED: false },
    userInfo: {
        displayName: window.config.name
    }
};
const api = new JitsiMeetExternalAPI(domain, options);
// const devices = await api.getCurrentDevices();
let enabled = true;
let driveDict = init_driveDict();
let camDict = init_camDict();
let driveVoters = [];
let camVoters = [];

api.getAvailableDevices().then(devices => { console.log(devices, "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA") });
api.on('incomingMessage', (message) => {
    if (message.privateMessage && window.config.adminUsers.includes(message.nick)) {
        console.log('wichtige nachricht bekommen');
        if (['enable', 'disable'].includes(message.message)) {
            enableOrDisableRobot(message.message);
        } else if (['shutdown', 'reset', 'restart_cam'].includes(message.message)) {
            console.log('would do ', message.message, ' from ', message.nick)
        }
    } else if (enabled == true) {
        console.log('message bekommen', message, driveVoters);
        if (['ff', 'f', 'r', 'l', 'ww', 'w', 'a', 'd', 'b', 's'].includes(message.message) && !driveVoters.includes(message.from)) {
            // collect votes
            driveDict[message.message] += 1;
            driveVoters.push(message.from);
            console.log("Vote", message.from, " voted for ", message.message, " Count ", driveDict);
        } else if (['c', 'z', 'u', 'i', 'h', 'j', 'k'].includes(message.message) && !camVoters.includes(message.from)) {
            // collect votes
            camDict[message.message] += 1;
            camVoters.push(message.from);
            console.log("Vote", message.from, " voted for ", message.message, " Count ", camDict);
        }

    } else {
        console.log("message ignored")
    }
});

window.setInterval(function () { count_drive_votes_and_drive() }, 1500);
window.setInterval(function () { count_cam_votes_and_cam() }, 1500);

function enableOrDisableRobot(message) {
    if (enabled && message === 'disable') {
        toggleRobot();
    } else if ( !enabled && message === 'enable') {
        toggleRobot();
    }
}

function count_drive_votes_and_drive() {
    //console.log("couting votes", dict, voters)
    let highest = 0;
    let selection = "";
    for (let [action, count] of Object.entries(driveDict)) {
        if (count >= highest) {
            highest = count;
            selection = action;
        }
    };

    if (highest === 0)
        return;

    console.log("drive action machen: ", selection, highest)
    fetch("http://" + robotIP + "/run/?speed=40")
    let drive_time = 1400;
    switch (selection) {
        case 'ww':
        case 'ff':
            fetch("http://" + robotIP + "/run/?speed=80")
            fetch("http://" + robotIP + "/run/?action=forward")
            setTimeout(stopMotor, 2 * drive_time)
            break;
        case 'w':
        case 'f':
            fetch("http://" + robotIP + "/run/?action=forward")
            setTimeout(stopMotor, drive_time)
            break;
        case 'a':
        case 'l':
            fetch("http://" + robotIP + "/run/?action=fwleft")
            fetch("http://" + robotIP + "/run/?action=forward")
            setTimeout(stopMotor, drive_time)
            break;
        case 'd':
        case 'r':
            fetch("http://" + robotIP + "/run/?action=fwright")
            fetch("http://" + robotIP + "/run/?action=forward")
            setTimeout(stopMotor, drive_time)
            break;
        case 'b':
        case 's':
            fetch("http://" + robotIP + "/run/?action=backward")
            setTimeout(stopMotor, drive_time)
            break;
        default:
            break;
    };

    driveDict = init_driveDict();
    driveVoters = [];
}

function count_cam_votes_and_cam() {
    let highest = 0;
    let selection = "";
    for (let [action, count] of Object.entries(camDict)) {
        if (count >= highest) {
            highest = count;
            selection = action;
        }
    };

    if (highest === 0)
        return;

    console.log("cam action machen: ", selection, highest)
    switch (selection) {
        case 'c':
            fetch("http://" + robotIP + "/run/?action=camready")
            break;
        case 'z':
            fetch("http://" + robotIP + "/run/?action=camready")
            fetch("http://" + robotIP + "/run/?action=camleft")
            fetch("http://" + robotIP + "/run/?action=camup")
            break;
        case 'u':
            fetch("http://" + robotIP + "/run/?action=camready")
            fetch("http://" + robotIP + "/run/?action=camup")
            break;
        case 'i':
            fetch("http://" + robotIP + "/run/?action=camready")
            fetch("http://" + robotIP + "/run/?action=camright")
            fetch("http://" + robotIP + "/run/?action=camup")
            break;
        case 'h':
            fetch("http://" + robotIP + "/run/?action=camready")
            fetch("http://" + robotIP + "/run/?action=camleft")
            break;
        case 'j':
            fetch("http://" + robotIP + "/run/?action=camready")
            break;
        case 'k':
            fetch("http://" + robotIP + "/run/?action=camready")
            fetch("http://" + robotIP + "/run/?action=camright")
            break;
        default:
            break;
    };

    camDict = init_camDict();
    camVoters = [];
}

function init_driveDict() {
    return { 'b': 0, 's': 0, 'ff': 0, 'f': 0, 'l': 0, 'r': 0, 'ww': 0, 'w': 0, 'a': 0, 'd': 0}
}

function init_camDict() {
    return { 'z': 0, 'u': 0, 'i': 0, 'h': 0, 'j': 0, 'k' :0, 'c': 0 }
}

function toggleRobot() {
    enabled = !enabled;
    if (enabled == true) {
        document.getElementById("robotStatus").childNodes[0].nodeValue = "disable Robot"
    } else {
        document.getElementById("robotStatus").childNodes[0].nodeValue = "enable Robot"
    }
    console.log(enabled, "changed robot control")
}
function stopMotor() {
    fetch("http://" + robotIP + "/run/?action=stop")
    fetch("http://" + robotIP + "/run/?action=fwstraight")
    fetch("http://" + robotIP + "/run/?speed=40")
}