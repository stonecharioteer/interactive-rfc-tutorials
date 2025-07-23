import GlossaryTerm from "../../components/GlossaryTerm";
import MermaidDiagram from "../../components/MermaidDiagram";
import CodeBlock, { PythonCode, ShellCode } from "../../components/CodeBlock";
import ExpandableSection, {
  EliPythonistaSection,
  TechnicalDeepDive,
} from "../../components/ExpandableSection";

export default function RFC821() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 821: Simple Mail Transfer Protocol (August 1982)</h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 dark:border-blue-500 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800 dark:text-blue-200">
          <GlossaryTerm>SMTP</GlossaryTerm> established the foundation for
          internet email that still works today. Despite being over 40 years
          old, the core SMTP protocol remains largely unchanged in modern email
          systems.
        </p>
      </div>

      <h2>The Foundation of Internet Email</h2>

      <p>
        <GlossaryTerm>RFC</GlossaryTerm> 821 defined{" "}
        <GlossaryTerm>SMTP</GlossaryTerm> (Simple Mail Transfer Protocol), the
        standard way to transfer email messages between servers. It solved the
        problem of how to reliably deliver messages across different systems and
        organizations.
      </p>

      <h3>Email Architecture Overview</h3>

      <MermaidDiagram
        chart={`
        graph TD
          A["User A<br/>alice@company.com"] -->|"1. Compose & Send"| B["Mail Client<br/>Outlook/Thunderbird"]
          B -->|"2. SMTP Submit<br/>Port 587"| C["Outgoing Mail Server<br/>smtp.company.com"]
          C -->|"3. DNS MX Lookup"| D["DNS Server"]
          D -->|"4. MX Record Response<br/>mail.university.edu"| C
          C -->|"5. SMTP Delivery<br/>Port 25"| E["Incoming Mail Server<br/>mail.university.edu"]
          E -->|"6. Store Message"| F["Mailbox<br/>bob@university.edu"]
          F -->|"7. POP3/IMAP<br/>Port 110/143"| G["Mail Client"]
          G -->|"8. Read Message"| H["User B<br/>bob@university.edu"]

          style A fill:#e1f5fe
          style H fill:#e1f5fe
          style C fill:#fff3e0
          style E fill:#fff3e0
          style D fill:#f3e5f5
        `}
        className="my-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
      />

      <h3>
        Core <GlossaryTerm>SMTP</GlossaryTerm> Principles
      </h3>

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
          <strong>Connection-Oriented:</strong> Uses reliable{" "}
          <GlossaryTerm>TCP</GlossaryTerm> connections
        </li>
        <li>
          <strong>Server-to-Server:</strong> Designed for mail server
          communication
        </li>
      </ul>

      <h3>SMTP Session Flow</h3>

      <MermaidDiagram
        chart={`
        sequenceDiagram
          participant Client
          participant Server

          Client->>Server: TCP Connection (Port 25)
          Server->>Client: 220 mail.example.com Ready

          Client->>Server: HELLO client.example.com
          Server->>Client: 250 Hello client.example.com

          Client->>Server: MAIL FROM alice@client.com
          Server->>Client: 250 OK

          Client->>Server: RCPT TO bob@example.com
          Server->>Client: 250 OK

          Client->>Server: DATA
          Server->>Client: 354 Start mail input end with dot

          Client->>Server: Subject Hello World From alice To bob Hello Bob!
          Server->>Client: 250 Message accepted

          Client->>Server: QUIT
          Server->>Client: 221 Bye
        `}
        className="my-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
      />

      <h3>SMTP Commands and Response Codes</h3>

      <p>
        SMTP is a text-based protocol with specific commands and standardized
        response codes. Understanding these helps debug email delivery issues:
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-3">Essential SMTP Commands</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded">
              <strong className="text-blue-800 dark:text-blue-200">HELO/EHLO:</strong>
              <span className="text-blue-600 dark:text-blue-300"> Identify client to server</span>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded">
              <strong className="text-green-800 dark:text-green-200">MAIL FROM:</strong>
              <span className="text-green-600 dark:text-green-300"> Specify sender address</span>
            </div>
            <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded">
              <strong className="text-purple-800 dark:text-purple-200">RCPT TO:</strong>
              <span className="text-purple-600 dark:text-purple-300"> Specify recipient address</span>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
              <strong className="text-orange-800 dark:text-orange-200">DATA:</strong>
              <span className="text-orange-600 dark:text-orange-300"> Begin message content</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="bg-yellow-100 dark:bg-yellow-900/30 p-2 rounded">
              <strong className="text-yellow-800 dark:text-yellow-200">QUIT:</strong>
              <span className="text-yellow-600 dark:text-yellow-300"> Close connection</span>
            </div>
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded">
              <strong className="text-red-800 dark:text-red-200">RSET:</strong>
              <span className="text-red-600 dark:text-red-300"> Reset current transaction</span>
            </div>
            <div className="bg-pink-100 dark:bg-pink-900/30 p-2 rounded">
              <strong className="text-pink-800 dark:text-pink-200">VRFY:</strong>
              <span className="text-pink-600 dark:text-pink-300"> Verify user mailbox</span>
            </div>
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded">
              <strong className="text-indigo-800 dark:text-indigo-200">NOOP:</strong>
              <span className="text-indigo-600 dark:text-indigo-300"> No operation (keep-alive)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 p-4 rounded-lg my-6">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">SMTP Response Code Categories</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div><strong className="text-green-600">2xx - Success:</strong> Command completed successfully</div>
            <div className="ml-4 text-green-600 font-mono">220 Service ready, 250 OK, 354 Start mail input</div>
            <div><strong className="text-yellow-600">3xx - Positive Intermediate:</strong> More input needed</div>
            <div className="ml-4 text-yellow-600 font-mono">354 Start mail input; end with .</div>
          </div>
          <div className="space-y-1">
            <div><strong className="text-orange-600">4xx - Transient Failure:</strong> Try again later</div>
            <div className="ml-4 text-orange-600 font-mono">450 Mailbox busy, 451 Local error</div>
            <div><strong className="text-red-600">5xx - Permanent Failure:</strong> Don't retry</div>
            <div className="ml-4 text-red-600 font-mono">550 Mailbox not found, 553 Invalid address</div>
          </div>
        </div>
      </div>

      <h3>Email Delivery Flow with Error Handling</h3>

      <MermaidDiagram
        chart={`
flowchart TD
    Start([New Email to Send]) --> DNS[DNS MX Lookup]
    DNS --> MXFound{MX Records Found?}
    
    MXFound -->|No| NoMX[5xx Error: No Mail Server]
    MXFound -->|Yes| Connect[Connect to Primary MX]
    
    Connect --> ConnSuccess{Connection OK?}
    ConnSuccess -->|No| TrySecondary[Try Secondary MX]
    ConnSuccess -->|Yes| HELO[Send HELO Command]
    
    TrySecondary --> SecondaryOK{Secondary OK?}
    SecondaryOK -->|No| Queue[Queue for Retry Later]
    SecondaryOK -->|Yes| HELO
    
    HELO --> MAIL[Send MAIL FROM]
    MAIL --> MailOK{250 Response?}
    MailOK -->|No| ErrorMail[5xx: Sender Rejected]
    MailOK -->|Yes| RCPT[Send RCPT TO]
    
    RCPT --> RcptOK{250 Response?}
    RcptOK -->|No| ErrorRcpt[5xx: Recipient Rejected]
    RcptOK -->|Yes| DATA[Send DATA Command]
    
    DATA --> DataOK{354 Response?}
    DataOK -->|No| ErrorData[5xx: Data Rejected]
    DataOK -->|Yes| Content[Send Message Content]
    
    Content --> Delivered[250: Message Accepted]
    
    Queue --> RetryLater[Retry in 15 minutes]
    RetryLater --> DNS
    
    style Delivered fill:#e8f5e8
    style NoMX fill:#ffebee
    style ErrorMail fill:#ffebee
    style ErrorRcpt fill:#ffebee
    style ErrorData fill:#ffebee
    style Queue fill:#fff3cd
        `}
        className="my-6"
      />

      <h3>
        Mail Routing and <GlossaryTerm>MX Record</GlossaryTerm>s
      </h3>

      <p>
        <GlossaryTerm>SMTP</GlossaryTerm> servers use{" "}
        <GlossaryTerm>DNS</GlossaryTerm> <GlossaryTerm>MX Record</GlossaryTerm>s
        (Mail Exchange) to find destination mail servers:
      </p>

      <TechnicalDeepDive title="MX Record Resolution Process">
        <p>
          When sending email to <code>user@example.com</code>, the SMTP server:
        </p>
        <ol>
          <li>
            <strong>Extracts Domain:</strong> <code>example.com</code>
          </li>
          <li>
            <strong>DNS Query:</strong> Looks up MX records for{" "}
            <code>example.com</code>
          </li>
          <li>
            <strong>Priority Sorting:</strong> Orders servers by priority (lower
            = higher priority)
          </li>
          <li>
            <strong>Connection Attempt:</strong> Tries each server until
            successful
          </li>
        </ol>

        <ShellCode
          title="DNS MX Record Query"
          code={`# Query MX records for a domain
dig MX example.com

# Example response:
# example.com.    300    IN    MX    10 mail1.example.com.
# example.com.    300    IN    MX    20 mail2.example.com.
# example.com.    300    IN    MX    30 backup.example.com.`}
        />

        <MermaidDiagram
          chart={`
          graph TD
            A["Email to user@example.com"] --> B["Extract Domain: example.com"]
            B --> C["DNS MX Query"]
            C --> D["MX Records Response"]
            D --> E["Priority 10: mail1.example.com"]
            D --> F["Priority 20: mail2.example.com"]
            D --> G["Priority 30: backup.example.com"]
            E --> H{"Connection Success?"}
            H -->|"Yes"| I["Deliver Message"]
            H -->|"No"| F
            F --> J{"Connection Success?"}
            J -->|"Yes"| I
            J -->|"No"| G
            G --> K["Try Backup Server"]
          `}
        />
      </TechnicalDeepDive>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">MX Record Lookup Example:</h4>
        <div className="text-sm space-y-1 font-mono">
          <p>Email to: user@example.com</p>
          <p>
            <GlossaryTerm>DNS</GlossaryTerm> query:{" "}
            <GlossaryTerm>MX Record</GlossaryTerm>s for example.com
          </p>
          <p>Response: mail.example.com (priority 10)</p>
          <p>
            Connect to: mail.example.com <GlossaryTerm>port</GlossaryTerm> 25
          </p>
        </div>
      </div>

      <h3>SMTP Command Structure</h3>

      <p>
        SMTP uses simple text commands that are easy to understand and debug:
      </p>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6 font-mono text-sm">
        <div className="space-y-1">
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
            HELLO mail.example.com
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Server:</span>{" "}
            250 Hello mail.example.com
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
            MAIL FROM:&lt;alice@example.com&gt;
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Server:</span>{" "}
            250 OK
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
            RCPT TO:&lt;bob@example.org&gt;
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Server:</span>{" "}
            250 OK
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
            DATA
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Server:</span>{" "}
            354 Start mail input; end with &lt;CRLF&gt;.&lt;CRLF&gt;
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
            Subject: Hello World
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span>{" "}
            This is a test message.
          </div>
          <div>
            <span className="text-blue-600 dark:text-blue-400">Client:</span> .
          </div>
          <div>
            <span className="text-green-600 dark:text-green-400">Server:</span>{" "}
            250 Message accepted
          </div>
        </div>
      </div>

      <h3>Essential SMTP Commands</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <div className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
          <h5 className="font-semibold text-blue-600 dark:text-blue-400">
            HELO/EHLO
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Identify the sending server
          </p>
        </div>
        <div className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
          <h5 className="font-semibold text-green-600 dark:text-green-400">
            MAIL FROM
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Specify the sender's address
          </p>
        </div>
        <div className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
          <h5 className="font-semibold text-yellow-600 dark:text-yellow-400">
            RCPT TO
          </h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Specify the recipient's address
          </p>
        </div>
        <div className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30 p-3 rounded">
          <h5 className="font-semibold text-red-600 dark:text-red-400">DATA</h5>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Begin message content transmission
          </p>
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

      <TechnicalDeepDive title="SMTP Response Code Categories">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded border-l-4 border-green-400 dark:border-green-500">
              <h5 className="font-semibold text-green-800 dark:text-green-200">
                2xx - Success
              </h5>
              <ul className="text-sm text-green-700 dark:text-green-300 mt-2 space-y-1">
                <li>
                  <strong>220:</strong> Service ready
                </li>
                <li>
                  <strong>250:</strong> Requested action completed
                </li>
                <li>
                  <strong>251:</strong> User not local, forwarding
                </li>
                <li>
                  <strong>252:</strong> Cannot verify user, will attempt
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded border-l-4 border-blue-400 dark:border-blue-500">
              <h5 className="font-semibold text-blue-800 dark:text-blue-200">
                3xx - Intermediate
              </h5>
              <ul className="text-sm text-blue-700 dark:text-blue-300 mt-2 space-y-1">
                <li>
                  <strong>354:</strong> Start mail input
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded border-l-4 border-yellow-400 dark:border-yellow-500">
              <h5 className="font-semibold text-yellow-800 dark:text-yellow-200">
                4xx - Temporary Failure
              </h5>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                <li>
                  <strong>421:</strong> Service not available
                </li>
                <li>
                  <strong>450:</strong> Mailbox busy
                </li>
                <li>
                  <strong>451:</strong> Local error processing
                </li>
                <li>
                  <strong>452:</strong> Insufficient storage
                </li>
              </ul>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded border-l-4 border-red-400 dark:border-red-500">
              <h5 className="font-semibold text-red-800 dark:text-red-200">
                5xx - Permanent Failure
              </h5>
              <ul className="text-sm text-red-700 dark:text-red-300 mt-2 space-y-1">
                <li>
                  <strong>500:</strong> Syntax error
                </li>
                <li>
                  <strong>550:</strong> Mailbox unavailable
                </li>
                <li>
                  <strong>551:</strong> User not local
                </li>
                <li>
                  <strong>552:</strong> Storage allocation exceeded
                </li>
              </ul>
            </div>
          </div>
        </div>
      </TechnicalDeepDive>

      <h3>Message Format vs Transport</h3>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-500 p-4 my-6">
        <h4 className="text-yellow-900 dark:text-yellow-100 font-semibold">
          Important Distinction
        </h4>
        <p className="text-yellow-800 dark:text-yellow-200">
          RFC 821 defines how to <em>transport</em> email messages. The format
          of the message content (headers like From:, To:, Subject:) is defined
          separately in RFC 822 (now RFC 5322).
        </p>
      </div>

      <h3>Store and Forward Architecture</h3>

      <p>SMTP's store-and-forward design provides reliability:</p>

      <MermaidDiagram
        chart={`
        graph TD
          A["Incoming Email"] --> B["Queue Message"]
          B --> C{"Destination Available?"}
          C -->|"Yes"| D["Attempt Delivery"]
          C -->|"No"| E["Store in Queue"]

          D --> F{"Delivery Success?"}
          F -->|"Yes"| G["Message Delivered"]
          F -->|"No"| H["Check Retry Count"]

          H --> I{"Max Retries?"}
          I -->|"No"| J["Wait & Retry Later"]
          I -->|"Yes"| K["Generate Bounce Message"]

          E --> L["Retry Timer"]
          L --> C
          J --> L

          style G fill:#c8e6c9
          style K fill:#ffcdd2
        `}
        className="my-8 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg"
      />

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
          <strong>
            No <GlossaryTerm>Encryption</GlossaryTerm>:
          </strong>{" "}
          Messages sent in plain text
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
        <div className="border border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/20 p-4 rounded">
          <h4 className="font-semibold text-green-600 dark:text-green-400 mb-2">
            What Still Works
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>✓ Basic protocol commands</li>
            <li>✓ Store and forward architecture</li>
            <li>✓ MX record routing</li>
            <li>✓ Text-based simplicity</li>
          </ul>
        </div>
        <div className="border border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4 rounded">
          <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">
            Modern Additions
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <li>+ Authentication (AUTH)</li>
            <li>
              + <GlossaryTerm>Encryption</GlossaryTerm> (STARTTLS)
            </li>
            <li>+ Anti-spam measures</li>
            <li>+ Delivery status notifications</li>
          </ul>
        </div>
      </div>

      <h3>
        Common SMTP <GlossaryTerm>Port</GlossaryTerm>s
      </h3>

      <ul>
        <li>
          <strong>
            <GlossaryTerm>Port</GlossaryTerm> 25:
          </strong>{" "}
          Original SMTP (server-to-server)
        </li>
        <li>
          <strong>
            <GlossaryTerm>Port</GlossaryTerm> 587:
          </strong>{" "}
          SMTP submission (<GlossaryTerm>client-server</GlossaryTerm>)
        </li>
        <li>
          <strong>
            <GlossaryTerm>Port</GlossaryTerm> 465:
          </strong>{" "}
          SMTPS (deprecated but still used)
        </li>
      </ul>

      <ExpandableSection title="🐳 Interactive Docker Demo: SMTP Email System">
        <p>
          Experience SMTP in action with our comprehensive Docker demonstration!
          This setup includes:
        </p>

        <ul>
          <li>
            <strong>SMTP Server</strong> - Receives and stores emails
            (store-and-forward)
          </li>
          <li>
            <strong>SMTP Client</strong> - Sends test emails demonstrating MX
            lookups
          </li>
          <li>
            <strong>DNS Simulator</strong> - Provides MX records for mail
            routing
          </li>
          <li>
            <strong>Web Interface</strong> - View received emails in real-time
          </li>
        </ul>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 my-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
            🚀 Quick Start
          </h4>

          <CodeBlock
            language="bash"
            code={`# Clone the repository
git clone https://github.com/stonecharioteer/interactive-rfc-tutorials.git
cd interactive-rfc-tutorials/docker-examples/rfc821-smtp

# Start the SMTP demonstration
docker compose up --build

# Open web interface to see emails
# Visit: http://localhost:8080`}
          />

          <p className="text-blue-800 dark:text-blue-200 text-sm mt-3">
            <strong>What you'll see:</strong> A complete email system with SMTP
            server receiving emails, client sending test messages, DNS
            resolution, and a web interface showing the store-and-forward
            process in action.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded p-3">
            <h5 className="font-semibold text-green-800 dark:text-green-200">
              📧 SMTP Server
            </h5>
            <p className="text-sm text-green-700 dark:text-green-300">
              Implements RFC 821 protocol, handles HELO/MAIL FROM/RCPT TO/DATA
              commands
            </p>
          </div>
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700 rounded p-3">
            <h5 className="font-semibold text-orange-800 dark:text-orange-200">
              📤 SMTP Client
            </h5>
            <p className="text-sm text-orange-700 dark:text-orange-300">
              Sends emails with MX lookup, demonstrates response codes and error
              handling
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded p-3">
            <h5 className="font-semibold text-purple-800 dark:text-purple-200">
              🔍 DNS Simulator
            </h5>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Provides MX records for email routing, demonstrates mail server
              discovery
            </p>
          </div>
          <div className="bg-cyan-50 dark:bg-cyan-900/20 border border-cyan-200 dark:border-cyan-700 rounded p-3">
            <h5 className="font-semibold text-cyan-800 dark:text-cyan-200">
              🌐 Web Interface
            </h5>
            <p className="text-sm text-cyan-700 dark:text-cyan-300">
              View emails in real-time, see store-and-forward queue, protocol
              details
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 my-4">
          <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
            📬 Web Email Viewer
          </h4>
          <p className="text-yellow-800 dark:text-yellow-200 text-sm">
            The demo includes a web interface at{" "}
            <strong>http://localhost:8080</strong> where you can:
          </p>
          <ul className="text-yellow-800 dark:text-yellow-200 text-sm mt-2 space-y-1">
            <li>• Watch emails arrive in real-time</li>
            <li>• See SMTP protocol information (Message-ID, timestamps)</li>
            <li>• View store-and-forward queue status</li>
            <li>• Monitor email statistics and activity</li>
          </ul>
        </div>

        <details className="mt-4">
          <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200">
            🧪 Test SMTP Manually
          </summary>
          <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
            <p className="text-sm mb-2">
              You can also test the SMTP server directly using telnet:
            </p>
            <CodeBlock
              language="bash"
              code={`# Connect to SMTP server
telnet localhost 2525

# Send SMTP commands:
HELLO test.com
MAIL FROM:<test@example.com>
RCPT TO:<user@example.com>
DATA
Subject: Manual Test

This is a manual SMTP test message.
.
QUIT`}
            />
          </div>
        </details>

        <details className="mt-4">
          <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200">
            ⚙️ Customize the Demo
          </summary>
          <div className="mt-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
            <CodeBlock
              language="bash"
              code={`# Send more emails with custom timing
EMAIL_COUNT=10 DELAY_SECONDS=1 docker compose up --build

# Test different scenarios
EMAIL_COUNT=20 DELAY_SECONDS=0.5 docker compose up  # High volume
DOMAIN=mycompany.com docker compose up             # Different domain`}
            />
          </div>
        </details>
      </ExpandableSection>

      <EliPythonistaSection>
        <h4>Understanding SMTP Through Python</h4>

        <p>
          Think of SMTP like Python's networking - it's all about sockets,
          protocols, and message passing. Here's how SMTP concepts map to
          Python:
        </p>

        <h5>1. SMTP is Like a Socket Connection</h5>
        <p>
          Just like creating a TCP socket in Python, SMTP establishes a
          connection between two mail servers:
        </p>

        <PythonCode
          title="Basic Socket Connection (like SMTP does)"
          code={`import socket

# Create a socket connection (like SMTP does internally)
smtp_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
smtp_socket.connect(('mail.example.com', 25))

# SMTP sends text commands over this socket
smtp_socket.send(b'HELLO client.example.com\\r\\n')
response = smtp_socket.recv(1024)
print(response.decode())  # "250 Hello client.example.com"`}
        />

        <h5>2. SMTP Commands are Like Function Calls</h5>
        <p>
          Each SMTP command is like calling a method on a remote mail server:
        </p>

        <PythonCode
          title="SMTP Commands as Python Methods"
          code={`# SMTP conceptually works like this:
class SMTPServer:
    def hello(self, hostname):
        return "250 Hello " + hostname

    def mail_from(self, sender):
        self.sender = sender
        return "250 OK"

    def rcpt_to(self, recipient):
        self.recipients.append(recipient)
        return "250 OK"

    def data(self, message):
        # Store the message for delivery
        self.queue_message(self.sender, self.recipients, message)
        return "250 Message accepted"

# Client sends commands:
server = SMTPServer()
print(server.hello("client.example.com"))
print(server.mail_from("alice@client.com"))
print(server.rcpt_to("bob@example.com"))
print(server.data("Subject: Hello\\n\\nHi Bob!"))`}
        />

        <h5>3. Sending Email with Python's smtplib</h5>
        <p>
          Python's <code>smtplib</code> implements the SMTP protocol for you:
        </p>

        <PythonCode
          title="Sending Email with Python"
          code={`import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# Create message
msg = MIMEMultipart()
msg['From'] = 'alice@company.com'
msg['To'] = 'bob@university.edu'
msg['Subject'] = 'Hello from Python!'

# Add message body
body = "This email was sent using Python and SMTP!"
msg.attach(MIMEText(body, 'plain'))

# Connect to SMTP server and send
try:
    # Connect to SMTP server (like the diagram above)
    server = smtplib.SMTP('smtp.company.com', 587)
    server.starttls()  # Enable encryption
    server.login('alice@company.com', 'password')

    # Send email (executes MAIL FROM, RCPT TO, DATA commands)
    text = msg.as_string()
    server.sendmail('alice@company.com', 'bob@university.edu', text)
    server.quit()

    print("Email sent successfully!")
except Exception as e:
    print(f"Error: {e}")`}
        />

        <h5>4. Store and Forward Like a Queue</h5>
        <p>SMTP's store-and-forward mechanism is like Python's queue system:</p>

        <PythonCode
          title="Email Queue Simulation"
          code={`import queue
import time
from dataclasses import dataclass
from typing import List

@dataclass
class EmailMessage:
    sender: str
    recipients: List[str]
    subject: str
    body: str
    retry_count: int = 0
    max_retries: int = 3

class EmailQueue:
    def __init__(self):
        self.pending = queue.Queue()
        self.failed = []

    def enqueue_message(self, message: EmailMessage):
        """Store message for delivery (like SMTP queue)"""
        self.pending.put(message)

    def process_queue(self):
        """Process pending messages (like SMTP relay)"""
        while not self.pending.empty():
            message = self.pending.get()

            if self.attempt_delivery(message):
                print(f"✓ Delivered: {message.subject}")
            else:
                message.retry_count += 1
                if message.retry_count < message.max_retries:
                    # Retry later (like SMTP retry logic)
                    print(f"⏰ Retrying: {message.subject} (attempt {message.retry_count})")
                    time.sleep(1)  # Wait before retry
                    self.pending.put(message)
                else:
                    # Generate bounce message
                    print(f"❌ Bounced: {message.subject} - Max retries exceeded")
                    self.failed.append(message)

    def attempt_delivery(self, message: EmailMessage) -> bool:
        """Simulate delivery attempt"""
        # In real SMTP, this would try to connect to recipient's mail server
        import random
        return random.choice([True, False, False])  # 33% success rate

# Example usage
email_queue = EmailQueue()

# Add messages to queue
email_queue.enqueue_message(EmailMessage(
    sender="alice@company.com",
    recipients=["bob@university.edu"],
    subject="Important meeting reminder",
    body="Don't forget our meeting tomorrow!"
))

# Process the queue (like SMTP daemon)
email_queue.process_queue()`}
        />

        <h5>5. DNS MX Record Lookup</h5>
        <p>
          SMTP servers need to find mail servers using DNS, just like Python's
          DNS lookups:
        </p>

        <PythonCode
          title="MX Record Lookup in Python"
          code={`import socket
import dns.resolver  # pip install dnspython

def find_mail_servers(domain):
    """Find mail servers for a domain (like SMTP does)"""
    try:
        # Query MX records
        mx_records = dns.resolver.resolve(domain, 'MX')

        # Sort by priority (lower number = higher priority)
        servers = [(record.priority, str(record.exchange)) for record in mx_records]
        servers.sort()

        return servers
    except Exception as e:
        print(f"DNS lookup failed: {e}")
        return []

def send_to_domain(recipient_email, message):
    """Simulate SMTP delivery process"""
    domain = recipient_email.split('@')[1]

    # Find mail servers for domain
    mail_servers = find_mail_servers(domain)
    print(f"Mail servers for {domain}: {mail_servers}")

    # Try each server in priority order
    for priority, server in mail_servers:
        try:
            print(f"Attempting delivery to {server} (priority {priority})")
            # Here you would use smtplib to connect to the server
            # server = smtplib.SMTP(server, 25)
            # server.sendmail(sender, recipient, message)
            print(f"✓ Message delivered via {server}")
            return True
        except Exception as e:
            print(f"✗ Failed to connect to {server}: {e}")
            continue

    print("❌ All mail servers failed - message bounced")
    return False

# Example
send_to_domain("user@gmail.com", "Test message")`}
        />

        <h5>Key Python Parallels</h5>
        <ul>
          <li>
            <strong>Sockets:</strong> SMTP uses TCP sockets, just like Python's{" "}
            <code>socket</code> module
          </li>
          <li>
            <strong>Text Protocols:</strong> SMTP commands are strings, like
            HTTP requests
          </li>
          <li>
            <strong>Error Handling:</strong> SMTP response codes work like
            Python exceptions
          </li>
          <li>
            <strong>Queues:</strong> Email queuing is like Python's{" "}
            <code>queue.Queue</code>
          </li>
          <li>
            <strong>Retries:</strong> SMTP retry logic is like Python's retry
            decorators
          </li>
          <li>
            <strong>DNS:</strong> MX lookups are like{" "}
            <code>socket.gethostbyname()</code>
          </li>
        </ul>
      </EliPythonistaSection>

      <h3>Testing SMTP Manually</h3>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">You can test SMTP using telnet:</h4>
        <div className="text-sm font-mono">
          <p>telnet mail.example.com 25</p>
          <p className="text-gray-600"># Then type SMTP commands manually</p>
        </div>
      </div>

      <h3>SMTP's Enduring Dominance in the Modern Email Ecosystem</h3>

      <p>
        SMTP remains the universal backbone of email communication, processing billions of 
        messages daily across the global digital economy and personal communications:
      </p>

      <div className="bg-teal-50 border border-teal-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-teal-900 mb-4">📧 SMTP Powers Global Communication</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-3">
            <h5 className="font-semibold text-teal-800">Consumer Email</h5>
            <ul className="text-teal-700 text-sm space-y-1">
              <li>• Gmail (1.8+ billion users)</li>
              <li>• Outlook/Hotmail (400+ million users)</li>
              <li>• Yahoo Mail (200+ million users)</li>
              <li>• Apple iCloud Mail</li>
              <li>• Mobile email applications</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-teal-800">Enterprise & Business</h5>
            <ul className="text-teal-700 text-sm space-y-1">
              <li>• Microsoft Exchange Server</li>
              <li>• Google Workspace (Gmail for Business)</li>
              <li>• Marketing automation platforms</li>
              <li>• Customer support systems</li>
              <li>• Financial transaction notifications</li>
            </ul>
          </div>
          
          <div className="space-y-3">
            <h5 className="font-semibold text-teal-800">Critical Infrastructure</h5>
            <ul className="text-teal-700 text-sm space-y-1">
              <li>• System monitoring alerts</li>
              <li>• Security incident notifications</li>
              <li>• Automated reporting systems</li>
              <li>• Backup and recovery alerts</li>
              <li>• IoT device communications</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-orange-900 mb-3">📊 SMTP by the Numbers (2025)</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-orange-800">360B+</div>
            <div className="text-sm text-orange-700">Emails sent daily worldwide</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-800">40+</div>
            <div className="text-sm text-orange-700">Years in continuous operation</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-800">99.9%</div>
            <div className="text-sm text-orange-700">Email infrastructure uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-800">4B+</div>
            <div className="text-sm text-orange-700">Active email users globally</div>
          </div>
        </div>
      </div>

      <ExpandableSection title="🔄 SMTP vs Modern Messaging: The Great Communication Protocol Battle">
        <p>
          While SMTP dominates email, numerous alternatives have emerged for real-time and modern communication:
        </p>

        <div className="space-y-6 mt-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h5 className="font-semibold text-red-800 mb-2">💬 Real-Time Messaging Protocols</h5>
            <div className="text-red-700 text-sm space-y-2">
              <p><strong>XMPP (Jabber):</strong> XML-based real-time messaging, used in enterprise chat systems</p>
              <p><strong>WebSocket + Custom:</strong> WhatsApp, Slack, Discord use WebSocket with proprietary protocols</p>
              <p><strong>Matrix Protocol:</strong> Decentralized real-time communication with federation</p>
              <p><strong>Challenge to SMTP:</strong> Instant delivery vs store-and-forward, but lacks universal interoperability</p>
              <p><strong>Outcome:</strong> Coexistence - messaging for real-time, email for formal/asynchronous communication</p>
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 p-4 rounded">
            <h5 className="font-semibold text-purple-800 mb-2">📱 Mobile-First Communication</h5>
            <div className="text-purple-700 text-sm space-y-2">
              <p><strong>Push Notifications:</strong> Apple Push Notification Service (APNs), Firebase Cloud Messaging</p>
              <p><strong>SMS/RCS Integration:</strong> Rich Communication Services extending traditional SMS</p>
              <p><strong>App-to-App Messaging:</strong> iMessage, WhatsApp, Telegram with end-to-end encryption</p>
              <p><strong>Adoption Challenge:</strong> Platform lock-in vs SMTP's universal interoperability</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800 mb-2">🔒 Modern SMTP Security Evolution</h5>
            <div className="text-yellow-700 text-sm space-y-2">
              <p><strong>DMARC/SPF/DKIM:</strong> Email authentication preventing spoofing and phishing</p>
              <p><strong>MTA-STS:</strong> SMTP security via HTTPS policy discovery</p>
              <p><strong>TLS Everywhere:</strong> Opportunistic encryption becoming standard</p>
              <p><strong>DNS-based Security:</strong> DANE (DNS-based Authentication of Named Entities)</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded">
            <h5 className="font-semibold text-blue-800 mb-2">🌐 Alternative Email Protocols (Historical)</h5>
            <div className="text-blue-700 text-sm space-y-2">
              <p><strong>X.400:</strong> ISO/ITU-T messaging standard, government-mandated but complex</p>
              <p><strong>UUCP:</strong> Unix-to-Unix Copy for early internet email routing</p>
              <p><strong>Lotus Notes/Domino:</strong> Proprietary email system with rich collaboration features</p>
              <p><strong>Why SMTP Won:</strong> Simplicity, openness, TCP/IP integration, minimal implementation requirements</p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800 mb-2">🏆 SMTP's Continued Advantages</h5>
            <div className="text-green-700 text-sm space-y-2">
              <p><strong>Universal Interoperability:</strong> Any email system can communicate with any other</p>
              <p><strong>Store-and-Forward Reliability:</strong> Messages persist through network outages</p>
              <p><strong>Asynchronous Nature:</strong> Perfect for non-real-time formal communication</p>
              <p><strong>Proven Scalability:</strong> Handles global message volumes with distributed architecture</p>
              <p><strong>Regulatory Compliance:</strong> Well-understood legal framework for business communications</p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h5 className="font-semibold text-indigo-800 mb-2">📖 Further Reading</h5>
          <ul className="text-indigo-700 text-sm space-y-1">
            <li><a href="https://www.rfc-editor.org/rfc/rfc5321.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 5321: Simple Mail Transfer Protocol (Updated)</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc7208.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 7208: Sender Policy Framework (SPF)</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc6376.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 6376: DomainKeys Identified Mail (DKIM)</a></li>
            <li><a href="https://www.rfc-editor.org/rfc/rfc7489.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 7489: Domain-based Message Authentication (DMARC)</a></li>
            <li><a href="https://tools.ietf.org/html/rfc8461" className="underline" target="_blank" rel="noopener noreferrer">RFC 8461: SMTP MTA Strict Transport Security (MTA-STS)</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-violet-50 border border-violet-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-violet-900 mb-3">🎯 SMTP in Different Industries</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-violet-800 mb-2">E-commerce & Marketing</h5>
            <ul className="text-violet-700 text-sm space-y-1">
              <li>• Order confirmations and shipping notifications</li>
              <li>• Marketing campaigns (MailChimp, SendGrid)</li>
              <li>• Customer support ticket systems</li>
              <li>• Abandoned cart recovery emails</li>
              <li>• Subscription and newsletter management</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-violet-800 mb-2">Banking & Finance</h5>
            <ul className="text-violet-700 text-sm space-y-1">
              <li>• Transaction alerts and account statements</li>
              <li>• Fraud detection notifications</li>
              <li>• Regulatory compliance reporting</li>
              <li>• Investment portfolio updates</li>
              <li>• Loan and credit application processing</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 border border-slate-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-slate-900 mb-3">🔮 SMTP's Future: Integration, Not Replacement</h4>
        <div className="space-y-4">
          <div>
            <h5 className="font-semibold text-slate-800">Enhanced Security Standards</h5>
            <p className="text-slate-700 text-sm">
              Mandatory TLS encryption, post-quantum cryptography integration,
              AI-powered spam detection, and zero-trust email architectures
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">API-First Integration</h5>
            <p className="text-slate-700 text-sm">
              RESTful email APIs (SendGrid, Mailgun), GraphQL email queries,
              microservices architecture, and cloud-native email processing
            </p>
          </div>
          <div>
            <h5 className="font-semibold text-slate-800">Multi-Protocol Coexistence</h5>
            <p className="text-slate-700 text-sm">
              SMTP for formal communications, real-time messaging for instant chat,
              push notifications for alerts—each protocol optimized for its use case
            </p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-400 dark:border-green-500 p-4 mt-6">
        <h4 className="text-green-900 dark:text-green-100 font-semibold">
          Key Takeaway
        </h4>
        <p className="text-green-800 dark:text-green-200">
          SMTP's 40+ year reign as the backbone of email demonstrates the power of 
          solving fundamental problems with elegant simplicity. While real-time messaging 
          has emerged for instant communication, SMTP's store-and-forward reliability, 
          universal interoperability, and formal communication capabilities ensure it 
          will remain essential for decades to come. Its greatest achievement is creating 
          a global communication infrastructure that enables anyone to reach anyone else 
          with a simple address format.
        </p>
      </div>
    </article>
  );
}
