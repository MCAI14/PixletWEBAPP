function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value;
    if (message.trim() !== '') {
        const chat = document.getElementById('chat');
        const messageElement = document.createElement('div');
        messageElement.textContent = message;
        chat.appendChild(messageElement);
        messageInput.value = '';
    }
}

const startCallButton = document.getElementById('startCall');
const endCallButton = document.getElementById('endCall');
const remoteAudio = document.getElementById('remoteAudio');

let localStream;
let peerConnection;
const servers = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302'
        }
    ]
};

const socket = new WebSocket('ws://localhost:3000'); // Endereço do servidor de sinalização

socket.onmessage = async (message) => {
    const data = JSON.parse(message.data);

    if (data.offer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.send(JSON.stringify({ answer }));
    } else if (data.answer) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(data.answer));
    } else if (data.candidate) {
        await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
};

startCallButton.addEventListener('click', startCall);
endCallButton.addEventListener('click', endCall);

async function startCall() {
    localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    peerConnection = new RTCPeerConnection(servers);

    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            socket.send(JSON.stringify({ candidate: event.candidate }));
        }
    };

    peerConnection.ontrack = event => {
        remoteAudio.srcObject = event.streams[0];
    };

    localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.send(JSON.stringify({ offer }));
}

async function endCall() {
    if (peerConnection) {
        peerConnection.close();
        peerConnection = null;
    }
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
        localStream = null;
    }
}