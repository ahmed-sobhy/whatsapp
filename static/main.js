
all_js = function(d)
{
	google.load('visualization', '1.0', {'packages':['corechart']});
	google.setOnLoadCallback(draw_messagesCount);
	google.setOnLoadCallback(draw_conversationInit);
	google.setOnLoadCallback(draw_over_day);
	//google.setOnLoadCallback(draw_over_time);
	google.setOnLoadCallback(draw_common_words);


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
		var options = {'title':'Members Chat Messages Count','width':w,'height':h, 'backgroundColor': 'transparent','is3D':true,legend: { position: 'none' },
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
			data.addRow([names[i],messagesCount[i]]);
		}
	
		// Set chart options
		w = document.getElementById('conversationInit').style.width;
		w = window.innerWidth * (6/12);
		h = w;
		var options = {'title':'Number of conversation initialization','width':w,'height':h, 'backgroundColor': 'transparent','is3D':true,legend: { position: 'none' },
						hAxis: {title: 'Messages Number'}};
		var chart = new google.visualization.BarChart(document.getElementById('conversationInit'));
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
						hAxis: {title: 'Hours'},
						vAxis: {title: 'Messages Number'}
					   };
		var chart = new google.visualization.LineChart(document.getElementById('over_day'));
		chart.draw(data, options);
	}

	function draw_over_time() {
		var data = new google.visualization.DataTable();
		data.addColumn('date', 'Date');
		data.addColumn('number', 'Messages');

		messages_per_date = d.messages_per_date;
		years = d.date_years
		months = d.date_month	
		for(var i=0;i<messages_per_date.length;i++)
		{
			data.addRow([new Date(years[i]+2000,months[i]),messages_per_date[i]])
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
		if(years.length>=3)
		{
			chart.draw(data, options);
		}
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

