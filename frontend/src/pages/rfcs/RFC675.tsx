export default function RFC675() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 675: Internet Transmission Control Program (December 1974)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This RFC introduced the concept of internetworking and laid the
          foundation for what would become TCP/IP. Authored by Vint Cerf, Bob
          Kahn, and others, it described how different networks could be
          connected together.
        </p>
      </div>

      <h2>The Birth of Internetworking</h2>

      <p>
        RFC 675 represents a revolutionary shift from thinking about individual
        networks to connecting multiple networks together. This was the first
        detailed specification for what would eventually become the Transmission
        Control Protocol (TCP).
      </p>

      <h3>Key Concepts Introduced</h3>

      <ul>
        <li>
          <strong>Internetworking:</strong> Connecting different types of
          networks
        </li>
        <li>
          <strong>Gateway Concept:</strong> Devices that route between networks
          (now called routers)
        </li>
        <li>
          <strong>Packet Switching:</strong> Breaking data into packets for
          transmission
        </li>
        <li>
          <strong>End-to-End Principle:</strong> Intelligence at the endpoints,
          not in the network
        </li>
      </ul>

      <h3>Technical Innovations</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">Network Layer Architecture:</h4>
        <div className="space-y-2 text-sm">
          <div className="bg-blue-200 p-2 rounded">Application Layer</div>
          <div className="bg-green-200 p-2 rounded">
            Host-to-Host Protocol (TCP)
          </div>
          <div className="bg-yellow-200 p-2 rounded">Internet Protocol</div>
          <div className="bg-red-200 p-2 rounded">Network Interface</div>
        </div>
      </div>

      <h3>From NCP to TCP</h3>

      <p>
        Before RFC 675, networks used the Network Control Protocol (NCP), which
        only worked within ARPANET. The new design needed to:
      </p>

      <ul>
        <li>Work across different network technologies</li>
        <li>Handle varying transmission speeds and reliability</li>
        <li>Provide error recovery and flow control</li>
        <li>Scale to connect many networks</li>
      </ul>

      <h3>The Gateway Innovation</h3>

      <div className="border-2 border-dashed border-gray-300 p-4 my-6 text-center">
        <p className="text-sm text-gray-600 mb-2">Conceptual Network Diagram</p>
        <div className="flex items-center justify-center space-x-4">
          <div className="bg-blue-100 p-2 rounded">Network A</div>
          <div className="bg-green-100 p-2 rounded border-2 border-green-500">
            Gateway
          </div>
          <div className="bg-blue-100 p-2 rounded">Network B</div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Gateways route packets between different networks
        </p>
      </div>

      <h3>Impact on Modern Internet</h3>

      <p>The principles established in RFC 675 directly enabled:</p>

      <ul>
        <li>The global Internet as we know it today</li>
        <li>Network of networks architecture</li>
        <li>Router-based internetworking</li>
        <li>Protocol layering concepts</li>
      </ul>

      <h3>Evolution Timeline</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6 space-y-2">
        <p>
          <strong>1974:</strong> RFC 675 - Internet Transmission Control Program
        </p>
        <p>
          <strong>1978:</strong> TCP/IP split into separate protocols
        </p>
        <p>
          <strong>1981:</strong> RFC 791 (IPv4) and RFC 793 (TCP) finalized
        </p>
        <p>
          <strong>1983:</strong> ARPANET switches from NCP to TCP/IP
        </p>
      </div>

      <h3>Why This Matters</h3>

      <p>
        RFC 675 shows how fundamental architectural decisions shape technology
        for decades. The internetworking principles described here still govern
        how data flows across the global Internet today.
      </p>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          The internet's power comes from connecting different networks, not
          replacing them. This "network of networks" approach enabled
          unprecedented global connectivity.
        </p>
      </div>
    </article>
  );
}
