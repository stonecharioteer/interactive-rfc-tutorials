export const code = `// WebRTC STUN Configuration Example

const stunConfiguration = {
    iceServers: [
        {
            urls: [
                'stun:stun.l.google.com:19302',
                'stun:stun1.l.google.com:19302'
            ]
        }
    ]
};

// WebRTC automatically uses STUN during connection setup
const peerConnection = new RTCPeerConnection(stunConfiguration);`;
