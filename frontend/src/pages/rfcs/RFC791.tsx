export default function RFC791() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 791: Internet Protocol Version 4 (September 1981)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This RFC defined IPv4, the network layer protocol that still carries
          most internet traffic today. Despite being over 40 years old, IPv4
          remains the foundation of internet communication.
        </p>
      </div>

      <h2>The Internet Protocol Foundation</h2>

      <p>
        RFC 791 established IPv4 as the universal addressing and routing
        protocol for the internet. It solved the fundamental problem of how to
        deliver data packets across a network of networks.
      </p>

      <h3>Core IPv4 Concepts</h3>

      <ul>
        <li>
          <strong>32-bit Addressing:</strong> Provides ~4.3 billion unique
          addresses
        </li>
        <li>
          <strong>Packet Header:</strong> Contains routing and control
          information
        </li>
        <li>
          <strong>Fragmentation:</strong> Breaking large packets into smaller
          pieces
        </li>
        <li>
          <strong>Time to Live (TTL):</strong> Prevents packets from looping
          forever
        </li>
      </ul>

      <h3>IPv4 Packet Structure</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6 overflow-x-auto">
        <h4 className="font-semibold mb-3">IPv4 Header (20 bytes minimum)</h4>
        <div className="grid grid-cols-8 gap-1 text-xs">
          <div className="bg-blue-200 p-2 text-center">Version</div>
          <div className="bg-blue-200 p-2 text-center">IHL</div>
          <div className="bg-green-200 p-2 text-center col-span-2">
            Type of Service
          </div>
          <div className="bg-yellow-200 p-2 text-center col-span-4">
            Total Length
          </div>

          <div className="bg-purple-200 p-2 text-center col-span-4">
            Identification
          </div>
          <div className="bg-red-200 p-2 text-center">Flags</div>
          <div className="bg-red-200 p-2 text-center col-span-3">
            Fragment Offset
          </div>

          <div className="bg-orange-200 p-2 text-center col-span-2">
            Time to Live
          </div>
          <div className="bg-pink-200 p-2 text-center col-span-2">Protocol</div>
          <div className="bg-gray-200 p-2 text-center col-span-4">
            Header Checksum
          </div>

          <div className="bg-indigo-200 p-2 text-center col-span-8">
            Source Address (32 bits)
          </div>
          <div className="bg-cyan-200 p-2 text-center col-span-8">
            Destination Address (32 bits)
          </div>
          <div className="bg-lime-200 p-2 text-center col-span-8">
            Options (0-40 bytes)
          </div>
        </div>
      </div>

      <h3>IPv4 Addressing</h3>

      <p>
        IPv4 uses 32-bit addresses, typically written in dotted decimal
        notation:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-4">
        <code className="text-lg">
          192.168.1.1 = 11000000.10101000.00000001.00000001
        </code>
      </div>

      <h4>Address Classes (Historical)</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
        <div className="border border-gray-300 p-3 rounded">
          <h5 className="font-semibold text-red-600">Class A</h5>
          <p className="text-sm">1.0.0.0 - 126.255.255.255</p>
          <p className="text-xs text-gray-600">Large networks</p>
        </div>
        <div className="border border-gray-300 p-3 rounded">
          <h5 className="font-semibold text-blue-600">Class B</h5>
          <p className="text-sm">128.0.0.0 - 191.255.255.255</p>
          <p className="text-xs text-gray-600">Medium networks</p>
        </div>
        <div className="border border-gray-300 p-3 rounded">
          <h5 className="font-semibold text-green-600">Class C</h5>
          <p className="text-sm">192.0.0.0 - 223.255.255.255</p>
          <p className="text-xs text-gray-600">Small networks</p>
        </div>
      </div>

      <h3>Packet Fragmentation</h3>

      <p>
        IPv4 can fragment packets when they're too large for a network link.
        This process:
      </p>

      <ul>
        <li>Splits large packets into smaller fragments</li>
        <li>Each fragment has the same identification number</li>
        <li>Fragments are reassembled at the destination</li>
        <li>Uses flags and fragment offset fields</li>
      </ul>

      <h3>Time to Live (TTL)</h3>

      <div className="border-2 border-dashed border-gray-300 p-4 my-6">
        <h4 className="font-semibold mb-2">TTL in Action:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span>Packet starts: TTL = 64</span>
            <div className="bg-blue-100 px-2 py-1 rounded">Router 1</div>
          </div>
          <div className="flex items-center justify-between">
            <span>After Router 1: TTL = 63</span>
            <div className="bg-blue-100 px-2 py-1 rounded">Router 2</div>
          </div>
          <div className="flex items-center justify-between">
            <span>After Router 2: TTL = 62</span>
            <div className="bg-green-100 px-2 py-1 rounded">Destination</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Each router decrements TTL by 1
        </p>
      </div>

      <h3>Modern Challenges</h3>

      <p>IPv4's design assumptions from 1981 created modern challenges:</p>

      <ul>
        <li>
          <strong>Address Exhaustion:</strong> Only 4.3 billion addresses for
          billions of devices
        </li>
        <li>
          <strong>NAT Necessity:</strong> Network Address Translation as a
          workaround
        </li>
        <li>
          <strong>Routing Table Growth:</strong> Millions of routes in internet
          backbone
        </li>
        <li>
          <strong>Security:</strong> No built-in encryption or authentication
        </li>
      </ul>

      <h3>IPv4 vs IPv6 Transition</h3>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
        <h4 className="text-yellow-900 font-semibold">Current Status</h4>
        <p className="text-yellow-800">
          Despite IPv6 being available since 1998, IPv4 still carries about 70%
          of internet traffic as of 2025. The transition is gradual due to
          IPv4's stability and widespread deployment.
        </p>
      </div>

      <h3>Why IPv4 Endured</h3>

      <ul>
        <li>Simple and well-understood design</li>
        <li>Massive existing infrastructure</li>
        <li>NAT solved address scarcity (temporarily)</li>
        <li>High cost of complete replacement</li>
      </ul>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          IPv4's success shows how well-designed protocols can far exceed their
          original intended lifespan. Good design principles create lasting
          value.
        </p>
      </div>
    </article>
  );
}
