from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect, HttpResponseForbidden
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware import csrf
from django.core.mail import send_mail

from datetime import datetime
import json, zipfile, io

from .models import *

def getUserData(user):
	if not user:
		user = User()

	return {
		'id': user.id,
		'username': user.username,
		'password': '',
		'email': user.email,
		'is_superuser': user.is_superuser
	}

def getUsersRecordingsData(user, page=1, recordsPerPage=10):
	recordings = []

	if Recording.objects.filter(user_id=user.id).count():
		start = (page - 1) * recordsPerPage
		end = page * recordsPerPage

		for recording in Recording.objects.order_by('-date_recorded').filter(user_id=user.id)[start:end:1]:
			recordings.append(recording.data())

	return recordings

def getTextSampleData(id=0, limit=10):
	textSamples = TextSample.objects.filter(id__gt=id).values()[:limit:1]
	underflow = limit - len(textSamples)
	if underflow > 0:
		textSamples += TextSample.objects.filter(id__lte=id).values()[:underflow:1]
	return textSamples

def getRecordingCount(user):
	return Recording.objects.filter(user_id=user.id).count()

def index(request):
	signedIn = request.user.is_authenticated

	if not signedIn:
		user = User()
		textSamples = []
		activeTab = 'signIn'
	else:
		user = request.user
		textSamples = getTextSampleData()
		activeTab = 'newRecording'

	return render(request, 'SpeechTherapy/index.html', {
		'data': json.dumps({
			'user': getUserData(user),
			'recordings': getUsersRecordingsData(user),
			'recordingCount': getRecordingCount(user),
			'textSamples': textSamples,
			'activeTab': activeTab,
			'signingIn': False,
			'signingUp': False,
			'signingOut': False,
			'updatingProfile': False,
			'gettingTextSamples': False,
			'gettingRecordings': False,
			'interpretingRecording': False,
			'uploadingNewRecording': False,
			'recordedSinceGetRecordings': False,
			'recording': None,
			'importingTextSamples': False,
			'interpretation': '',
			'score': -1,
			'reports': [],
			'sendingSignInHelpEmail': False
		}),
		'csrfToken': csrf.get_token(request)
	})

def signUp(request):
	errors = []
	post = request.POST

	username = post.get('username')
	email = post.get('email')
	password = post.get('password')

	if not username:
		errors.append('Username required.')

	if not password:
		errors.append('Password required.')

	if not email:
		errors.append('Email required.')

	if len(errors) > 0:
		return HttpResponse(json.dumps({
			'errors': errors
		}))

	user = User.objects.create_user(username, email=email, password=password)
	user.save()

	login(request, user)

	return HttpResponse(json.dumps({
		'user': getUserData(user),
		'recordings': getUsersRecordingsData(user),
		'recordingCount': getRecordingCount(user),
		'textSamples': getTextSampleData(),
		'csrfToken': csrf.get_token(request)
	}))

def signIn(request):
	post = request.POST

	username = post.get('username')
	password = post.get('password')

	user = authenticate(username=username, password=password)

	if not user:
		return HttpResponseNotFound('Invalid username/password combination.')

	login(request, user)

	return HttpResponse(json.dumps({
		'user': getUserData(user),
		'recordings': getUsersRecordingsData(user),
		'recordingCount': getRecordingCount(user),
		'textSamples': getTextSampleData(),
		'csrfToken': csrf.get_token(request)
	}))

def sendSignInHelpEmail(request):
	send_mail('Automated Speech Therapy Sign In Help'
		'Here is the message',
		'jdanhutch@gmail.com',
		[ request.user.email ],
		fail_silently=False
	),

def getTextSamples(request):
	return HttpResponse(json.dumps({
		'textSamples': getTextSampleData(request.POST.get('id'))
	}))

def signOut(request):
	logout(request)

	return HttpResponse(json.dumps({
		'user': getUserData(User()),
		'csrfToken': csrf.get_token(request)
	}))

def updateUser(request):
	if not request.user.is_authenticated:
		return HttpResponseNotFound('Please log in to update profile.')

	user = request.user
	post = request.POST

	attr = post.get('attr')
	value = post.get('value')

	if attr == 'password':
		user.set_password(value)
	else:
		setattr(user, attr, value)

	user.save()

	if attr == 'password':
		login(request, authenticate(username=user.username, password=value))

	return HttpResponse(json.dumps({
		'csrfToken': csrf.get_token(request)
	}))

def getRecordings(request):
	post = request.POST

	page = int(post.get('page'))
	recordsPerPage = int(post.get('recordsPerPage'))

	return HttpResponse(json.dumps({
		'recordings': getUsersRecordingsData(request.user, page, recordsPerPage)
	}))

def newRecording(request):
	user = request.user
	post = request.POST
	files = request.FILES

	text_sample_id = post.get('text_sample_id')
	audio = files.get('audio')
	interpretation = post.get('interpretation')

	recording = Recording()
	recording.date_recorded = datetime.now()
	recording.user = user
	recording.audio = audio
	recording.text_sample = TextSample.objects.get(pk=text_sample_id)
	recording.interpretation = interpretation
	recording.assignScore()
	recording.save()

	return HttpResponse(json.dumps({
		'recording': recording.data(),
		'recordingCount': getRecordingCount(user)
	}))

def importTextSamples(request):
	if not request.user.is_superuser:
		return HttpResponseForbidden()

	startCount = len(TextSample.objects.all())
	zipFile = zipfile.ZipFile(request.FILES.get('textSamples'), 'r')

	for name in zipFile.namelist():
		if not zipFile.getinfo(name).is_dir():
			file = zipFile.open(name, 'r')

			textSample = TextSample()
			textSample.name = name.rpartition('.')[0]
			textSample.text = io.TextIOWrapper(file).read()
			textSample.save()

			file.close()

	zipFile.close()

	endCount = len(TextSample.objects.all())
	numCreated = endCount - startCount

	return HttpResponse(json.dumps({
		'numCreated': numCreated
	}))