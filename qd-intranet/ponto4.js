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
			headers[i] = $(table.rows[0].cells[i]).text().toLowerCase().replace(" ", "_").replace("í", "i");
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

	function operateTimes(lastEnt, saldo, isSum) {
		var hora, minuto;
		if(isSum) {
			hora = parseInt(lastEnt.split(':')[0]) + parseInt(saldo.split(':')[0]);
			minuto = parseInt(lastEnt.split(':')[1]) + parseInt(saldo.split(':')[1]);
		} else {
			hora = parseInt(lastEnt.split(':')[0]) - parseInt(saldo.split(':')[0]);
			minuto = parseInt(lastEnt.split(':')[1]) - parseInt(saldo.split(':')[1]);
		}
		
		if(minuto > 60) {
			minuto = minuto-60;
			hora++;
		}

		if(minuto < 10)
			minuto = '0' + minuto;

		return hora +':'+ minuto;
	}

	function isEvenTimes(day) {
		var times = 0;
		for(var i = 1; i < 6; i++) {
			if(day['ent._' + i])
				times++;
			if(day['sai._' + i])
				times++;
		}
		return times % 2;
	}

	function printFinalTime(time) {
		$('<div class="horaSaida" style="width: auto;padding: 0 10px;border: 1px solid black;right: 30%;top: 50%;position: fixed;box-shadow: 3px 3px 5px gray;"></div>').insertAfter($('table.GridListagem'));
		$('.horaSaida').prepend('<h1 style="border-bottom:1px solid black">Horario ideal de saida<h1><h2 style="text-align:center;"></h2>');
		$('.horaSaida h2').text(time);
	}

	function calculateFinalTime() {
		if((window.location.href.indexOf('pgCalculos.aspx') < 0) || (!$('table.GridListagem')))
			return;

		var necessaryColumns = [0,1,2,3,4,5,6,7,8,9,21];
		checkNecessaryColumns(necessaryColumns);

		var data = deleteEmptyRows(tableToJson($('table.GridListagem')[0]));
		var saldo = data[data.length-1]['bsaldo'];
		var signal = saldo.charAt(0);
		saldo =  saldo.slice(1);
		var lastDay = data.length-1;
		// Verifica se está somente faltanto o horário de saída
		if(isEvenTimes(data[data.length-1])) {
			var saldoDay = '00:00';
			var lastEnt = '09:00';
			for(n=1; n<6; n++) {
				if(data[lastDay]['ent._' + n]) {
					lastEnt = data[lastDay]['ent._' + n];
					if(data[lastDay]['saí._' + n]) {
						lastEnt = data[lastDay]['saí._' + n];
						saldoDay = operateTimes(saldoDay, operateTimes(data[lastDay]['saí._' + n], data[lastDay]['ent._' + n], false), true);
					}
				}
			}	
			if(signal == '+')
				saldo = operateTimes(operateTimes('08:00', saldoDay, false), saldo, false);
			 
			printFinalTime(operateTimes(lastEnt, saldo, true));
		}
	}

	calculateFinalTime();
});
