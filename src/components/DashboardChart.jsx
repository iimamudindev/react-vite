import Chart from "react-apexcharts";

export default function DashboardChart({
  adminCount,
  userCount,
  staffCount,
  onRoleClick,
}) {
  const total = adminCount + userCount + staffCount;

  const roles = ["admin", "user", "staff"];

  const barOptions = {
    chart: {
      type: "bar",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      events: {
        dataPointSelection(event, chartContext, config) {
          onRoleClick?.(roles[config.dataPointIndex]);
        },
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 8,
        distributed: true,
        columnWidth: "45%",
      },
    },

    colors: [
      "#dc3545",
      "#198754",
      "#ffc107",
    ],

    dataLabels: {
      enabled: true,
    },

    legend: {
      show: false,
    },

    xaxis: {
      categories: ["Admin", "User", "Staff"],
    },

    grid: {
      borderColor: "#e9ecef",
    },
  };

  const donutOptions = {
    chart: {
      type: "donut",
      toolbar: {
        show: false,
      },
      events: {
        click(event, chartContext, config) {
          console.log(config);

          if (config.dataPointIndex >= 0) {
            onRoleClick?.(roles[config.dataPointIndex]);
          }
        },
      },
    },

    labels: [
      "Admin",
      "User",
      "Staff",
    ],

    colors: [
      "#dc3545",
      "#198754",
      "#ffc107",
    ],

    legend: {
      show: true,
      position: "bottom",
      fontSize: "14px",
      fontWeight: "600",
    },

    dataLabels: {
      enabled: false,
    },

    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total",
              formatter: () => total,
            },
          },
        },
      },
    },
  };

  return (
    <div className="row g-4 mb-4">

      <div className="col-lg-8">
        <div className="card border-0 shadow rounded-4 h-100">

          <div className="card-header bg-white">
            <h5 className="fw-bold mb-0">
              📊 Statistik User
            </h5>
          </div>

          <div className="card-body">
            <Chart
              options={barOptions}
              series={[
                {
                  name: "Jumlah User",
                  data: [
                    adminCount,
                    userCount,
                    staffCount,
                  ],
                },
              ]}
              type="bar"
              height={320}
            />
          </div>

        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow rounded-4 h-100">

          <div className="card-header bg-white">
            <h5 className="fw-bold mb-0">
              🥧 Persentase User
            </h5>
          </div>

          <div className="card-body d-flex justify-content-center align-items-center">
            <Chart
              options={donutOptions}
              series={[
                adminCount,
                userCount,
                staffCount,
              ]}
              type="donut"
              width="100%"
              height={300}
            />
          </div>

        </div>
      </div>

    </div>
  );
}