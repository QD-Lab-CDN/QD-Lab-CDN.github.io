$(document).ready(function() {
	$('#ctl00_ContentPlaceHolder1_dgvGrade tr').each(function() {
		var $t = $(this);
		var count = 0;

		for (var i = 1; i < 11; i++) {
			if ($($t.find('td')[i]).text().length > 1) {
				count = count + 1;
			}
		}

		if (count % 2 != 0) {
			$t.css('border', 'solid 1px #f00');
		}
	});


	// Manipulando o campo de data
	var date = formatDate(new Date());

	$('#ctl00_ContentPlaceHolder1_dgvGrade tr').each(function() {
		var $t = $(this);
		var tdDate = $t.find('td:first');

		if (tdDate.text().indexOf(date) == 0) {
			var count = 0;
			tdDate.find('a').attr('title', 'N\u00E3o \u00E9 possivel editar o ponto no mesmo dia!');

			tdDate.find('a').click(function(evt) {
				alert('N\u00E3o \u00E9 possivel editar o ponto no mesmo dia!');
				if (!(count >= 3)) {
					evt.preventDefault();
					count++;
				}
			});

			return false;
		}
	});

	function formatDate(d) {

		var month = d.getMonth();
		var day = d.getDate();
		var year = d.getFullYear();

		year = year.toString().substr(2,2);
		month = month + 1;
		month = month + "";

		if (month.length == 1)
			month = "0" + month;

		day = day + "";

		if (day.length == 1)
			day = "0" + day;

		return day + '/' + month + '/' + year;
	}

	function tableToJson(table) {
		var data = [];
		// first row needs to be headers
		var headers = [];
		for (var i=0; i<table.rows[0].cells.length; i++) {
			headers[i] = $(table.rows[0].cells[i]).text().toLowerCase().replace(" ", "_");
		}
		// go through cells
		for (var i=2; i<table.rows.length; i++) {
			var tableRow = table.rows[i];
			var rowData = {};

			for (var j=0; j<tableRow.cells.length; j++) {
				rowData[ headers[j] ] = $(tableRow.cells[j]).text().trim();
			}
			data.push(rowData);
		}       
		return data;
	}

	function deleteEmptyRows(data) {
		var lastRowsFilled = data.length;
		for(var k = data.length-1; k>=0; k--) {
			if(data[k]['ent._1'] && parseInt(data[k]['ent._1'].replace(':',''))) {
				lastRowsFilled = k+1;
				break;
			}
		}
		return data.slice(0, lastRowsFilled)
	}

	function checkNecessaryColumns(columns) {
		columns.forEach(e => {
			if($('input#ctl00_ContentPlaceHolder1_lstColunas_' + e).attr('checked') !== 'checked')
				addNecessaryColumns(columns);	
		});
	}

	function addNecessaryColumns(columns) {
		columns.forEach(e => {
			$('input#ctl00_ContentPlaceHolder1_lstColunas_' + e).attr('checked','checked');
		});
		__doPostBack('ctl00$ContentPlaceHolder1$lnkColunasSelecionadasOK','');
	}

	function timeDurationCalc(start, end) {
		start = start.split(":");
		end = end.split(":");
		var startDate = new Date(0, 0, 0, start[0], start[1], 0);
		var endDate = new Date(0, 0, 0, end[0], end[1], 0);
		var diff = endDate.getTime() - startDate.getTime();
		var hours = Math.floor(diff / 1000 / 60 / 60);
		diff -= hours * 1000 * 60 * 60;
		var minutes = Math.floor(diff / 1000 / 60);
		
		return (hours < 9 ? "0" : "") + hours + ":" + (minutes < 9 ? "0" : "") + minutes;
	}

	// http://www.easysurf.cc/tmadd.htm
	function timeCalculator(timeA, timeB, isSum) {
		timeA = timeA.split(":");
		timeB = timeB.split(":");
	
		var h1 = parseFloat(timeA[0]);
		var m1 = parseFloat( (timeA[0].indexOf('-')>-1? '-': '') + timeA[1]);
		var h2 = parseFloat(timeB[0]);
		var m2 = parseFloat( (timeB[0].indexOf('-')>-1? '-': '') + timeB[1]);
		
		var t1, t2, t3, t4, t5;
		t1 = (h1 * 60) + m1;
		t2 = (h2 * 60) + m2;
		if (!isSum)
			t3 = t1 - t2;
		else
			t3 = t1 + t2;
	   
		if (t3 < 0) {
			t4 = Math.ceil(t3 / 60);
			t5 = t3 - (t4 * 60);
			t5 = Math.abs(t5);
			if (t4 == 0)
				t4 = "-" + t4;
		}
		else {
			t4 = Math.floor(t3 / 60);
			t5 = t3 - (t4 * 60);
		}

		return pad(t4) + ":" + pad(t5);
	}
	function pad(n) {
		var ns = n.toString();
		var signal = (ns.match(/[\-\+]/i) || ['']).pop();
		if (ns.replace(signal, "").length == 1)
			return signal + "0" + ns.replace(signal, "");
		else
			return n;
	}

	function isEvenTimes(day) {
		var times = 0;
		for(var i = 1; i < 6; i++) {
			if(day['ent._' + i])
				times++;
			if(day['saí._' + i])
				times++;
		}
		return times % 2;
	}

	function printFinalTime(time, lastDay) {
		// $('<div class="horaSaida" style="width: auto;padding: 0 10px;border: 1px solid black;right: 30%;top: 50%;position: fixed;box-shadow: 3px 3px 5px gray;"></div>').insertAfter($('table.GridListagem'));
		// $('.horaSaida').prepend('<h1 style="border-bottom:1px solid black">Horario ideal de saida<h1><h2 style="text-align:center;"></h2>');
		// $('.horaSaida h2').text(time);

		var lastLineCells = $('table.GridListagem')[0].rows[lastDay].cells;
		for(var k = lastLineCells.length - 1; k > 0; k--) {
			if(!$(lastLineCells[k]).text().trim()) {
				$(lastLineCells[k]).text(time).css({
					'border': '2px #212121 dotted',
					'font-style': 'italic',
					'text-align': 'center',
					'background': '#ffe082'
				}).attr('title', 'Esta \u00e9 apenas uma informa\u00e7\u00e3o de sugest\u00e3o do hor\u00e1rio ideal de sa\u00edda para que voc\u00ea fique com o Banco zerado.');
				break;
			}
		}
	}

	function calculateFinalTime() {
		if((window.location.href.indexOf('pgCalculos.aspx') < 0) || (!$('table.GridListagem').length))
			return;

		var necessaryColumns = [0,1,2,3,4,5,6,7,8,9,21];
		checkNecessaryColumns(necessaryColumns);

		var data = deleteEmptyRows(tableToJson($('table.GridListagem')[0]));
		
		// Verifica se está somente faltanto o horário de saída
		var lastDay = data.length-1;
		if(isEvenTimes(data[lastDay])) {
			// Agora eu calculo o saldo do dia atual
			var dayBalance = '00:00';
			var entryTime;
			var exitTime;
			var tempBalance;
			for(n=1; n<=5; n++) {
				entryTime = data[lastDay]['ent._' + n];
				exitTime = data[lastDay]['saí._' + n];
				if(entryTime && exitTime) {
					tempBalance = timeCalculator(exitTime, entryTime);
					dayBalance = timeCalculator(dayBalance, tempBalance, true);
				}
				else
					break;
			}

			// Saldo do dia até o momento
			var balance = '-05:00';
			var balance = data[lastDay-1]['bsaldo'];
			var lastEntry = data[lastDay]['ent._' + n];

			// Junto o saldo do dia com o saldo anterior
			var compTime = timeCalculator(balance, dayBalance, true);
			// Retiro as 08:00 hrs de carga horária do dia
			compTime = timeCalculator('-08:00', compTime, true);
			// Agora eu pego o último horário de "entrada" e cálculo qual o horário de saída p/ ficar com o banco zerado
			var newExitTime = timeCalculator(lastEntry, compTime);

			// printFinalTime(newExitTime.replace('-', ''), lastDay+2);
			if((timeCalculator(newExitTime, lastEntry)).indexOf('-')>-1){
				var newCompTime = timeCalculator((new Date()).toLocaleTimeString().replace(/\:[0-9]+$/, ''), lastEntry);
				printFinalTime('Passou do horário em +' + timeCalculator(compTime, newCompTime, true) + ' hrs', lastDay+2);
			}
			else
				printFinalTime(newExitTime, lastDay+2);
		}
	}

	calculateFinalTime();
});
