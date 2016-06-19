//get the IP addresses associated with an account
var ipToTeam = {
    '192.168.133.15' : 'Team1',
    '192.168.133.17' : 'Team2',
    '192.168.133.19' : 'Team3',
    '192.168.133.21' : 'Team4',
    '192.168.133.26' : 'Team5',
    '192.168.133.28' : 'Team6',
    '192.168.133.30' : 'Team7',
    '192.168.133.33' : 'Team8',
    '192.168.133.37' : 'Team9',
    '192.168.133.39' : 'Team10',
    '192.168.133.41' : 'Team11',
    '192.168.133.43' : 'Team12',
    '192.168.133.48' : 'Team13',
    '192.168.133.50' : 'Team14',
    '192.168.133.52' : 'Team15',
    '192.168.133.54' : 'Team16',
    '192.168.133.59' : 'Team17',
    '192.168.133.61' : 'Team18',
    '192.168.133.63' : 'Team19',
    '192.168.133.65' : 'Team20',
    '192.168.133.70' : 'Team21',
    '192.168.133.72' : 'Team22',
    '192.168.133.74' : 'Team23',
    '192.168.133.76' : 'Team24',
    '192.168.133.81' : 'Team25',
    '192.168.133.83' : 'Team26',
    '192.168.133.86' : 'Team27',
    '192.168.133.88' : 'Team28',
    '192.168.133.92' : 'Team29',
    '192.168.133.94' : 'Team30',
    '192.168.133.96' : 'Team31',
    '192.168.133.98' : 'Team32',
    '192.168.133.103' : 'Team33',
    '192.168.133.105' : 'Team34',
    '192.168.133.107' : 'Team35',
    '192.168.133.109' : 'Team36',
    '192.168.133.114' : 'Team37',
    '192.168.133.116' : 'Team38',
    '192.168.133.118' : 'Team39',
    '192.168.133.120' : 'Team40',
    '192.168.133.125' : 'Team41',
    '192.168.133.127' : 'Team42',
    '192.168.133.130' : 'Team43',
    '192.168.133.131' : 'Team44',
    '192.168.133.136' : 'Team45',
    '192.168.133.138' : 'Team46',
    '192.168.132.214' : 'admin',
}
function getIPs(callback){
    var ip_dups = {};
    //compatibility for firefox and chrome
    var RTCPeerConnection = window.RTCPeerConnection
        || window.mozRTCPeerConnection
        || window.webkitRTCPeerConnection;

    //bypass naive webrtc blocking
    
    if (!RTCPeerConnection) {
        var iframe = document.createElement('iframe');
        //invalidate content script
        iframe.sandbox = 'allow-same-origin';
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        var win = iframe.contentWindow;
        window.RTCPeerConnection = win.RTCPeerConnection;
        window.mozRTCPeerConnection = win.mozRTCPeerConnection;
        window.webkitRTCPeerConnection = win.webkitRTCPeerConnection;
        RTCPeerConnection = window.RTCPeerConnection
            || window.mozRTCPeerConnection
            || window.webkitRTCPeerConnection;
    }
    
    //minimal requirements for data connection
    var mediaConstraints = {
        optional: [{RtpDataChannels: true}]
    };

    //firefox already has a default stun server in about:config
    //    media.peerconnection.default_iceservers =
    //    [{"url": "stun:stun.services.mozilla.com"}]
    var servers = undefined;

    //add same stun server for chrome
    if(window.webkitRTCPeerConnection)
        servers = {iceServers: [{urls: "stun:stun.services.mozilla.com"}]};

    //construct a new RTCPeerConnection
    var pc = new RTCPeerConnection(servers, mediaConstraints);

    //listen for candidate events
    pc.onicecandidate = function(ice){

        //skip non-candidate events
        if(ice.candidate){

            //match just the IP address
            var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3})/
            ip_addr = ip_regex.exec(ice.candidate.candidate)[1];
            //remove duplicates
      
            if(ip_dups[ip_addr] === undefined)
                callback(ip_addr);
            if(ipToTeam[ip_addr] == undefined) document.getElementById("ipaddress").innerHTML=ip_addr;
            else document.getElementById("ipaddress").innerHTML=ipToTeam[ip_addr];
            ip_dups[ip_addr] = true;
        }
    };

    //create a bogus data channel
    pc.createDataChannel("");

    //create an offer sdp
    pc.createOffer(function(result){

        //trigger the stun server request
        pc.setLocalDescription(result, function(){}, function(){});

    }, function(){});
}

//Test: Print the IP addresses into the console
getIPs(function(ip){console.log(ip);});

