from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from calendar import month_abbr
import re

def defaultDateTime():
	return re.sub(' 0+', ' ', timezone.now().strftime('%b %d, %Y %H:%M:%S'))


class TextSample(models.Model):
	text = models.TextField()


class Recording(models.Model):
	user = models.ForeignKey(User, on_delete=models.PROTECT)
	date_recorded = models.DateTimeField()
	text_sample = models.ForeignKey(TextSample, on_delete=models.PROTECT)
	audio = models.FileField(upload_to='audio/%Y/%m/%d/')
	interpretation = models.TextField()
	score = models.DecimalField(max_digits=3, decimal_places=2)
	name = models.CharField(max_length=32, default=defaultDateTime)

	def data(self):
		return {
			'date_recorded': int(self.date_recorded.timestamp()),
			'text_sample': self.text_sample.text,
			# 'audio': self.audio,
			'interpretation': self.interpretation,
			'score': float(self.score),
			'name': self.name
		}