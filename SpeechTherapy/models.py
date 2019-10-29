from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from calendar import month_abbr
import re

class TextSample(models.Model):
	expected_time = models.IntegerField(null=False, blank=False)
	name = models.TextField(null=False, blank=False, unique=True)
	text = models.TextField(null=False, blank=False, unique=True)


class Recording(models.Model):
	user = models.ForeignKey(User, on_delete=models.PROTECT)
	date_recorded = models.DateTimeField()
	text_sample = models.ForeignKey(TextSample, on_delete=models.PROTECT)
	audio = models.FileField(upload_to='audio/%Y/%m/%d/')
	interpretation = models.TextField()
	score = models.DecimalField(max_digits=3, decimal_places=2)

	def data(self):
		return {
			'date_recorded': int(self.date_recorded.timestamp() * 1000),
			'text': self.text_sample.text,
			'name': self.text_sample.name,
			'audioSrc': self.audio.url,
			'interpretation': self.interpretation,
			'score': float(self.score)
		}