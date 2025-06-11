import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

sender = os.getenv("SMTP_USERNAME")

def connect():
    """Estabelece conexão com o servidor SMTP."""
    server = smtplib.SMTP(os.getenv("SMTP_SERVER"), os.getenv("SMTP_PORT"))
    server.starttls()  # Iniciar conexão segura
    server.login(os.getenv("SMTP_USERNAME"), os.getenv("SMTP_PASSWORD"))

    return server

def send_code_reset_password(code:str, send_email:str):
    server = connect()

    # Configurar a mensagem
    msg = MIMEMultipart()
    msg['From'] = os.getenv("SMTP_USERNAME")
    msg['To'] = send_email
    msg['Subject'] = os.getenv("APP_NAME")

    with open(f"app/templates/payment_code.html", mode="r") as arq:
        data = arq.read()
        data = data.replace("***URL_RESET***", os.getenv('APP_URL') + f"/reset-password?token={code}")
        data = data.replace("***CODE***", str(code))
        msg.attach(MIMEText(data, 'html'))
    arq.close()

    server.send_message(msg)

    return True