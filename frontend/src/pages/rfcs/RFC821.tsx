export default function RFC821() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 821: Simple Mail Transfer Protocol (August 1982)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          SMTP established the foundation for internet email that still works
          today. Despite being over 40 years old, the core SMTP protocol remains
          largely unchanged in modern email systems.
        </p>
      </div>

      <h2>The Foundation of Internet Email</h2>

      <p>
        RFC 821 defined SMTP (Simple Mail Transfer Protocol), the standard way
        to transfer email messages between servers. It solved the problem of how
        to reliably deliver messages across different systems and organizations.
      </p>

      <h3>Core SMTP Principles</h3>

      <ul>
        <li>
          <strong>Store and Forward:</strong> Messages are queued and relayed
          through intermediary servers
        </li>
        <li>
          <strong>Text-Based Protocol:</strong> Human-readable commands and
          responses
        </li>
        <li>
          <strong>Connection-Oriented:</strong> Uses reliable TCP connections
        </li>
        <li>
          <strong>Server-to-Server:</strong> Designed for mail server
          communication
        </li>
      </ul>

      <h3>How Email Delivery Works</h3>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Email Journey</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="bg-blue-100 p-2 rounded text-sm">User A</div>
            <div className="text-xs text-gray-600">SMTP →</div>
            <div className="bg-green-100 p-2 rounded text-sm">
              Mail Server A
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="bg-green-100 p-2 rounded text-sm">
              Mail Server A
            </div>
            <div className="text-xs text-gray-600">SMTP →</div>
            <div className="bg-yellow-100 p-2 rounded text-sm">
              Mail Server B
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="bg-yellow-100 p-2 rounded text-sm">
              Mail Server B
            </div>
            <div className="text-xs text-gray-600">← POP3/IMAP</div>
            <div className="bg-red-100 p-2 rounded text-sm">User B</div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Messages are relayed from sender to recipient through mail servers
        </p>
      </div>

      <h3>SMTP Command Structure</h3>

      <p>
        SMTP uses simple text commands that are easy to understand and debug:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6 font-mono text-sm">
        <div className="space-y-1">
          <div>
            <span className="text-blue-600">Client:</span> HELLO
            mail.example.com
          </div>
          <div>
            <span className="text-green-600">Server:</span> 250 Hello
            mail.example.com
          </div>
          <div>
            <span className="text-blue-600">Client:</span> MAIL
            FROM:&lt;alice@example.com&gt;
          </div>
          <div>
            <span className="text-green-600">Server:</span> 250 OK
          </div>
          <div>
            <span className="text-blue-600">Client:</span> RCPT
            TO:&lt;bob@example.org&gt;
          </div>
          <div>
            <span className="text-green-600">Server:</span> 250 OK
          </div>
          <div>
            <span className="text-blue-600">Client:</span> DATA
          </div>
          <div>
            <span className="text-green-600">Server:</span> 354 Start mail
            input; end with &lt;CRLF&gt;.&lt;CRLF&gt;
          </div>
          <div>
            <span className="text-blue-600">Client:</span> Subject: Hello World
          </div>
          <div>
            <span className="text-blue-600">Client:</span>{" "}
          </div>
          <div>
            <span className="text-blue-600">Client:</span> This is a test
            message.
          </div>
          <div>
            <span className="text-blue-600">Client:</span> .
          </div>
          <div>
            <span className="text-green-600">Server:</span> 250 Message accepted
          </div>
        </div>
      </div>

      <h3>Essential SMTP Commands</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-blue-600">HELO/EHLO</h5>
          <p className="text-sm">Identify the sending server</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-green-600">MAIL FROM</h5>
          <p className="text-sm">Specify the sender's address</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-yellow-600">RCPT TO</h5>
          <p className="text-sm">Specify the recipient's address</p>
        </div>
        <div className="border p-3 rounded">
          <h5 className="font-semibold text-red-600">DATA</h5>
          <p className="text-sm">Begin message content transmission</p>
        </div>
      </div>

      <h3>SMTP Response Codes</h3>

      <p>
        SMTP uses three-digit response codes to indicate success or failure:
      </p>

      <ul>
        <li>
          <strong>2xx:</strong> Success (e.g., 250 = OK)
        </li>
        <li>
          <strong>3xx:</strong> More input needed (e.g., 354 = Start mail input)
        </li>
        <li>
          <strong>4xx:</strong> Temporary failure (e.g., 451 = Local error)
        </li>
        <li>
          <strong>5xx:</strong> Permanent failure (e.g., 550 = Mailbox
          unavailable)
        </li>
      </ul>

      <h3>Message Format vs Transport</h3>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-6">
        <h4 className="text-yellow-900 font-semibold">Important Distinction</h4>
        <p className="text-yellow-800">
          RFC 821 defines how to <em>transport</em> email messages. The format
          of the message content (headers like From:, To:, Subject:) is defined
          separately in RFC 822 (now RFC 5322).
        </p>
      </div>

      <h3>Mail Routing and MX Records</h3>

      <p>
        SMTP servers use DNS MX (Mail Exchange) records to find destination mail
        servers:
      </p>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">MX Record Lookup Example:</h4>
        <div className="text-sm space-y-1 font-mono">
          <p>Email to: user@example.com</p>
          <p>DNS query: MX records for example.com</p>
          <p>Response: mail.example.com (priority 10)</p>
          <p>Connect to: mail.example.com port 25</p>
        </div>
      </div>

      <h3>Store and Forward Architecture</h3>

      <p>SMTP's store-and-forward design provides reliability:</p>

      <ul>
        <li>
          <strong>Queuing:</strong> Messages are stored locally before
          forwarding
        </li>
        <li>
          <strong>Retry Logic:</strong> Failed deliveries are attempted multiple
          times
        </li>
        <li>
          <strong>Bounce Messages:</strong> Undeliverable mail generates error
          reports
        </li>
        <li>
          <strong>Offline Handling:</strong> Messages wait when destination
          servers are down
        </li>
      </ul>

      <h3>Security Limitations of Original SMTP</h3>

      <p>
        RFC 821 was designed when the internet was smaller and more trusted:
      </p>

      <ul>
        <li>
          <strong>No Authentication:</strong> Anyone could claim to send from
          any address
        </li>
        <li>
          <strong>No Encryption:</strong> Messages sent in plain text
        </li>
        <li>
          <strong>No Spam Protection:</strong> No built-in anti-abuse mechanisms
        </li>
        <li>
          <strong>Open Relays:</strong> Servers would forward mail from anyone
        </li>
      </ul>

      <h3>Modern SMTP Extensions</h3>

      <p>
        SMTP has been extended over the years to address security and
        functionality needs:
      </p>

      <ul>
        <li>
          <strong>ESMTP (Extended SMTP):</strong> Adds authentication and other
          capabilities
        </li>
        <li>
          <strong>STARTTLS:</strong> Enables encrypted connections
        </li>
        <li>
          <strong>AUTH:</strong> Requires user authentication
        </li>
        <li>
          <strong>SPF/DKIM/DMARC:</strong> Email authentication standards
        </li>
      </ul>

      <h3>SMTP Today</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-green-300 p-4 rounded">
          <h4 className="font-semibold text-green-600 mb-2">
            What Still Works
          </h4>
          <ul className="text-sm space-y-1">
            <li>✓ Basic protocol commands</li>
            <li>✓ Store and forward architecture</li>
            <li>✓ MX record routing</li>
            <li>✓ Text-based simplicity</li>
          </ul>
        </div>
        <div className="border border-blue-300 p-4 rounded">
          <h4 className="font-semibold text-blue-600 mb-2">Modern Additions</h4>
          <ul className="text-sm space-y-1">
            <li>+ Authentication (AUTH)</li>
            <li>+ Encryption (STARTTLS)</li>
            <li>+ Anti-spam measures</li>
            <li>+ Delivery status notifications</li>
          </ul>
        </div>
      </div>

      <h3>Common SMTP Ports</h3>

      <ul>
        <li>
          <strong>Port 25:</strong> Original SMTP (server-to-server)
        </li>
        <li>
          <strong>Port 587:</strong> SMTP submission (client-to-server)
        </li>
        <li>
          <strong>Port 465:</strong> SMTPS (deprecated but still used)
        </li>
      </ul>

      <h3>Testing SMTP Manually</h3>

      <div className="bg-gray-50 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">You can test SMTP using telnet:</h4>
        <div className="text-sm font-mono">
          <p>telnet mail.example.com 25</p>
          <p className="text-gray-600"># Then type SMTP commands manually</p>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          SMTP's simplicity and reliability made email one of the internet's
          first "killer apps." Good protocol design focuses on solving the core
          problem well, allowing extensions later.
        </p>
      </div>
    </article>
  );
}
