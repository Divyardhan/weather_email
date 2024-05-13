from django.urls import reverse
import win32com.client as win32
import json, pythoncom, urllib3, hashlib, random, string
from django.conf import settings
from user.models import User_db


def generate_token(length=64):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

def send_outlook_email(to, subject, body):
    try:
        pythoncom.CoInitialize()
        outlook = win32.Dispatch('outlook.application')
        mail = outlook.CreateItem(0)
        mail.To = to
        mail.Subject = subject
        mail.HTMLBody = body
        mail.Send()
    except Exception as e:
        print(e)
    finally:
        pythoncom.CoUninitialize()

def location_lookup(latitude, longitude):
    http = urllib3.PoolManager()
    try:
        url = f'http://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&zoom=18&addressdetails=1'
        response = http.request('GET', url)
        data = response.data.decode('utf-8')  # Decode bytes to string
        return json.loads(data)
    except urllib3.exceptions.HTTPError:
        return False

def generate_verification_link(email , text):
    base_url = settings.BASE_URL  # Define your base URL in settings.py
    verification_link = reverse(text, kwargs={'email': email})
    return f"{base_url}{verification_link}"

def send_verification_mail(email):
    verification_link = generate_verification_link(email,"verify")
    send_outlook_email(str(email), "verification Link", "Click on this link to verify your email  <p><a href ='"+ verification_link +"'>Click on this Link</a></p>" )

def hash_password(password):
    password_bytes = password.encode('utf-8')
    hashed_password = hashlib.sha256(password_bytes).hexdigest()
    return hashed_password