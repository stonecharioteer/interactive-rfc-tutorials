export const code = `# SMTP conceptually works like this:
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
print(server.data("Subject: Hello\\n\\nHi Bob!"))`;
