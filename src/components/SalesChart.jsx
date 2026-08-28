import Chart from "react-apexcharts";

export default function SalesChart({ data = [] }) {
const categories = data.map((item) => {
  const [year, month, day] = item.date.split("-");
  return `${day}/${month}/${year}`;
});

  const series = [
    {
      name: "Omzet",
      data: data.map((item) => Number(item.total_omzet || 0)),
    },
    {
      name: "HPP",
      data: data.map((item) => Number(item.total_hpp || 0)),
    },
    {
      name: "Laba",
      data: data.map((item) => Number(item.gross_profit || 0)),
    },
  ];

  const options = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },

    stroke: {
      curve: "smooth",
      width: 3,
    },

    dataLabels: {
      enabled: false,
    },

    xaxis: {
      categories,
      title: {
        text: "Tanggal",
      },
    },

    yaxis: {
      labels: {
        formatter: (value) =>
          `Rp ${Number(value || 0).toLocaleString("id-ID")}`,
      },
    },

    tooltip: {
      y: {
        formatter: (value) =>
          `Rp ${Number(value || 0).toLocaleString("id-ID")}`,
      },
    },

    legend: {
      position: "top",
    },

    noData: {
      text: "Belum ada data penjualan.",
    },
  };

  return (
    <div className="card border-0 shadow rounded-4 mb-4">
      <div className="card-header bg-white">
        <h5 className="fw-bold mb-0">
          📈 Grafik Penjualan
        </h5>
      </div>

      <div className="card-body">
        <Chart
          options={options}
          series={series}
          type="line"
          height={350}
        />
      </div>
    </div>
  );
}
