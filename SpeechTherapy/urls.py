from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('signUp', views.signUp, name='signUp'),
	path('signIn', views.signIn, name='signIn'),
	path('sendSignInHelpEmail', views.sendSignInHelpEmail, name='sendSignInHelpEmail'),
	path('signOut', views.signOut, name='signOut'),
	path('updateUser', views.updateUser, name='updateUser'),
	path('getTextSamples', views.getTextSamples, name='getTextSamples'),
	path('getRecordings', views.getRecordings, name='getRecordings'),
	path('newRecording', views.newRecording, name='newRecording'),
	path('importTextSamples', views.importTextSamples, name='importTextSamples'),
	path('searchTextSamples', views.searchTextSamples, name='searchTextSamples'),
	path('demoSpeechAnalyzer', views.demoSpeechAnalyzer, name='demoSpeechAnalyzer'),
]