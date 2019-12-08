from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

from calendar import month_abbr
import re

class TextSample(models.Model):
	name = models.TextField(null=False, blank=False, unique=True)
	text = models.TextField(null=False, blank=False, unique=True)


class Recording(models.Model):
	user = models.ForeignKey(User, on_delete=models.PROTECT)
	date_recorded = models.BigIntegerField()
	text_sample = models.ForeignKey(TextSample, on_delete=models.PROTECT)
	audio = models.FileField(upload_to='audio/%Y/%m/%d/')
	interpretation = models.TextField()
	score = models.IntegerField()

	def data(self):
		return {
			'date_recorded': self.date_recorded * 1000,
			'text': self.text_sample.text,
			'name': self.text_sample.name,
			'audioSrc': self.audio.url,
			'interpretation': self.interpretation,
			'score': self.score
		}

	def assignScore(self):
		expectedSet = set(re.sub('[^\w]', ' ', self.text_sample.text).strip().split())
		actualSet = set(re.sub('[^\w]', ' ', self.interpretation).strip().split())
		diff = len(list(expectedSet - actualSet))
		self.score = int((1 - (diff / len(expectedSet))) * 100)