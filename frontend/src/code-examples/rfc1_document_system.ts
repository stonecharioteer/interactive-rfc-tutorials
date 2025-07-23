export const code = `import json
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
print("   Collaboration over authority, discussion over dictation!")`;
