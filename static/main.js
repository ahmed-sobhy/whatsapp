
all_js = function(d)
{
	google.load('visualization', '1.0', {'packages':['corechart']});
	google.setOnLoadCallback(draw_messagesCount);
	//google.setOnLoadCallback(draw_conversationInit);
	google.setOnLoadCallback(draw_over_day);
	google.setOnLoadCallback(draw_over_time);
	google.setOnLoadCallback(draw_common_words);
	google.setOnLoadCallback(updateMedals);

	document.getElementById("fbbutton").href= window.location.href; 

	
	function updateMedals()
	{
		appendText("mostActive", d.mostActive);
		appendText("mostEmoji", d.mostEmoji);
		appendText("mostPhotos", d.mostPhotos);
		appendText("mostAsker", d.mostAsker);
		appendText("mostInitiator", d.mostInitiator);
	}

	function appendText(id,text)
	{
		console.log(id);
		var theDiv = document.getElementById(id);
		var content = document.createTextNode(text);
		theDiv.appendChild(content);
	}


	function draw_messagesCount() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Names');
		data.addColumn('number', 'Messages');
		
		names = d.namesMessagesCount;
		messagesCount = d.messagesCount;

		for(var i=0;i<names.length;i++)
		{
			data.addRow([names[i],messagesCount[i]]);
		}
	
		// Set chart options
		w = document.getElementById('messagesCount').style.width;
		w = window.innerWidth * (6/12);
		h = w;
		var options = {'title':'Messages Count by Members','width':w,'height':h, 'backgroundColor': 'transparent','is3D':true,legend: { position: 'none' },
						hAxis: {title: 'Messages Number'}};
		var chart = new google.visualization.BarChart(document.getElementById('messagesCount'));
		chart.draw(data, options);
	}

	function draw_conversationInit() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Names');
		data.addColumn('number', 'Messages');

		names = d.namesConvInitCount;
		messagesCount = d.convInitCount;

		for(var i=0;i<names.length;i++)
		{
			if(messagesCount[i] > 0)
				data.addRow([names[i],messagesCount[i]]);
		}
	
		// Set chart options
		w = document.getElementById('conversationInit').style.width;
		w = window.innerWidth * (6/12);
		h = w;
		var options = {'title':'Conversation Initiation Percentage','width':w,'height':h, 'backgroundColor': 'transparent','is3D':true,legend: { position: 'none' },
						hAxis: {title: 'Messages Number', showTextEvery:1}
					};
		var chart = new google.visualization.PieChart(document.getElementById('conversationInit'));
		chart.draw(data, options);
	}

	
	function draw_over_day() {
		var data = new google.visualization.DataTable();
		data.addColumn('number', 'Hours');
		data.addColumn('number', 'Messages');

		messages_no_per_hour = d.messagesCountPerHour;
		for(var i=0;i<messages_no_per_hour.length;i++)
		{
			data.addRow([i,messages_no_per_hour[i]]);
		}
	
		// Set chart options
		w = document.getElementById('over_day').style.width;
		w = window.innerWidth * (6/12);
		h = w;
		var options = {'title':'Chat Messages Count Over a Day',
						'width':w,'height':h, 
						'backgroundColor': 'transparent',
						legend: { position: 'none' },
						hAxis: {title: 'Hours',showTextEvery: 1},
						vAxis: {title: 'Messages Number'},
					   };
		var chart = new google.visualization.LineChart(document.getElementById('over_day'));
		chart.draw(data, options);
	}

	function draw_over_time() {
		var data = new google.visualization.DataTable();
		data.addColumn('date', 'Date');
		data.addColumn('number', 'Messages');

		messagesCountPerMonth = d.messagesCountPerMonth;
		beginYear = d.beginYear
		beginMonth = d.beginMonth	
		prevMonth = d.beginMonth
		year = beginYear
		month = beginMonth

		console.log(beginMonth);

		for(var i=0;i<messagesCountPerMonth.length;i++)
		{
			data.addRow([new Date(2000 + year, month - 1), messagesCountPerMonth[i]])
			month = (month + 1) % 13;
			if(month == 0)
			{
				month = 1;
				year++;
			}
		}
		
		// Set chart options
		w = document.getElementById('over_time').style.width;
		w = window.innerWidth * (6/12);
		h = w;
		var options = {'title':'Chat Messages Count Timeline',
						'width':w,'height':h, 
						'backgroundColor': 'transparent',
						legend: { position: 'none' },
						hAxis: {title: 'Date'},
						vAxis: {title: 'Messages Number'}
					   };
		var chart = new google.visualization.LineChart(document.getElementById('over_time'));
		chart.draw(data, options);

	}

	function draw_common_words() {
		var data = new google.visualization.DataTable();
		data.addColumn('string', 'Words');
		data.addColumn('number', 'Number');

		word = d.common_words;
		number = d.common_words_count;

		for(var i=0;i<word.length;i++)
		{
			data.addRow([word[i],number[i]]);
		}
	
		// Set chart options
		w = document.getElementById('common_words').style.width;
		w = window.innerWidth * (6/12);
		h = w;
		var options = {'title':'Most Common Words with minimum 4 letters','width':w,'height':h, 'backgroundColor': 'transparent','is3D':true,legend: { position: 'none' },
						hAxis: {title: 'Words'},vAxis: {title: 'Count'}};
		var chart = new google.visualization.BarChart(document.getElementById('common_words'));
		chart.draw(data, options);
	}
	
}

