import React from "react";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { LineChart } from "@mui/x-charts/LineChart";
import { Grid2, useMediaQuery } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import TodoApp from "./Todo.jsx";
import { fetchWebsiteOptions } from "../helpers/fetchWebsiteOptions.js";

const AdminPanel = () => {
  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["websiteOptions"],
    queryFn: fetchWebsiteOptions,
  });


  const allWebsites = responseData?.data || [];
  const isMobile = useMediaQuery("(max-width: 600px)");

  return (
    <div
      style={{
        height: "100vh",
        maxHeight: "100vh",
        backgroundColor: "#000",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          backgroundColor: "#141414",
          borderRadius: "1rem",
          margin: "1rem",
          padding: "25px",
          marginTop: "10px",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          color="#F08D32"
          fontSize={20}
          fontType="serif-heading"
          fontWeight={700}
        >
          Navigation Bar
        </Typography>
        <Link to="/single-analytics">
          <Typography color="#fff">Single analytics</Typography>
        </Link>
      </div>

      <Grid2 container spacing={2} sx={{ margin: "1rem" }}>
        <Grid2 item size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
          <div
            style={{
              backgroundColor: "#141414",
              borderRadius: "1rem",
              padding: "1rem",
              marginTop: "10px",
              color: "white",
            }}
          >
            <TodoApp />
          </div>
        </Grid2>
        <Grid2 item size={{ lg: 8, md: 12, sm: 12, xs: 12 }}>
          <NavigationAnalytics allWebsites={allWebsites} />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default AdminPanel;

export const NavigationAnalytics = ({ allWebsites }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const totalWebsites = allWebsites?.length || 0;
  const converstionRateTotal =
    allWebsites?.reduce(
      (acc, curr) => acc + Number(curr.conversionPercentage),
      0
    ) || 0;
  const bounceRateTotal =
    allWebsites?.reduce((acc, curr) => acc + Number(curr.bounceRate), 0) || 0;
  const viewsTotal =
    allWebsites?.reduce(
      (acc, curr) =>
        acc +
        (100 - (Number(curr.conversionPercentage) + Number(curr.bounceRate))),
      0
    ) || 0;

  const pieChartData = [
    {
      label: "Conversion rate",
      value: converstionRateTotal / totalWebsites || 0,
    },
    {
      label: "Bounce rate",
      value: bounceRateTotal / totalWebsites || 0,
    },
    // {
    //   label: "Views",
    //   value: viewsTotal / totalWebsites || 0,
    // }
  ];

  const aggregateVisitsByDay = (websitesData) => {
    const visitTotals = {};

    websitesData.forEach((website) => {
      website.history.forEach((day) => {
        if (!visitTotals[day.date]) {
          visitTotals[day.date] = 0;
        }
        visitTotals[day.date] += day.totalVisits;
      });
    });

    return Object.entries(visitTotals).map(([label, value]) => ({
      label,
      value,
    }));
  };

  const aggregateConversionByDay = (websitesData) => {
    const visitTotals = {};

    websitesData.forEach((website) => {
      website.history.forEach((day) => {
        if (!visitTotals[day.date]) {
          visitTotals[day.date] = 0;
        }
        visitTotals[day.date] += Number(day.conversionPercentage);
      });
    });

    return Object.entries(visitTotals).map(([label, value]) => ({
      label,
      value,
    }));
  };

  const aggregateHistory = aggregateConversionByDay(allWebsites);

  const barChartsParams = {
    series: [
      {
        id: "series-1",
        data: aggregateHistory?.map((day) => day?.value) || [],
        label: "Conversion %",
        color: "white",
      },
    ],
    xAxis: [
      {
        data: aggregateHistory?.map((day) => day?.label) || [],
        scaleType: "band",
        id: "axis1",
        tick: {
          style: {
            fill: "#fff",
          },
        },
        tickLabelStyle: {
          angle: 30, // Rotate labels by 45 degrees
          textAnchor: "start", // Align rotated labels properly
          fontSize: 12, // Adjust font size if needed
        },
      },
    ],
    yAxis: [
      {
        min: 0, // Set the minimum value of the y-axis to 0%
        max: 100, // Set the maximum value of the y-axis to 100%
        tickInterval: 25, // Set the interval between ticks to 25%
        tick: {
          style: {
            fill: "#fff",
          },
        },
        valueFormatter: (value) => `${value}%`,
      },
    ],
    height: 300,
    sx: {
      "& .MuiTypography-root": {
        color: "white", // Set all typography to red
      },
      "& .MuiChartsAxis-root text": {
        fill: "white !important", // Force x and y-axis text to red
      },
      "& .MuiChartsAxis-tickLabel": {
        fill: "white !important", // Ensure tick labels are red
      },
      "& .MuiChartsAxis-line": {
        stroke: "white !important", // Ensure x and y-axis lines are red
      },
      "& .MuiChartsAxis-tick": {
        stroke: "white !important", // Ensure tick marks are red
      },
      "& .MuiChartsBar-root .MuiChartsBar-label": {
        color: "white !important", // Ensure bar labels are white
      },
      "& .MuiChartsLegend-root text": {
        fill: "white !important",
      },
      "& .MuiChartsLegend-series text": {
        fill: "white !important",
      },
    },
  };

  const topPagesData = {
    series: [
      {
        id: "top-pages",
        data: allWebsites?.map((website) => website?.totalVisits) || [],
        label: "Page Views",
        color: "white",
      },
    ],
    xAxis: [
      {
        data: allWebsites?.map((website) => website.websiteName) || [],
        scaleType: "band",
        id: "axis1",
        tick: {
          style: {
            fill: "white", // Set x-axis label color to red
          },
        },
        tickLabelStyle: {
          // angle: 10, // Rotate labels by 45 degrees
          textAnchor: "start", // Align rotated labels properly
          fontSize: 12, // Adjust font size if needed
        },
      },
    ],
    yAxis: [
      {
        tick: {
          style: {
            fill: "white", // Set y-axis label color to red
          },
        },
      },
    ],
    height: 300,
    sx: {
      "& .MuiTypography-root": {
        color: "white", // Set all typography to red
      },
      "& .MuiChartsAxis-root text": {
        fill: "white !important", // Force x and y-axis text to red
      },
      "& .MuiChartsAxis-tickLabel": {
        fill: "white !important", // Ensure tick labels are red
      },
      "& .MuiChartsAxis-line": {
        stroke: "white !important", // Ensure x and y-axis lines are red
      },
      "& .MuiChartsAxis-tick": {
        stroke: "white !important", // Ensure tick marks are red
      },
      "& .MuiChartsLegend-root text": {
        fill: "white !important",
      },
      "& .MuiChartsLegend-series text": {
        fill: "white !important",
      },
    },
  };

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "22rem",
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 0, md: 4 }}
            sx={{ width: "100%" }}
          >
            <BarChart {...barChartsParams} />
          </Stack>
        </div>
      </Grid2>

      <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "22rem",
            width: "100%",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Stack sx={{ paddingTop: "2rem" }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Conversion & Bounce Rate
            </Typography>
          </Stack>
          <Stack sx={{ flex: 1, height: "100%", width: "100%" }}>
            <PieChart
              series={[
                {
                  data: pieChartData,
                  highlightScope: { fade: "global", highlight: "item" },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -30,
                    color: "red",
                  },
                },
              ]}
              height={isMobile ? 170 : 220}
              sx={{
                "& .MuiChartsLegend-root text": {
                  fill: "white !important",
                },
                "& .MuiChartsLegend-series text": {
                  fill: "white !important",
                },
              }}
            />
          </Stack>
        </div>
      </Grid2>

      <Grid2 item size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "22rem",
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <LineChart {...topPagesData} />
        </div>
      </Grid2>
      {/* <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div style={{
          backgroundColor: '#141414',
          borderRadius: '10px',
          height: '22rem',
          width: '100%',
          color: 'white',
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>

        </div>
      </Grid2> */}
    </Grid2>
  );
};
