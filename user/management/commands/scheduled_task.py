# your_app/management/commands/scheduled_task.py
from django.core.management.base import BaseCommand
import schedule
import time
from user.views import my_task

class Command(BaseCommand):
    help = 'Run scheduled task'

    def handle(self, *args, **options):
        # Schedule the task to run every minute
        # schedule.every().day.at("07:12").do(my_task)
        schedule.every().minute.do(my_task)

        # Run the scheduler in a loop
        while True:
            schedule.run_pending()
            time.sleep(1)