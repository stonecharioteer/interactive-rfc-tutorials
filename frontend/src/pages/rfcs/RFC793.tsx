export default function RFC793() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 793: Transmission Control Protocol (September 1981)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          TCP provides reliable, ordered data delivery over unreliable networks.
          This RFC established the protocol that powers most internet
          applications today, from web browsing to email.
        </p>
      </div>

      <h2>Reliable Communication Over Unreliable Networks</h2>

      <p>
        TCP solves a fundamental problem: how to provide reliable, ordered
        communication over a network that might drop, duplicate, or reorder
        packets. It transforms the unreliable IP layer into a dependable
        communication service.
      </p>

      <h3>Core TCP Features</h3>

      <ul>
        <li>
          <strong>Connection-oriented:</strong> Establishes a session before
          data transfer
        </li>
        <li>
          <strong>Reliable delivery:</strong> Guarantees all data arrives
          correctly
        </li>
        <li>
          <strong>Ordered delivery:</strong> Data arrives in the same sequence
          it was sent
        </li>
        <li>
          <strong>Flow control:</strong> Prevents overwhelming the receiver
        </li>
        <li>
          <strong>Congestion control:</strong> Adapts to network conditions
        </li>
      </ul>

      <h3>The Famous Three-Way Handshake</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Connection Establishment</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-2 rounded w-20 text-center text-sm">
              Client
            </div>
            <div className="flex-1 text-center">
              <div className="bg-red-200 p-1 rounded text-sm">
                SYN (seq=100)
              </div>
              <div className="text-xs text-gray-600">→</div>
            </div>
            <div className="bg-green-100 p-2 rounded w-20 text-center text-sm">
              Server
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-2 rounded w-20 text-center text-sm">
              Client
            </div>
            <div className="flex-1 text-center">
              <div className="text-xs text-gray-600">←</div>
              <div className="bg-yellow-200 p-1 rounded text-sm">
                SYN-ACK (seq=300, ack=101)
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded w-20 text-center text-sm">
              Server
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-2 rounded w-20 text-center text-sm">
              Client
            </div>
            <div className="flex-1 text-center">
              <div className="bg-green-200 p-1 rounded text-sm">
                ACK (ack=301)
              </div>
              <div className="text-xs text-gray-600">→</div>
            </div>
            <div className="bg-green-100 p-2 rounded w-20 text-center text-sm">
              Server
            </div>
          </div>

          <div className="text-center text-sm text-green-600 font-semibold">
            Connection Established!
          </div>
        </div>
      </div>

      <h3>TCP Header Structure</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto">
        <h4 className="font-semibold mb-3">TCP Header (20+ bytes)</h4>
        <div className="grid grid-cols-8 gap-1 text-xs">
          <div className="bg-blue-200 p-2 text-center col-span-4">
            Source Port
          </div>
          <div className="bg-blue-200 p-2 text-center col-span-4">
            Destination Port
          </div>

          <div className="bg-green-200 p-2 text-center col-span-8">
            Sequence Number
          </div>
          <div className="bg-yellow-200 p-2 text-center col-span-8">
            Acknowledgment Number
          </div>

          <div className="bg-purple-200 p-2 text-center">Data Offset</div>
          <div className="bg-red-200 p-2 text-center">Reserved</div>
          <div className="bg-orange-200 p-2 text-center col-span-2">Flags</div>
          <div className="bg-pink-200 p-2 text-center col-span-4">
            Window Size
          </div>

          <div className="bg-indigo-200 p-2 text-center col-span-4">
            Checksum
          </div>
          <div className="bg-cyan-200 p-2 text-center col-span-4">
            Urgent Pointer
          </div>

          <div className="bg-lime-200 p-2 text-center col-span-8">
            Options (0-40 bytes)
          </div>
        </div>
      </div>

      <h3>TCP Flags Explained</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-6">
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-red-600">SYN</h5>
          <p className="text-xs">Synchronize sequence numbers</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-green-600">ACK</h5>
          <p className="text-xs">Acknowledge received data</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-blue-600">FIN</h5>
          <p className="text-xs">Finish - close connection</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-orange-600">RST</h5>
          <p className="text-xs">Reset - abort connection</p>
        </div>
      </div>

      <h3>Sequence Numbers & Acknowledgments</h3>

      <p>TCP uses sequence numbers to ensure reliable, ordered delivery:</p>

      <ul>
        <li>
          <strong>Sequence Number:</strong> Position of first byte in this
          segment
        </li>
        <li>
          <strong>Acknowledgment Number:</strong> Next expected sequence number
        </li>
        <li>
          <strong>Retransmission:</strong> Unacknowledged data is sent again
        </li>
        <li>
          <strong>Duplicate Detection:</strong> Sequence numbers identify
          duplicates
        </li>
      </ul>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Example Data Transfer:</h4>
        <div className="text-sm space-y-1">
          <p>Client sends: seq=1000, len=100 (bytes 1000-1099)</p>
          <p>Server acks: ack=1100 ("I received up to 1099, send 1100 next")</p>
          <p>Client sends: seq=1100, len=200 (bytes 1100-1299)</p>
          <p>Server acks: ack=1300 ("I received up to 1299, send 1300 next")</p>
        </div>
      </div>

      <h3>Flow Control with Window Size</h3>

      <p>TCP prevents buffer overflow using the window size field:</p>

      <ul>
        <li>Receiver advertises available buffer space</li>
        <li>Sender doesn't exceed the advertised window</li>
        <li>Window size adjusts dynamically</li>
        <li>Zero window stops transmission temporarily</li>
      </ul>

      <h3>Congestion Control</h3>

      <p>TCP adapts to network conditions to prevent congestion:</p>

      <div className="border-2 border-dashed border-gray-300 p-4 my-6">
        <h4 className="font-semibold mb-2">Slow Start Algorithm:</h4>
        <div className="space-y-2 text-sm">
          <div>Start: Send 1 packet</div>
          <div>ACK received: Send 2 packets (exponential growth)</div>
          <div>ACK received: Send 4 packets</div>
          <div>Packet lost: Reduce sending rate (congestion detected)</div>
        </div>
      </div>

      <h3>Connection Termination</h3>

      <p>TCP uses a four-way handshake to close connections gracefully:</p>

      <ol>
        <li>Client sends FIN (finished sending)</li>
        <li>Server sends ACK (acknowledges FIN)</li>
        <li>Server sends FIN (finished sending)</li>
        <li>Client sends ACK (acknowledges FIN)</li>
      </ol>

      <h3>Modern TCP Improvements</h3>

      <p>Since RFC 793, TCP has evolved with many improvements:</p>

      <ul>
        <li>
          <strong>Fast Retransmit:</strong> Quicker loss detection
        </li>
        <li>
          <strong>Selective Acknowledgments (SACK):</strong> More efficient
          retransmission
        </li>
        <li>
          <strong>Window Scaling:</strong> Larger windows for high-speed
          networks
        </li>
        <li>
          <strong>Timestamps:</strong> Better round-trip time measurement
        </li>
      </ul>

      <h3>TCP vs UDP</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-green-300 p-4 rounded">
          <h4 className="font-semibold text-green-600 mb-2">TCP Advantages</h4>
          <ul className="text-sm space-y-1">
            <li>✓ Reliable delivery</li>
            <li>✓ Ordered data</li>
            <li>✓ Flow control</li>
            <li>✓ Error correction</li>
          </ul>
        </div>
        <div className="border border-red-300 p-4 rounded">
          <h4 className="font-semibold text-red-600 mb-2">TCP Disadvantages</h4>
          <ul className="text-sm space-y-1">
            <li>✗ Higher latency</li>
            <li>✗ More overhead</li>
            <li>✗ Connection state</li>
            <li>✗ Complex implementation</li>
          </ul>
        </div>
      </div>

      <h3>Applications Using TCP</h3>

      <ul>
        <li>
          <strong>Web (HTTP/HTTPS):</strong> Reliable page delivery
        </li>
        <li>
          <strong>Email (SMTP):</strong> Guaranteed message delivery
        </li>
        <li>
          <strong>File Transfer (FTP):</strong> Ensures complete file transfer
        </li>
        <li>
          <strong>SSH:</strong> Reliable remote shell sessions
        </li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          TCP shows how complex problems can be solved through careful protocol
          design. By handling reliability at the transport layer, TCP enables
          simple application development.
        </p>
      </div>
    </article>
  );
}
