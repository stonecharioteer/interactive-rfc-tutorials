import GlossaryTerm from '../../components/GlossaryTerm';
import CodeBlock from '../../components/CodeBlock';
import ExpandableSection from '../../components/ExpandableSection';

export default function RFC1() {
  return (
    <article className="prose prose-lg max-w-none">
      <h1>RFC 1: Host Software (April 7, 1969)</h1>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Historical Significance
        </h3>
        <p className="text-blue-800">
          This is the very first <GlossaryTerm>RFC</GlossaryTerm> (Request for Comments) document, authored
          by Steve Crocker. It established the collaborative, informal tone that
          would define internet development for decades.
        </p>
      </div>

      <h2>The Birth of Collaborative Internet Development</h2>

      <p>
        On April 7, 1969, Steve Crocker, a graduate student at UCLA, wrote the
        first <GlossaryTerm>RFC</GlossaryTerm>. What makes this document revolutionary isn't its technical
        content, but its tone and approach. Crocker deliberately chose an
        informal, collaborative style that invited discussion rather than
        dictating solutions.
      </p>

      <h3>Key Innovations in RFC 1</h3>

      <ul>
        <li>
          <strong>Open Collaboration:</strong> Established the principle that
          internet development should be open to all
        </li>
        <li>
          <strong>Request for Comments:</strong> The name itself invited
          discussion rather than mandating compliance
        </li>
        <li>
          <strong>Informal Tone:</strong> Used phrases like "I hope" and "it
          seems to me" to encourage participation
        </li>
        <li>
          <strong>Documentation Culture:</strong> Started the tradition of
          documenting internet protocols
        </li>
      </ul>

      <div className="bg-gray-100 p-4 rounded-lg my-6">
        <h4 className="font-semibold mb-2">
          Original Quote from Steve Crocker:
        </h4>
        <blockquote className="italic">
          "The content of a note may be any thought, suggestion, etc. related to
          the HOST software or other aspect of the network. Notes are encouraged
          to be timely rather than polished."
        </blockquote>
      </div>

      <h3>Impact on Modern Internet</h3>

      <p>The collaborative spirit established by RFC 1 directly led to:</p>

      <ul>
        <li>Open internet standards development</li>
        <li>The Internet Engineering Task Force (IETF)</li>
        <li>Consensus-based decision making in protocol design</li>
        <li>The culture of sharing and peer review in technology</li>
      </ul>

      <ExpandableSection title="🐍 ELI-Pythonista: RFC 1's Legacy in Open Source">
        <p>
          RFC 1's collaborative spirit lives on in Python and the open source community. 
          Here's how to work with RFCs programmatically:
        </p>

        <CodeBlock
          language="python"
          code={`import requests
import re
from datetime import datetime

def fetch_rfc(rfc_number):
    """Fetch an RFC document from the official RFC repository."""
    
    url = f"https://www.rfc-editor.org/rfc/rfc{rfc_number}.txt"
    
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        
        # Extract basic metadata
        text = response.text
        lines = text.split('\\n')
        
        # Find title (usually in first few lines)
        title = "Unknown"
        for line in lines[:20]:
            if "Request for Comments:" in line:
                # Title often follows RFC number
                next_line_idx = lines.index(line) + 1
                if next_line_idx < len(lines):
                    title = lines[next_line_idx].strip()
                break
        
        # Find date
        date_pattern = r'(January|February|March|April|May|June|July|August|September|October|November|December)\\s+(\\d{1,2}),?\\s+(\\d{4})'
        date_match = re.search(date_pattern, text)
        date = date_match.group(0) if date_match else "Unknown"
        
        return {
            'number': rfc_number,
            'title': title,
            'date': date,
            'url': url,
            'length': len(text),
            'lines': len(lines)
        }
    
    except requests.RequestException as e:
        return {'error': f"Failed to fetch RFC {rfc_number}: {e}"}

# Example: Fetch information about historic RFCs
historic_rfcs = [1, 675, 791, 793, 821]

print("📚 Fetching historic RFCs...")
for rfc_num in historic_rfcs:
    rfc_info = fetch_rfc(rfc_num)
    
    if 'error' not in rfc_info:
        print(f"\\n📄 RFC {rfc_info['number']}")
        print(f"   Title: {rfc_info['title'][:60]}...")
        print(f"   Date: {rfc_info['date']}")
        print(f"   Length: {rfc_info['length']:,} characters")
    else:
        print(f"\\n❌ RFC {rfc_num}: {rfc_info['error']}")

print("\\n🌟 All these RFCs follow the collaborative spirit of RFC 1!")`}
        />

        <p>
          <strong>Building collaborative tools</strong> inspired by RFC 1:
        </p>

        <CodeBlock
          language="python"
          code={`import json
from datetime import datetime

class SimpleRFC:
    """A simple RFC-like document system following RFC 1's principles."""
    
    def __init__(self, number, title, author):
        self.number = number
        self.title = title
        self.author = author
        self.date = datetime.now().strftime("%B %d, %Y")
        self.content = []
        self.comments = []
    
    def add_section(self, title, content):
        """Add a section (like RFC 1's informal structure)."""
        self.content.append({
            'type': 'section',
            'title': title,
            'content': content
        })
    
    def add_comment(self, author, comment):
        """Add a comment (following RFC's collaborative spirit)."""
        self.comments.append({
            'author': author,
            'date': datetime.now().isoformat(),
            'comment': comment
        })
    
    def publish(self):
        """Publish the document (like RFC 1's informal publication)."""
        doc = {
            'rfc_number': self.number,
            'title': self.title,
            'author': self.author,
            'date': self.date,
            'note': "Following RFC 1's principle: 'Notes are encouraged to be timely rather than polished'",
            'content': self.content,
            'comments': self.comments
        }
        return json.dumps(doc, indent=2)

# Example: Create a modern RFC-style document
rfc = SimpleRFC(9999, "Host Software for Python", "A Modern Developer")

rfc.add_section("Introduction", 
    "This document explores how to build network software in Python, " +
    "following the collaborative spirit established by RFC 1 in 1969.")

rfc.add_section("Implementation", 
    "The implementation should be simple, well-documented, and open to comments.")

rfc.add_comment("peer_reviewer", "Great idea! Have you considered async I/O?")
rfc.add_comment("another_dev", "This could integrate well with existing protocols.")

print("🚀 Publishing RFC 9999...")
print(rfc.publish())

print("\\n💡 This demonstrates RFC 1's key innovation:")
print("   Collaboration over authority, discussion over dictation!")`}
        />

        <p>
          RFC 1's approach of "timely rather than polished" and collaborative discussion 
          became the foundation of how Python and the entire open source community operates today!
        </p>
      </ExpandableSection>

      <h3>Timeline Context</h3>

      <div className="border-l-4 border-gray-300 pl-4 my-6">
        <p>
          <strong>1969:</strong> ARPANET project begins
        </p>
        <p>
          <strong>April 1969:</strong> RFC 1 written
        </p>
        <p>
          <strong>October 1969:</strong> First ARPANET message sent between UCLA
          and Stanford
        </p>
      </div>

      <h3>Why This Matters Today</h3>

      <p>
        Understanding RFC 1 helps you appreciate why the internet developed so
        differently from other communication networks. The collaborative, open
        approach established here enabled rapid innovation and global
        participation in internet development.
      </p>

      <h3>RFC 1's Impact on Today's Internet</h3>

      <p>
        The collaborative principles established by RFC 1 directly shaped how the modern internet operates:
      </p>

      <div className="bg-indigo-50 border border-indigo-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-indigo-900 mb-4">🌐 Modern Manifestations of RFC 1's Spirit</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-indigo-800 mb-3">Standards Development</h5>
            <ul className="text-indigo-700 text-sm space-y-2">
              <li><strong>IETF Process:</strong> Open participation, rough consensus</li>
              <li><strong>W3C:</strong> Web standards through collaboration</li>
              <li><strong>IEEE 802:</strong> Networking standards committees</li>
              <li><strong>ISO/IEC:</strong> International standardization bodies</li>
            </ul>
          </div>
          
          <div>
            <h5 className="font-semibold text-indigo-800 mb-3">Open Source Ecosystem</h5>
            <ul className="text-indigo-700 text-sm space-y-2">
              <li><strong>GitHub:</strong> Collaborative code development</li>
              <li><strong>Stack Overflow:</strong> Knowledge sharing community</li>
              <li><strong>Python PEPs:</strong> Enhancement proposals</li>
              <li><strong>Mozilla Foundation:</strong> Open web advocacy</li>
            </ul>
          </div>
        </div>
      </div>

      <ExpandableSection title="📚 Alternative Approaches to Standards Development">
        <p>
          While RFC 1's collaborative approach became dominant, other methods were considered:
        </p>

        <div className="space-y-4 mt-4">
          <div className="bg-red-50 border border-red-200 p-4 rounded">
            <h5 className="font-semibold text-red-800">❌ Corporate-Controlled Standards</h5>
            <p className="text-red-700 text-sm">
              <strong>Approach:</strong> Single companies defining protocols (like IBM's SNA)<br/>
              <strong>Problems:</strong> Vendor lock-in, limited innovation, proprietary restrictions<br/>
              <strong>Example:</strong> IBM's Systems Network Architecture vs. open TCP/IP
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
            <h5 className="font-semibold text-yellow-800">⚠️ Government-Mandated Standards</h5>
            <p className="text-yellow-700 text-sm">
              <strong>Approach:</strong> Top-down standards from regulatory bodies<br/>
              <strong>Problems:</strong> Slow adaptation, political influences, limited technical input<br/>
              <strong>Example:</strong> OSI networking model (government-backed but less successful than TCP/IP)
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <h5 className="font-semibold text-green-800">✅ RFC's Collaborative Model (Winner)</h5>
            <p className="text-green-700 text-sm">
              <strong>Approach:</strong> Open discussion, peer review, consensus-building<br/>
              <strong>Benefits:</strong> Technical merit wins, rapid innovation, wide adoption<br/>
              <strong>Success:</strong> Enabled the internet to become the global communication platform
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
          <h5 className="font-semibold text-blue-800 mb-2">📖 Further Reading</h5>
          <ul className="text-blue-700 text-sm space-y-1">
            <li><a href="https://www.rfc-editor.org/rfc/rfc3935.html" className="underline" target="_blank" rel="noopener noreferrer">RFC 3935: A Mission Statement for the IETF</a></li>
            <li><a href="https://www.ietf.org/about/process/" className="underline" target="_blank" rel="noopener noreferrer">IETF Standards Process</a></li>
            <li><a href="https://tools.ietf.org/html/rfc7282" className="underline" target="_blank" rel="noopener noreferrer">RFC 7282: On Consensus and Humming in the IETF</a></li>
            <li><a href="https://www.internetsociety.org/internet/history-internet/brief-history-internet/" className="underline" target="_blank" rel="noopener noreferrer">Brief History of the Internet - Internet Society</a></li>
          </ul>
        </div>
      </ExpandableSection>

      <div className="bg-purple-50 border border-purple-200 p-6 rounded-lg my-6">
        <h4 className="font-semibold text-purple-900 mb-3">🚀 RFC 1's Legacy in Modern Tech Culture</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-purple-800">Tech Conferences</h5>
            <p className="text-purple-700">Open presentations, Q&A sessions, collaborative workshops</p>
          </div>
          <div>
            <h5 className="font-semibold text-purple-800">Code Reviews</h5>
            <p className="text-purple-700">Peer feedback over authority, "Request for Comments" approach</p>
          </div>
          <div>
            <h5 className="font-semibold text-purple-800">API Design</h5>
            <p className="text-purple-700">Community input on interfaces, documentation-driven development</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 1's collaborative approach didn't just create a document format—it established 
          the cultural foundation that enabled the internet to become humanity's most 
          successful collaborative technology project. Every open source project, 
          every technical standard, and every online community today builds on RFC 1's 
          revolutionary idea: "good ideas come from discussion, not dictation."
        </p>
      </div>
    </article>
  );
}
