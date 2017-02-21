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
				if (!(count >= 3)) {
					evt.preventDefault();
					count++;
				}
			});

			return false;
		}
	});

	function formatDate(d)
	{
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
});
