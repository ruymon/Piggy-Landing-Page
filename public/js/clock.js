window.onload = getClock();

function getClock() {
    now = new Date();
    var monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    var month = monthNames[now.getUTCMonth()];
    var day = ((now.getUTCDate() < 10) ? "0" : "") + now.getUTCDate();
    var hour = ((now.getUTCHours() < 10) ? "0" : "") + now.getUTCHours();
    var min = ((now.getUTCMinutes() < 10) ? "0" : "") + now.getUTCMinutes();
    var sec = ((now.getUTCSeconds() < 10) ? "0" : "") + now.getUTCSeconds();

    return {day,month,hour,min,sec};
};

function insertClock() {
    var clock = getClock();
    document.getElementById("date").innerHTML = `${clock.day} ${clock.month}`;
    document.getElementById("time").innerHTML = `${clock.hour}:${clock.min}:${clock.sec} UTC`;

};

setInterval(() => {
    insertClock();
}, 1000);
