export const code = `import smtplib
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
    print(f"Error: {e}")`;
