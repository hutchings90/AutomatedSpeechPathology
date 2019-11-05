from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware import csrf

from datetime import datetime
import json

from .models import *

def getUserData(user):
	if not user:
		user = User()

	return {
		'id': user.id,
		'username': user.username,
		'password': '',
		'email': user.email
	}

def getUsersRecordingsData(user, page=1, recordsPerPage=10):
	recordings = []

	if Recording.objects.filter(user_id=user.id).count():
		start = (page - 1) * recordsPerPage
		end = page * recordsPerPage

		for recording in Recording.objects.order_by('-date_recorded').filter(user_id=user.id)[start:end:1]:
			recordings.append(recording.data())

	return recordings

def getTextSampleData(id=0):
	return TextSample.objects.filter(id__gt=id).values()[:10:1]

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
			'gettingTextSamples': False,
			'gettingRecordings': False,
			'processingNewRecording': False,
			'recordedSinceGetRecordings': False,
			'recording': None,
			'importingTextSamples': False,
			'csrfToken': csrf.get_token(request)
		})
	})

def signUp(request):
	post = request.POST

	username = post.get('username')
	email = post.get('email')
	password = post.get('password')

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
		return HttpResponseNotFound('user not found')

	login(request, user)

	return HttpResponse(json.dumps({
		'user': getUserData(user),
		'recordings': getUsersRecordingsData(user),
		'recordingCount': getRecordingCount(user),
		'textSamples': getTextSampleData(),
		'csrfToken': csrf.get_token(request)
	}))

def getTextSamples(request):
	return HttpResponse(json.dumps({
		'textSamples': getTextSampleData()
	}));

def signOut(request):
	logout(request)

	return HttpResponse(json.dumps({
		'user': getUserData(User()),
		'csrfToken': csrf.get_token(request)
	}))

def updateUser(request):
	if not request.user.is_authenticated:
		return HttpResponseNotFound(json.dumps({
			'message': 'User not found.',
			'user': request.user.id
		}))

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

	recording = Recording()
	recording.date_recorded = datetime.now()
	recording.user = user
	recording.audio = audio
	recording.text_sample = TextSample.objects.get(pk=text_sample_id)
	recording.interpretation = recording.text_sample.text
	recording.score = 0
	recording.save()

	return HttpResponse(json.dumps({
		'recording': recording.data(),
		'recordingCount': getRecordingCount(user)
	}))

def importTextSamples(request):
	if not request.user.is_superuser:
		return HttpResponse()

	post = request.POST
	directoryName = post.get('directoryName')
	return HttpResponse(directoryName);