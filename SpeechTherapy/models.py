from django.db import models
from django.contrib.auth.models import User


class File(models.Model):
	filename = models.FileField('uploads/%Y/%m/%d/')

	def data(self):
		return {
			'filename': self.filename
		}


class TextSample(models.Model):
	file = models.OneToOneField(File, on_delete=models.CASCADE)

	def data(self):
		with self.file.saved_file.open(mode='r') as file:
			text = file.readLines

		return {
			'id': self.id,
			'text': text
		}


class Recording(models.Model):
	user = models.ForeignKey(User, on_delete=models.PROTECT)
	date_recorded = models.DateTimeField('Date recorded.', auto_now_add=True)
	text_sample = models.ForeignKey(TextSample, on_delete=models.PROTECT)
	audio = models.OneToOneField(File, on_delete=models.PROTECT, related_name='audio')
	interpretation = models.OneToOneField(File, null=True, on_delete=models.PROTECT, related_name='interpretation')
	score = models.DecimalField(max_digits=3, decimal_places=2, null=True)

	def data(self):
		return {
			'date_recorded': self.date_recorded,
			'text_sample': self.text_sample,
			'audio': self.audio,
			'interpretation': self.interpretation,
			'score': self.score
		}