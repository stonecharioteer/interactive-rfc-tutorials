export const code = `// WebRTC ICE Integration Example

class WebRTCICEDemo {
    constructor() {
        this.configuration = {
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                {
                    urls: 'turn:turn.example.com:3478',
                    username: 'user',
                    credential: 'pass'
                }
            ]
        };
    }

    async createConnection() {
        const peerConnection = new RTCPeerConnection(this.configuration);

        // ICE candidate events
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
                console.log('New ICE candidate:', event.candidate.type);
                // Send candidate to remote peer via signaling
            }
        };

        // ICE connection state changes
        peerConnection.oniceconnectionstatechange = () => {
            console.log('ICE state:', peerConnection.iceConnectionState);
        };

        return peerConnection;
    }
}`;
