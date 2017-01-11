import re
import datetime
from collections import Counter
from operator import itemgetter
from os import path


FIRSTLINE = 0
SECONDLINE = 1
CHANGEDSUBJECT = 2
CREATEDGROUP = 3
ADDEDMEMBER = 4

class User(object):
	"""Information about each user in the chat"""
	def __init__(self, name):
		self.name = name
		self.messagesCount = 0
		self.convInitCount = 0


class Chat(object):
	"""docstring for Chat"""
	def __init__(self, text):
		self.text = text
		self.users = {}
		self.hourlyActivity = [0] * 24

		self.createUsers()
		self.updateMessagesCount()
		self.updateHourlyActivity()
		self.updateConvInitCount()
		self.mostFrequentWords()

	def createUsers(self):
		for line in self.text:
			if self.messageClassifier(line) == FIRSTLINE:
				name = self.getName(line)
				self.users[name] = User(name)

	def updateMessagesCount(self):
		for line in self.text:
			if self.messageClassifier(line) == FIRSTLINE:
				name = self.getName(line)
				self.users[name].messagesCount += 1
			elif self.messageClassifier(line) == SECONDLINE:
				self.users[name].messagesCount += 1

	def updateHourlyActivity(self):
		for line in self.text:
			if self.messageClassifier(line) == FIRSTLINE:
				hour = self.getHour(line)
				self.hourlyActivity[hour] += 1

	def updateConvInitCount(self):
		firstLine = True
		oldHour = 0
		newHour = 0
		for line in self.text:
			if self.messageClassifier(line) == FIRSTLINE:
				newHour = self.getHour(line)
				if(newHour - oldHour >= 12):
					name = self.getName(line)
					self.users[name].convInitCount += 1
			oldHour = newHour


	def mostFrequentWords(self):
		messages = []
		for line in self.text:
			match = re.search('omitted',line)
			if match:
				pass
			else:
				if self.messageClassifier(line) == FIRSTLINE:
					message = self.getMessage(line)
					messages.append(message)
				elif self.messageClassifier(line) == SECONDLINE:
					messages.append(line)

		text = " ".join(messages)
		words = re.findall(r'\w\w\w+', text)
		cap_words = [word.lower() for word in words]
		self.word_counts = Counter(cap_words).most_common(20)


	def getName(self,line):
		match = re.search(r'(AM|PM): (.*?):',line)
		if match:
			if match.group(2):
				return match.group(2)
			else:
				return None

	def getMessage(self,line):
		match = re.search(r'(AM|PM):.*?: (.*)',line)
		if match:
			if match.group(2):
				return match.group(2)

	def getHour(self,line):
		match = re.search(r'(AM|PM)',line)
		timeSplit = match.group(0)
		match = re.search(r' (.+?):',line)

		hour = int(match.group(1))
		if hour == 12:
			hour = 0
		if(timeSplit == "PM"):
			hour += 12
		return hour


	def messageClassifier(self, line):
		match1 = re.search(r'changed the subject', line)
		match2 = re.search(r'created this group', line)
		match3 = re.search(r'added', line)

		if match1:
			return CHANGEDSUBJECT
		elif match2:
			return CREATEDGROUP
		elif match3:
			return ADDEDMEMBER
		elif self.getName(line) != None:
			return FIRSTLINE
		else:
			return SECONDLINE

	def getPythonData(self):
		messagesCount = []
		namesMessagesCount = []

		convInitCount = []
		namesConvInitCount = []

		date_month = []
		date_years = []
		messages_per_date = []

		commonWords = []
		commonWordsCount = []

		for name in sorted(self.users, key = lambda name: self.users[name].messagesCount, reverse = True):
			messagesCount.append(self.users[name].messagesCount)
			namesMessagesCount.append(name)

		for name in sorted(self.users, key = lambda name: self.users[name].convInitCount, reverse = True):
			convInitCount.append(self.users[name].convInitCount)
			namesConvInitCount.append(name)

		for word in self.word_counts:
			commonWords.append(word[0])
			commonWordsCount.append(word[1])

		pd={
		'namesMessagesCount': namesMessagesCount,
		'messagesCount': messagesCount,
		'namesConvInitCount': namesConvInitCount,
		'convInitCount': convInitCount,
		'messagesCountPerHour': self.hourlyActivity,

		'date_month' : date_month,
		'date_years' : date_years,
		'messages_per_date' : messages_per_date,

		'common_words' : commonWords,
		'common_words_count' : commonWordsCount
		}
		return pd