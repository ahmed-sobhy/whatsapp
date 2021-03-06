from flask import Flask
from flask import render_template
from flask import request
from flask import url_for
from flask import redirect
from os import path
import sqlite3 as lite
import cPickle
import uuid

import chatprocessor

ROOT = path.dirname(path.realpath(__file__))

app = Flask(__name__)


@app.route('/')
def hello_world():
    global db
    db = lite.connect(path.join(ROOT,"whatsapp.db"), check_same_thread=False)
    db.execute('''CREATE TABLE IF NOT EXISTS USERS (idtext text,data Blob)''')
    return render_template('home.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload():
	if request.method == 'POST':
	    db = lite.connect(path.join(ROOT,"whatsapp.db"), check_same_thread=False)
	    fileData = request.files['file']
	    text = fileData.readlines()
	    chat = chatprocessor.Chat(text)
	    python_data = chat.getPythonData()
	    pdata = cPickle.dumps(python_data, cPickle.HIGHEST_PROTOCOL)
	    idtext = str(uuid.uuid1())
	    cursor = db.cursor()
	    cursor.execute('''INSERT into USERS (idtext, data) VALUES(?,?)''', (idtext,lite.Binary(pdata)))
	    db.commit()
	    url = "http://www.whatsalytics.com/report?id=" + idtext
	return redirect(url)


@app.route('/report')
def data():
    db = lite.connect(path.join(ROOT,"whatsapp.db"), check_same_thread=False)
    # here we want to get the value of user (i.e. ?user=some-value)
    idx = request.args.get('id')
    cur = db.cursor()
    cur.execute("SELECT * FROM USERS WHERE idtext = ?", (idx,))
    rows = cur.fetchall()
    for row in rows:
    	data = cPickle.loads(str(row[1]))
    return render_template('stats.html',python_data=data)

if __name__ == '__main__':
    db = lite.connect(path.join(ROOT,"whatsapp.db"), check_same_thread=False)
    db.execute('''CREATE TABLE IF NOT EXISTS USERS (idtext text,data Blob)''')
    app.run(debug=True)