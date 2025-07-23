export const code = `import requests
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

print("\\n🌟 All these RFCs follow the collaborative spirit of RFC 1!")`;
