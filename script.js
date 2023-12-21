'use strict';

window.onload = function () {
  let count = 0;
  let data_popular = [];

  fetch('population-and-demography.csv')
    .then((response) => response.text())
    .then((data) => {
      const array = data.split('\n').map((row) => row.split(','));
      let array_popular = [];
      let array_data = [];
      const check_no_country = [
      'World',
			'Asia (UN)',
			'Less developed regions',
			'Less developed regions, excluding least developed countries',
			'Less developed regions, excluding China',
			'Low-income countries',
			'Upper-middle-income countries',
			'Lower-middle-income countries',
			'More developed regions',
			'High-income countries',
			'Least developed countries',
			'Africa (UN)',
			'Europe (UN)',
			'Latin America and the Caribbean (UN)',
			'Land-locked developing countries (LLDC)',
			'Northern America (UN)',
			'United States',
			'United Kingdom'
		];

      array.forEach((value, key) => {
        if (key > 0 && !check_no_country.includes(value[0])) {
          if (!array_data[value[1]]) {
            array_data[value[1]] = [];
          } else {
            array_data[value[1]].push({
              country_name: value[0],
              population: parseInt(value[2]),
              color: "#FAE0D8"
            });
          }
        }
      });

      for (const [key, value_year] of Object.entries(array_data)) {
        let total_popular = 0;
        value_year.forEach((value_popular, key_popular) => {
          total_popular += value_popular['population'];
        });
        value_year.sort((a, b) => b.population - a.population);
        let top10_limit = value_year.slice(0, 10);
        array_popular[key] = { year: key, population_all: total_popular.toLocaleString(), data: top10_limit }
      }

      data_popular = Object.values(array_popular);
      data_popular.splice(-2);
      updateChart(count);
    });

  function DataPopularDesc(data1, data2) {
    return data1.y - data2.y;
  }

  var chart = new CanvasJS.Chart("chartContainer", {
    axisY: { includeZero: false },
    data: [{
      type: "bar",
      indexLabel: "{y}",
    }]
  });

  function updateChart(count) {
    let dps = data_popular[count].data.map(item => ({ label: item.country_name, y: item.population, color: item.color }));
    chart.options.data[0].dataPoints = dps;
    chart.options.data[0].dataPoints.sort(DataPopularDesc);
    $('#text_year').html(data_popular[count].year);
    $('#population_all').html(data_popular[count].population_all);
    chart.render();
  }

  setInterval(function () {
    count = count + 1;
    updateChart(count);
  }, 400);
}
