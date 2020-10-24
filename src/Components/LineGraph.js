import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
  legend: {
    display: false,
  },
  elements: {
    points: {
      radius: 0,
    },
  },
  maintainAspectRatio: false,
  tooltips: {
    mode: "index",
    intersect: false,
    callbacks: {
      label: function (tooltipItem, data) {
        return numeral(tooltipItem.value).format("+0,0");
      },
    },
  },
  scales: {
    xAxes: [
      {
        type: "time",
        time: {
          format: "MM/DD/YYYY",
          tooltipFormat: "ll",
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: false,
        },
        ticks: {
          callback: function (value, index, values) {
            return numeral(value).format("0a");
          },
        },
      },
    ],
  },
};

const LineGraph = ({ casesType = "cases" }) => {
  const [chartValues, setChartValues] = useState({});

  const buildChartData = (data, casesType = "cases") => {
    const chartData = [];
    let lastDataPoint;
    for (const date in data[casesType]) {
      if (lastDataPoint) {
        const newDataPoint = {
          x: date /* getting the x-axis value as the data*/,
          y:
            data[casesType][date] -
            lastDataPoint /* getting the y-axis value data as the newCases */,
        };
        chartData.push(newDataPoint);
      }
      lastDataPoint = data[casesType][date];
    }
    return chartData;
  };
  useEffect(() => {
    const fetchData = async () => {
      await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=30")
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          const chartAxisData = buildChartData(data);
          setChartValues(chartAxisData);
        });
    };
    fetchData();
  }, [casesType]);

  // todo show all the new active cases, deaths, recoveris in line chart

  return (
    <div>
      <h1>This is a graph</h1>
      {chartValues?.length > 0 && (
        <Line
          data={{
            label: ["Red", "Grren", "Blue"],
            datasets: [
              {
                label: "recoveries",
                data: chartValues,
                backgroundColor: "rgba(204,16,52,0.5)",
                borderColor: "#cc1034",
              },
            ],
          }}
          options={options}
        />
      )}
    </div>
  );
};

export default LineGraph;
