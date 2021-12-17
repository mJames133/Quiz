import { Chart, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";
Chart.pluginService.register({
  beforeDraw: function (chart: any) {
    if (chart.options.centertext) {
      var width = chart.chart.width,
        height = chart.chart.height,
        ctx = chart.chart.ctx;

      ctx.restore();
      var fontSize = (height / 80).toFixed(2); // was: 114
      ctx.font = fontSize + "em sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillStyle = "white";

      var text = chart.options.centertext, // "75%",
        textX = Math.round((width - ctx.measureText(text).width) / 2),
        textY = height / 2 - (chart.titleBlock.height);

      ctx.fillText(text, textX, textY);
      ctx.save();
    }
  },
});
type Props = {
  score: number,
  totalScore: number,
};


const ChartScore = (props: Props) => {
  const scoree = (props.score / props.totalScore) * 100;
  const data = {
    datasets: [
      {
        data: [scoree, 100 - scoree],
        backgroundColor: ["#0087c5", "#cde0f1"],
        borderWidth: 0.5,
      },
    ],
  };
  const options = {
    legend: {
      display: false,
    },
    centertext:  `${scoree.toFixed(0)}%`,
    tooltips: {
      enabled: false,
    },
  };

  return <Doughnut data={data} width={300} height={200} options={options} />;
};

export default ChartScore;
