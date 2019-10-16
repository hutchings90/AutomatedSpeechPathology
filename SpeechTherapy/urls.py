from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='index'),
	path('signUp', views.signUp, name='signUp'),
	path('signIn', views.signIn, name='signIn'),
	path('dashboard', views.dashboard, name='dashboard'),
	path('signOut', views.signOut, name='signOut'),
	path('updateUser', views.updateUser, name='updateUser'),
	path('getTextSamples', views.getTextSamples, name='getTextSamples'),
	path('newRecording', views.newRecording, name='newRecording'),
]