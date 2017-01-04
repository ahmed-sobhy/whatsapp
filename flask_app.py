from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
import re
import datetime
from collections import Counter
# encoding=utf8
app = Flask(__name__)


def process_file(chat):
	class user():
		def __init__(self):
			self.data = ""
			self.dates = []
			self.messages_no = 0
	
	all_data = ""
	lines = chat.readlines()
	users = {} #users dict

	names = []
	messages_no = []

	hours = [0]*24

	messages_per_date = [0]*1000
	date_years = [0]
	date_month = [0]
	common_words = []
	common_words_count = []

	for line in lines:
		if(line=="\n"):
			continue
		#reg operations
		name_re = re.search("M:\s([\w\s]+):",line)
		data_re = re.search("[AP]M:\s.+?:(.+)",line)
		date_re = re.search("(.+?),",line)
		hour_re = re.search(",\s(\d+)",line)
		dn_re = re.search("[AP]M?",line)

		#get name
		if(name_re):
			name = name_re.group(1)
		#get message 
		if(data_re):
			data = data_re.group(1)[1:]
		else:
			data = line

		#get date
		if(date_re):
			date = date_re.group(1)
			date2_re = re.search(r"(\d\d?)/(\d\d?)/(\d\d?)",date)
			if(date2_re):
				month = int(date2_re.group(1))
				day = int(date2_re.group(2))
				year = int(date2_re.group(3))
		#get time
		if(hour_re):
			hour = int(hour_re.group(1))
			if(hour==12 and dn_re.group()=='AM'):
				hour=0
			if(dn_re.group()=='PM' and hour!=12):
				hour += 12
		hours[hour] = hours[hour] + 1

		
		d = datetime.date(year,month,1) 

		if(year != date_years[len(date_years)-1] or month != date_month[len(date_years)-1]):
			date_years.append(year)
			date_month.append(month)
		messages_per_date[len(date_years)-1] += 1

		
		# Assigneing data to user instance
		if(name in users.keys()):
			users[name].data  = " ".join((users[name].data, data))
			users[name].dates.append(d)
		else:
			users[name] = user()
			users[name].data = " ".join((users[name].data, data))
			users[name].dates.append(d)

	#gather all data and messages number per user
	for user in users:
		users[user].data = users[user].data.replace("\n"," ")
		all_data += users[user].data
		users[user].messages_no = len(users[user].dates)


	
	messages_per_date = messages_per_date[1:len(date_years)-1]
	date_years = date_years[1:]
	date_month = date_month[1:]

	
	

	for user in users:
		names.append(user)
		messages_no.append(users[user].messages_no)
		all_data += " " + users[user].data.replace('\n',' ')

	
	c = Counter(all_data.lower().split()).most_common()
	for i in range(100):
		tmp = c[i][0]
		tmp2 = c[i][1]
		if(len(tmp)>3):
			if(tmp[0]!='<'):
				if(tmp[:3]!="omi"):
					common_words.append(tmp)
					common_words_count.append(tmp2)
		if(len(common_words)==20):
			break


	pd={
    'names': names,
    'messages_no': messages_no,
    'hours': hours,
    'date_month' : date_month,
    'date_years' : date_years,
    'messages_per_date' : messages_per_date,
    'common_words' : common_words,
    'common_words_count' : common_words_count
    }
	return pd


@app.route('/')
def hello_world():
    return render_template('home.html')

@app.route('/upload', methods=['GET', 'POST'])
def upload():
	if request.method == 'POST':
		f = request.files['file']
		python_data = process_file(f)
	
	return render_template('stats.html',python_data=python_data)

if __name__ == '__main__':
    app.run(debug=True)