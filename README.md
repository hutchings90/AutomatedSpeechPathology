# AutomatedSpeechPathology

## A UI for Speech Recognition intended for use in Speech Pathology

**Note:** This repository was created for a Computer Science Master's project at Brigham Young University - Provo, requested by Dr. Quinn Snell. The future use and development of this project will be directed by Dr. Snell.

### Setup
This project was built in a Windows environment. As such, restart.bat in the project root has been provided for easy setup on a Windows machine. You will be prompted to add an admin username and password. Setting up in other environments, such as Mac and Linux, should be similar to what is found in the restart.bat file.

### Django Framework
This project was built with the Django v2.2.5 Python web framework. It was tested in development mode, so testing will need to be done in production mode to ensure correct functionality.
#### Production change notes
- **Front-end loading of static files**
- **Setting up email** - Hooks were put in to send password reset emails to users, but email was not fully tested. See comments in AutomatedSpeechPathology/settings.py about implementing email.

### JavaScript Framework
This project uses the Vue.js framework.
#### Important classes
- NewRecordingInterpreter
 - SpeechTherapy/static/SpeechTherapy/js/SpeechAnalyer/NewRecordingInterpreter.js
 - A proxy class
 - The Vue app creates an instance of NewRecordingInterpreter and submits user audio to it
 - Submits user audio to a list of instances of classes derived from the SpeechAnalyzer base class
- SpeechAnalyzer
 - SpeechTherapy/static/SpeechTherapy/js/SpeechAnalyzer/SpeechAnalyzer.js
 - Submits user audio to a speech-to-text process. Pass success, error, and completion handlers to the constructor for the results to be processed.
- XHR
 - SpeechTherapy/static/SpeechTherapy/js/XHR/XHR.js
 - Extended by all other class in the same directory
 - Expected to be used by SpeechAnalyzers
 - Built to avoid including the entirety of jQuery just for one simple feature (ajax)
- SpeechTherapyRequester
 - SpeechTherapy/static/SpeechTherapy/js/XHR/SpeechTherapyRequester.js
 - Wrapper class derived from XHR class
 - Handles Cross-site Request Forgery (CSRF) tokens used by this project's Django server
#### Production change notes
- **Demo speech analyzer activation/deactivation** - The two demo speech analyzer classes are DemoFrontEndSpeechAnalyzer and DemoXHRSpeechAnalyzer. These are located in SpeechTherapy/static/SpeechTherapy/js/SpeechAnalyzer/DemoSpeechAnalyzer.js. They are used in the NewRecordingInterpreter class in NewRecordingInterpreter.js of the same folder as the demo speech analyzers. Simply change the values of the demoXHRSpeechAnalyzerCount and demoFrontEndSpeechAnalyzerCount class fields in the constructor as needed.
