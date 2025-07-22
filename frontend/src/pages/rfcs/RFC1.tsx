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

      <div className="bg-green-50 border-l-4 border-green-400 p-4 mt-6">
        <h4 className="text-green-900 font-semibold">Key Takeaway</h4>
        <p className="text-green-800">
          RFC 1 shows that successful technology standards come from
          collaboration, not authority. This principle still guides internet
          development today.
        </p>
      </div>
    </article>
  );
}
