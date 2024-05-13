from django.db import models

# Create your models here.
class User_db(models.Model):
    name = models.CharField(max_length=20)
    email = models.EmailField()
    pwd = models.CharField(max_length=10)
    location = models.TextField()
    verified = models.BooleanField(default=False)
    service_provided = models.BooleanField(default=True)
    isActive = models.BooleanField(default=False)
    deleted = models.BooleanField(default=False)
    disabled = models.BooleanField(default=False)

    def __str__(self):
        return self.name, self.email
    
class Query_db(models.Model):
    query_id = models.IntegerField(primary_key=True, auto_created=True)
    email = models.EmailField()
    date = models.DateTimeField()
    query = models.TextField()
    status = models.IntegerField()

    def __str__(self):
        return self.email
