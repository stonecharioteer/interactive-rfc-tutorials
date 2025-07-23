export const code = `# UDP Hole Punching Implementation

import socket
import time

class UDPHolePuncher:
    def __init__(self, local_port=0):
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.socket.bind(('0.0.0.0', local_port))
        self.local_port = self.socket.getsockname()[1]

    def punch_hole(self, peer_ip, peer_port, message="PUNCH"):
        # Send multiple packets to create NAT mapping
        for i in range(3):
            self.socket.sendto(message.encode(), (peer_ip, peer_port))
            time.sleep(0.1)

    def listen_for_messages(self):
        while True:
            try:
                data, addr = self.socket.recvfrom(1024)
                print(f"Received from {addr}: {data.decode()}")
            except Exception as err:
                print(f"Error: {err}")
                break`;
