from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound, HttpResponseRedirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

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

def getUsersRecordingsData(user):
	recordings = []

	for recording in Recording.objects.filter(user_id=user.id).reverse()[:100:1]:
		recordings.append(recording.data())

	return recordings

def getTextSampleData(id=0):
	return TextSample.objects.filter(id__gt=id).values()[:10:1]

def index(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect('/SpeechTherapy/dashboard')

	return render(request, 'SpeechTherapy/index.html', {
		'data': json.dumps({
			'user': getUserData(User()),
			'activeTab': 'signIn',
			'signingIn': False,
			'signingUp': False
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

	return HttpResponseRedirect('/SpeechTherapy/dashboard')

def signIn(request):
	post = request.POST
	username = request.POST.get('username')
	password = request.POST.get('password')

	user = authenticate(username=username, password=password)

	if not user:
		return HttpResponseRedirect('/SpeechTherapy')

	login(request, user)

	return HttpResponseRedirect('/SpeechTherapy/dashboard')

def dashboard(request):
	if not request.user.is_authenticated:
		return HttpResponseRedirect('/SpeechTherapy')

	user = request.user

	return render(request, 'SpeechTherapy/index.html', {
		'data': json.dumps({
			'textSamples': getTextSampleData(),
			'user': getUserData(user),
			'recordings': getUsersRecordingsData(user),
			'activeTab': 'newRecording',
			'signingOut': False,
			'gettingTextSamples': False,
			'processingNewRecording': False
		})
	})

def getTextSamples(request):
	return HttpResponse(json.dumps({
		'textSamples': []
	}));

def signOut(request):
	logout(request)

	return HttpResponseRedirect('/SpeechTherapy')

def updateUser(request):
	if not request.user.is_authenticated:
		return HttpResponseNotFound('User not found.')

	user = request.user if request.user.is_authenticated else User()
	body = json.loads(request.body)
	attr = body['attr']
	value = body['value']

	if attr == 'password':
		user.set_password(value)
	else:
		setattr(user, attr, value)

	user.save()

	return HttpResponse(json.dumps(getUserData(user)))

def newRecording(request):
	body = json.loads(request.body)

	recording = Recording()
	recording.date_recorded = datetime.now()
	recording.user = request.user
	recording.text_sample = TextSample.objects.get(pk=body['text_sample_id'])
	recording.score = 0
	recording.save()

	return HttpResponse(json.dumps({
		'recording': recording.data()
	}))