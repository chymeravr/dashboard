import sendgrid
from sendgrid import Email
from sendgrid.helpers.mail import Content, Mail, Personalization

from dashboard import settings

RECEPIENTS = ['info@chymeravr.com']

WELCOME_MESSAGE = """
<html>
<head>
	<title></title>
</head>
<body>
<div>
<pre style="background-color: rgb(255, 255, 255); font-family: &quot;DejaVu Sans Mono&quot;; font-size: 9pt;">
<span style="font-family:arial,helvetica,sans-serif;"><span style="font-size:12.8px;">Hi

Thanks for being interested in <a href="http://www.chymeravr.com">Chymera VR</a>, the VR ad-network. I&#39;m Smeet, CEO of the company.

I&#39;d like to tell you more about our product. Would you be available for a call this week?


--
Best,
Smeet</span></span></pre>
</div>
</body>
</html>

"""


def send_welcome_mail(email):
    sg = sendgrid.SendGridAPIClient(apikey=settings.SENDGRID_API_KEY)
    from_email = Email('smeet@chymeravr.com', name="Smeet Bhatt")
    subject = "Chymera VR Ad Network"
    content = Content("text/html", WELCOME_MESSAGE)

    mail = Mail(from_email, subject, Email(email), content=content)
    personalization = Personalization()
    for recepient in RECEPIENTS:
        personalization.add_to(Email(recepient))

    print(personalization)
    mail.add_personalization(personalization)
    response = sg.client.mail.send.post(request_body=mail.get())
    print(response.status_code)
    print(response.body)
    print(response.headers)
