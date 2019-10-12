from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from django.contrib.auth.models import User
import json

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
	return []
	recordings = user.recordings
	for i in range(len(recordings)):
		recording = recordings[i]
		recordings.append(recording.data())

	return recordings

def index(request):
	user = request.user if request.user.is_authenticated else User()

	return render(request, 'SpeechTherapy/index.html', {
		'data': json.dumps({
			'user': getUserData(user),
			'resultsHistory': getUsersRecordingsData(user),
			'activeTab': 'newRecording' if user.id else 'signIn',
			'signingIn': False,
			'signingUp': False,
			'signingOut': False,
			'processingNewRecording': False,
			'errors': []
		})
	})

def signUp(request):
	# post = request.POST
	# User.objects.create_user(username=post['username'], password=post['password'])
	body = json.loads(request.body)

	user = User.objects.create_user(body['username'], email=body['email'], password=body['password'])
	user.save()

	return HttpResponse(json.dumps({
		'user': getUserData(user),
		'body': body
	}))

def signIn(request):
	body = json.loads(request.body)

	user = authenticate(username=body['username'], password=body['password'])
	if user is None:
		return HttpResponseNotFound('Sign in failed.')

	return HttpResponse(json.dumps({
		'user': getUserData(user),
		'resultsHistory': getUsersRecordingsData(user)
	}))

def signOut(request):
	logout(request)

	return HttpResponse(json.dumps({
		'user': getUserData(User())
	}))

def updateUser(request):
	user = request.user if request.user.is_authenticated else User()
	body = json.loads(request.body)

	if not user.id:
		return HttpResponseNotFound('User not found.')
	return HttpResponse(json.dumps(getUserData(user)))
	user[body['attr']] = body['value']

	return HttpResponse(json.dumps(getUserData(user)))

def newRecording(request):
	body = json.loads(request.body)

	# TODO: Implement new recording

	return HttpResponse(json.dumps({
		'audio': body['audio']
	}))
