from bs4 import BeautifulSoup
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import logging, sys, json, os, zipfile, time
from .models import Query_db, User_db
from django.db.models import Count
from django.core.serializers import serialize
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from utils.utils import location_lookup, hash_password, send_verification_mail, send_outlook_email, generate_verification_link, generate_token

# selenium load
service = Service(ChromeDriverManager().install())
options = Options()
options.add_argument('headless')
options.add_argument('--disable-extensions')
options.add_argument('--disable-infobars')
options.add_argument('--disable-gpu')
driver = webdriver.Chrome(service=service, options=options)

# Log file generation
logger = logging.getLogger()
loggers = {}
FORMATTER = logging.Formatter("%(asctime)s %(name)s %(levelname)s %(message)s")
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(FORMATTER)
logger.addHandler(console_handler)
file_handler = logging.FileHandler("test.log","a","utf8")
file_handler.setFormatter(FORMATTER)
logger.addHandler(file_handler)
logger.propagate = False
loggers["test"] = logger


# User defined function
def weather_data(location, flag=None):
    google_url = f"https://www.google.com/search?q=weather+{location}"
    driver.get(google_url)
    if flag is not None:
        elements = driver.find_elements(By.CLASS_NAME, "wob_df")
        return elements
    else:
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        temperature_element = soup.find('span', class_='wob_t')
        temperature = temperature_element.text.strip() if temperature_element else "N/A"
        sky_element = soup.find('span', id='wob_dc')
        sky = sky_element.text.strip() if sky_element else "N/A"
        return temperature, sky
    
def get_data(element):
    element.click()
    temperature_elements = element.find_elements(By.CLASS_NAME, "wob_t")
    max_temperature = temperature_elements[0].text.strip()
    min_temperature = temperature_elements[2].text.strip()
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    weather = soup.find('span', id='wob_dc').text.strip()
    Precipitation = soup.find('span', id='wob_pp').text.strip()
    Humidity = soup.find('span', id='wob_hm').text.strip()
    Wind = soup.find('span', id='wob_ws').text.strip()
    image_url = soup.find('img', id='wob_tci')['src']
    temperature = soup.find('span', class_='wob_t q8U8x').text.strip()
    day = soup.find('div', class_='wob_dts').text.strip()
    if ',' in day:
        day, time_ = day.split(',')
    weather_data = {
        "Day": day,
        "Weather": weather,
        "Temperature": temperature,
        "Min Temperature": min_temperature,
        "Max Temperature": max_temperature,
        "Precipitation": Precipitation,
        "Humidity": Humidity,
        "Wind": Wind,
        "ImageURL": image_url
    }
    return weather_data

def start_selenium(location, flag=2):
    start = time.time()
    data = []
    elements = weather_data(location, flag)
    for element in elements:
        data.append(get_data(element))
    end = time.time()
    print("Time taken:", end - start)
    return data

def my_task(email=None):
    if email is None:
        users = User_db.objects.filter(service_provided = True).all()
    else:
        users = User_db.objects.filter(email=email).first()
    weather_clothing_suggestions = {
        "Sunny": "Lightweight and breathable clothing such as shorts, t-shirts, sunglasses, and sunscreen.",
        "Mostly Sunny": "It's a good idea to have a hat and wear lightweight and breathable clothing such as shorts, t-shirts, sunglasses, and sunscreen.",
        "Clear": "Lightweight and breathable clothing such as shorts, t-shirts, sunglasses, and sunscreen.",
        "Partly Cloudy": "It may be a bit cooler due to cloud cover. Consider adding a light layer.",
        "Cloudy": "Long-sleeved shirts, light jackets, or sweaters to stay comfortable in cooler temperatures.",
        "Overcast": "Long-sleeved shirts, light jackets, or sweaters to stay comfortable in cooler temperatures.",
        "Rain": "Waterproof or water-resistant jacket or coat, umbrella, waterproof shoes or boots.",
        "Drizzle": "Light, fine rain falling in very small drops. A waterproof jacket or coat is recommended to stay dry.",
        "Showers": "Short periods of rain, typically heavier than drizzle. Waterproof gear is essential to stay dry.",
        "Thunderstorms": "Waterproof clothing, sturdy shoes, and consider staying indoors if possible.",
        "Snow": "Insulated and waterproof jacket or coat, snow pants, gloves, hat, scarf, and waterproof boots.",
        "Sleet": "Frozen raindrops or ice pellets falling with rain. Waterproof clothing is crucial due to potential mix of rain and snow.",
        "Freezing Rain": "Heavy, waterproof coat, insulated gloves, and boots to stay warm and dry.",
        "Hail": "Ice pellets falling from the sky during thunderstorms. Protect yourself with heavy, waterproof clothing.",
        "Fog": "Layered clothing to stay warm and visibility-enhancing accessories such as reflective gear.",
        "Mist": "Layered clothing to stay warm and visibility-enhancing accessories such as reflective gear.",
        "Smoke": "Protective mask or respirator, long-sleeved clothing to minimize skin exposure.",
        "Dust": "Coveralls or long-sleeved shirts and pants, protective eyewear, and a mask or respirator.",
        "Sandstorm": "Loose-fitting, long-sleeved clothing to protect from abrasion, goggles or sunglasses, and a face mask.",
        "Windy": "Windproof clothing, such as windbreakers or windproof jackets.",
        "Blustery": "Strong and gusty winds with possible stronger gusts. Secure clothing and accessories.",
        "Tornado": "Seek shelter immediately. Wear sturdy shoes and protective gear if available.",
        "Hurricane": "Seek shelter and follow evacuation orders if necessary. Waterproof clothing and sturdy shoes.",
        "Typhoon": "Seek shelter and follow evacuation orders if necessary. Waterproof clothing and sturdy shoes.",
        "Cyclone": "Seek shelter and follow evacuation orders if necessary. Waterproof clothing and sturdy shoes.",
        "Tropical Storm": "Intense tropical storm with strong winds and rain. Waterproof clothing is essential.",
        "Heat Wave": "Lightweight, loose-fitting clothing in light colors, hats, sunglasses, and sunscreen.",
        "Cold Wave": "Layered clothing, including thermal underwear, sweaters, and insulated jackets.",
        "Frost": "Insulated jacket or coat, gloves, hat, scarf, and layered clothing.",
        "Ice": "Insulated and waterproof clothing to stay warm and dry.",
        "Black Ice": "Exercise caution and wear footwear with good traction to avoid slipping.",
        "Haze": "Lightweight clothing and a mask or respirator to protect from particulate matter.",
        "Volcanic Ash": "Protective mask or respirator, long-sleeved clothing, and goggles to protect eyes from irritation.",
        "Pollen": "Cover your nose and mouth with a mask or respirator, long-sleeved clothing to minimize skin exposure.",
        "UV Index": "Long-sleeved shirts, wide-brimmed hat, sunglasses, and sunscreen to protect from UV radiation.",
        "Air Quality": "Avoid outdoor activities, or wear a mask or respirator to protect from pollutants."
    }
    for user in users:
        temperature, sky = weather_data(user.location)
        send_outlook_email(user.email,"Weather Update", "Weather condition for today is "+sky+" and temperature is "+temperature+" in "+user.location+"."+"\n"+"\n" +"Suggestions : "+weather_clothing_suggestions[sky])


# Main logic function    

def weather_report(request, location):
    logger.info("getting data of weather")
    data = start_selenium(location, flag=2) 
    logger.info("sending data to client")
    return JsonResponse(data, safe=False)    

@csrf_exempt
def update_location(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        user = User_db.objects.filter(email=email).first()
        location = location_lookup(latitude, longitude)
        city = location['address']['city']
        if city != user.location:
            user.location = city
            user.save()
            my_task(email)
        logger.info("location recieved successfull ('__')")
        return JsonResponse({'message': 'Location data received successfully'})
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    
def verify(request, email):
    user = get_object_or_404(User_db, email=email)
    if user.verified :
        pass
    else:
        user.verified = True
        user.save()
        logger.info("User is verified "+ email)
        return render(request, 'info.html',{'email': user.email})

def pwdreset(request, email=None):
    if email is not None:
        user = get_object_or_404(User_db, email=email)
        return render(request, 'resetpwd.html', {'user': user})
    elif request.method == 'POST':
        email = request.POST.get('email')
        pwd = request.POST.get('p1')
        user = User_db.objects.filter(email=email).first()
        if user is not None:
            user.pwd = hash_password(pwd)
            user.save()
            return redirect('login')
        else:
            return HttpResponse("User with the specified email does not exist")
    elif request.session.get('email'):
        user = get_object_or_404(User_db, email=request.session.get('email'))
        return render(request, 'resetpwd.html', {'user': user})
    return render(request, 'resetpwd.html', {'user': None})


def verify_email_send(request):
    if  request.method=='POST':
        email=request.POST.get('email')
        name=request.POST.get('name')
        pwd=request.POST.get('pwd1')
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        location = location_lookup(latitude, longitude)
        city = location['address']['city']
        user = User_db.objects.filter(email=email).first()
        if user:
            if not user.deleted:
                flag = True
                return render(request, 'create.html', {'flag':flag})
            else:
                user.delete()
        send_verification_mail(email)
        User_db.objects.create( name = name, email = email, pwd = hash_password(pwd), location = city)
        logger.info("Verification link sent to the User at "+email)
        return render(request, 'info.html',{'email': email, 'flag': 1})
    return render(request, 'create.html')

def show_user_db(request):
    users = User_db.objects.all()
    querys = Query_db.objects.all()
    return render(request, 'show_user_db.html', {'users': users, 'querys': querys})

def fpwd(request):
    if request.session.get('email') :
        return redirect('pwdreset')
    return render(request, 'fpwd-email.html')

def send_pwd_email(request):
    if  request.method=='POST':
        email = request.POST.get('email')
        user = User_db.objects.filter(email=email).first()
        if  user is not None:
            if not user.disabled:
                if user.verified:
                    send_outlook_email(email,"Password Reset Link", "Click on this link to change password  <p><a href = '"+generate_verification_link(email,"pwdreset")+"'>Password reset link</a></p>")
                    flag1 = True
                    return render(request, 'info.html', {'flag1':flag1, 'email': email})
                else:
                    flag2 = True
                    return render(request, 'fpwd-email.html', {'flag2':flag2})
            else:
                flag3 = True
                return render(request, 'fpwd-email.html', {'flag3':flag3})
        else:
            flag4 = True
            return render(request, 'fpwd-email.html', {'flag4':flag4})
        
def login(request):
    temp = request.session.get('email', None)
    if temp:
        return redirect('dashboard')
    if  request.method=='POST':
        email = request.POST.get('email')
        pwd = hash_password(request.POST.get('pwd'))
        latitude = request.POST.get('latitude')
        longitude = request.POST.get('longitude')
        location = location_lookup(latitude, longitude)
        city = location['address']['city']
        user = User_db.objects.filter(email=email).first()
        if user:
            if user.disabled:
                flag2 = True
                return render(request, 'login.html', {'flag2':flag2})
            else:
                if user.deleted:
                    flag4 = True
                    return render(request, 'login.html', {'flag4':flag4})
                else:
                    if user.verified:
                        if (user.pwd == pwd):
                            token = generate_token()
                            request.session['email'] = user.email
                            request.session['token'] = token
                            user.location = city
                            user.isActive = True
                            user.save()
                            response = redirect('dashboard')
                            response.set_cookie('token', token)
                            return response
                        else:
                            flag1 = True
                            return render(request, 'login.html', {'flag1':flag1})
                    else:
                        flag3 = True
                        return render(request, 'login.html', {'flag3':flag3})
        else:
            flag4= True
            return render(request, 'login.html', {'flag4':flag4})
    return render(request, 'login.html')

def logout(request):
    if not request.session.get('email') or request.session.get('token') != request.COOKIES.get('token'):
        logger.error("tokken not valid")
        response = HttpResponse("Session and cookies cleared successfully!")
        response.delete_cookie('token')
        request.session.clear()
        return redirect('login')
    temp = request.session.get('email', None)
    user = User_db.objects.filter(email=temp).first()
    if request.method == "POST":
        user.isActive = False
        user.save()
        request.session.clear()
        logger.info(user.email+"has logged out of the system")
        return  render(request, 'login.html')
    
def delete(request):
    if not request.session.get('email') or request.session.get('token') != request.COOKIES.get('token'):
        logger.error("tokken not valid")
        response = HttpResponse("Session and cookies cleared successfully!")
        response.delete_cookie('token')
        request.session.clear()
        return redirect('login')
    temp = request.session.get('email', None)
    user = User_db.objects.filter(email=temp).first()
    if request.method == "POST":
        request.session.clear()
        user.deleted = True
        user.verified = False
        user.service_provided = False
        user.isActive = False
        user.save()
        logger.info(user.email +"has deleted their account")
        return  render(request, 'login.html')
    return  render(request, 'login.html')
    
def edit(request):
    if not request.session.get('email') or request.session.get('token') != request.COOKIES.get('token'):
        logger.error("tokken not valid")
        response = HttpResponse("Session and cookies cleared successfully!")
        response.delete_cookie('token')
        request.session.clear()
        return redirect('login')
    temp = request.session.get('email', None)
    user = User_db.objects.filter(email=temp).first()
    if request.method == "POST":
        name = request.POST.get('name')
        service = request.POST.get('offon')
        user.name = name
        if service == 'on':
            user.service_provided = True
        else:
            user.service_provided = False
        user.save()
        return  redirect("dashboard")

def dashboard(request):
    if not request.session.get('email') or request.session.get('token') != request.COOKIES.get('token'):
        logger.error("tokken not valid")
        response = HttpResponse("Session and cookies cleared successfully!")
        response.delete_cookie('token')
        request.session.clear()
        return redirect('login')
    temp = request.session.get('email', None)
    user = User_db.objects.filter(email=temp).first()
    if request.method == "POST":
        logger.info(user.email+"has logged in")
    return render(request, 'dashboard.html', {'user':user})

def download(request):
    if not request.session.get('email') or request.session.get('token') != request.COOKIES.get('token'):
        logger.error("tokken not valid")
        response = HttpResponse("Session and cookies cleared successfully!")
        response.delete_cookie('token')
        request.session.clear()
        return redirect('login')
    temp = request.session.get('email', None)
    user = User_db.objects.filter(email=temp).first() 
    js_code = f"""const email = "{user.email}";"""
    with open("./Extension-copy/background.js", 'r') as additional_js_file:
        additional_js_code = additional_js_file.read()
    js_code = js_code + additional_js_code
    with open("./Extension-copy/Extension/background.js", 'w') as js_file:
        js_file.write(js_code)
    extension_folder_path = './Extension-copy'
    zip_file_path = './Extension-copy/Extension.zip'
    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(extension_folder_path):
            for file in files:
                file_path = os.path.join(root, file)
                zipf.write(file_path, os.path.relpath(file_path, extension_folder_path))
    if os.path.exists(zip_file_path):
        with open(zip_file_path, 'rb') as zip_file:
            response = HttpResponse(zip_file.read(), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="Extension.zip"'
        os.remove(zip_file_path)
        logger.info(user.email +"has downloaded chrome extension")
        return response
    else:
        return HttpResponse("The ZIP file does not exist.", status=404)
    
def query(request):
    if not request.session.get('email') or request.session.get('token') != request.COOKIES.get('token'):
        logger.error("tokken not valid")
        response = HttpResponse("Session and cookies cleared successfully!")
        response.delete_cookie('token')
        request.session.clear()
        return redirect('login')
    if request.method == "POST":
        problem = request.POST.get('problem')
        email = request.POST.get('email')
        date = request.POST.get('date')
        Query_db.objects.create( email = email, date = date, query = problem, status = 0)
        logger.info("Query saved by "+email)
        return JsonResponse({'status':'ok'})
    
def getAllQuery(request, email):
    data = Query_db.objects.filter(email=email).all()
    json_data = serialize('json', data)
    deserialized_data = json.loads(json_data)
    return JsonResponse(deserialized_data, safe=False)

def admin_dashboard(request, word = None):
    if word is None:
        return render(request, 'admin_dashboard.html')
    else:
        response_data = {'status': 'success'}
        if word == "home":
            total_users = User_db.objects.count()
            total_logged_in_users = User_db.objects.filter(isActive=True).count()
            total_disabled_users = User_db.objects.filter(disabled=True).count()
            total_users_taking_service = User_db.objects.filter(service_provided=True).count()
            location_with_most_users = (User_db.objects.values('location').annotate(total_users=Count('id')).order_by('-total_users').first())['location'].split(',')[0].strip()
            total_queries = Query_db.objects.count()
            total_unattended_queries = Query_db.objects.filter(status=0).count()
            total_queries_under_processing = Query_db.objects.filter(status=1).count()
            total_queries_solved = Query_db.objects.filter(status=2).count()
            context = {
                'total_users': total_users,
                'total_logged_in_users': total_logged_in_users,
                'total_disabled_users': total_disabled_users,
                'total_users_taking_service': total_users_taking_service,
                'location_with_most_users': location_with_most_users,
                'total_queries': total_queries,
                'total_unattended_queries': total_unattended_queries,
                'total_queries_under_processing': total_queries_under_processing,
                'total_queries_solved': total_queries_solved,
            }
            html_content = render(request, 'admin_home.html', context=context).content.decode('utf-8')
        elif word == "query":
            query_recieved = Query_db.objects.filter(status = 0).all()
            query_processing = Query_db.objects.filter(status = 1).all()
            query_solved = Query_db.objects.filter(status = 2).all()
            html_content = render(request, 'admin_query.html', {'query_recieved': query_recieved , 'query_processing': query_processing , 'query_solved': query_solved}).content.decode('utf-8')
        elif word == "user":
            user = User_db.objects.all()
            html_content = render(request, 'admin_user.html', {'users': user}).content.decode('utf-8')
        response_data['html_content'] = html_content
        return JsonResponse(response_data)
    
def search_user(request, word):
    users = User_db.objects.filter(name__icontains=word) | User_db.objects.filter(email__icontains=word)
    data = []
    for user in users:
        user_data = {
            'name': user.name,
            'email': user.email,
            'pwd': user.pwd,
            'location': user.location,
            'verified': user.verified,
            'service_provided': user.service_provided,
            'isActive': user.isActive,
            'deleted': user.deleted,
            'disabled': user.disabled,
        }
        data.append(user_data)
    return JsonResponse(data, safe=False)

def disableUser(request, email):
    user = User_db.objects.filter(email = email).first()
    user.disabled = not (user.disabled)
    user.save()
    return JsonResponse({"message": "User disabled successfully"})

def queryUpdate(request,queryid):
    query= Query_db.objects.filter(query_id = queryid).first()
    query.status += 1
    query.save()
    return JsonResponse({"message": "Query status updated"})