$(document).ready(function() {
	$('.GridListagem tr').each(function() {
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
});
