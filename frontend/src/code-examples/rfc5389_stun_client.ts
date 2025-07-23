export const code = `# Educational STUN Client Implementation

import socket
import struct
import secrets

class STUNClient:
    # STUN Constants
    BINDING_REQUEST = 0x0001
    BINDING_RESPONSE = 0x0101
    MAGIC_COOKIE = 0x2112A442
    XOR_MAPPED_ADDRESS = 0x0020

    def __init__(self, stun_server="stun.l.google.com", stun_port=19302):
        self.stun_server = stun_server
        self.stun_port = stun_port

    def create_binding_request(self):
        transaction_id = secrets.token_bytes(12)
        message = struct.pack('>HHI12s',
                            self.BINDING_REQUEST,
                            0,  # Length
                            self.MAGIC_COOKIE,
                            transaction_id)
        return message, transaction_id

    def discover_public_address(self):
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(5.0)

            request, transaction_id = self.create_binding_request()
            sock.sendto(request, (self.stun_server, self.stun_port))

            response, _ = sock.recvfrom(1024)
            return self.parse_response(response, transaction_id)

        except Exception as err:
            print(f"STUN discovery failed: {err}")
            return None
        finally:
            sock.close()`;
