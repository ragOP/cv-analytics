import React, { useState } from "react";
import { Button, showToast } from "@cred/neopop-web/lib/components";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import {
  createTheme,
  Grid2,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { ScoreMeter } from "@cred/neopop-web/lib/components";
import axios from "axios";
import dayjs from "dayjs";
import { BACKEND_URL } from "../constants/index.js";
import { AdminPanelWebsite } from "./AdminPanelHeader.jsx";

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "white !important", // Input text color
          },
          "& .MuiInputLabel-root": {
            color: "white !important", // Label text color
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "white !important", // Border color
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "white !important", // Hover border color
          },
          "& .MuiSvgIcon-root": {
            color: "white !important", // Calendar icon color
          },
        },
      },
    },
  },
});


const SingleWebsiteAnalytics = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [isSubmittingData, setIsSubmittingData] = useState(false);
  const [websiteAnalyticsData, setWebsiteAnalyticsData] = useState(null);

  const onSelectEndDate = (newValue) => {
    if (dayjs(startDate).isSame(dayjs(newValue), "day")) {
      showToast("Start and end date cannot be same", {
        type: "error",
        autoCloseTime: 5000,
      });
      return;
    }
    setEndDate(newValue);
  };

  const onSelectStartDate = (newValue) => {
    setStartDate(newValue);
    setEndDate(new Date(newValue.getTime() + 24 * 60 * 60 * 1000));
  };

  const onSubmit = async ({ isAllTime = false }) => {
    if (isSubmittingData) {
      showToast("Please wait for the previous request to complete", {
        type: "error",
        autoCloseTime: 5000,
      });
      return;
    }

    if (!selectedWebsite) {
      showToast("Please select website", {
        type: "error",
        autoCloseTime: 5000,
      });
      return;
    }

    if (!isAllTime && !startDate) {
      showToast("Please select start date", {
        type: "error",
        autoCloseTime: 5000,
      });
      return;
    }

    if (!isAllTime && !endDate) {
      showToast("Please select end date", {
        type: "error",
        autoCloseTime: 5000,
      });
      return;
    }
    console.log(">>", isAllTime, startDate, endDate);
    if (!isAllTime && dayjs(startDate).isSame(dayjs(endDate), "day")) {
      showToast("Start date and end date should not be same", {
        type: "error",
        autoCloseTime: 5000,
      });
      return;
    }

    try {
      setIsSubmittingData(true);

      const formattedStartDate = isAllTime
        ? null
        : dayjs(startDate).format("YYYY-MM-DD");
      const formattedEndDate = isAllTime
        ? null
        : dayjs(endDate).format("YYYY-MM-DD");

      const websiteId = selectedWebsite?.websiteId;
      const url = `${BACKEND_URL}/api/analytics/single/website-view/${websiteId}`;
      const finalUrl =
        formattedStartDate && formattedEndDate
          ? `${url}?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
          : url;

      const apiResponse = await axios.get(finalUrl);
      if (apiResponse?.data?.success) {
        const data = apiResponse?.data?.data;
        showToast("Data fetched successfully", {
          type: "success",
          autoCloseTime: 5000,
        });
        setWebsiteAnalyticsData(data);
      }
    } catch (error) {
      console.log("ERROR", error);
    } finally {
      setIsSubmittingData(false);
    }
  };

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
        }}
      >
        <Typography
          color="#F08D32"
          fontSize={20}
          fontType="serif-heading"
          fontWeight={700}
        >
          Dashboard analytics for website Food allowances
        </Typography>
      </div>

      <Grid2
        container
        spacing={2}
        sx={{
          margin: "1rem",
          padding: "1rem",
          backgroundColor: "#141414",
          borderRadius: "1rem",
        }}
      >
        <Grid2 item size={{ lg: 7, md: 12, sm: 12, xs: 12 }}>
          <AdminPanelWebsite setSelectedWebsite={setSelectedWebsite} />
        </Grid2>

        <Grid2 item size={{ lg: 3, md: 12, sm: 12, xs: 12 }}>
          <Stack direction="row" spacing={1} sx={{}}>
            <ThemeProvider theme={theme}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack direction="row" spacing={2}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={onSelectStartDate}
                    format="dd/MM/yyyy"
                    renderInput={(params) => <TextField {...params} />}
                    shouldDisableDate={(date) =>
                      date >
                      new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={onSelectEndDate}
                    format="dd/MM/yyyy"
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          readOnly: !startDate,
                        }}
                      />
                    )}
                    onOpen={() => {
                      if (!startDate) {
                        showToast("Please select the start date first", {
                          type: "error",
                          autoCloseTime: 5000,
                        });
                      }
                      return;
                    }}
                    shouldDisableDate={(date) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const start = new Date(startDate);
                      start.setHours(0, 0, 0, 0);
                      return !startDate || date < start || date > today;
                    }}
                  />
                </Stack>
              </LocalizationProvider>
            </ThemeProvider>
          </Stack>
        </Grid2>

        <Grid2 item size={{ lg: 2, md: 12, sm: 12, xs: 12 }}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: "0.25rem", width: "100%" }}
          >
            <Button
              colorMode="light"
              kind="elevated"
              onClick={() => onSubmit({ isAllTime: true })}
              size="big"
              disabled={isSubmittingData}
            >
              All Data
            </Button>

            <Button
              colorMode="light"
              kind="elevated"
              onClick={onSubmit}
              size="big"
              style={{
                height: "auto",
              }}
              disabled={isSubmittingData}
            >
              Submit
            </Button>
          </Stack>
        </Grid2>
      </Grid2>

      <Grid2 container spacing={2} sx={{ margin: "1rem" }}>
        <Grid2 item size={{ lg: 4, md: 12, sm: 12, xs: 12 }}>
          <ButtonCallDetails
            buttonClicksData={websiteAnalyticsData?.buttonClicks}
            totalVisits={websiteAnalyticsData?.totalVisits}
          />
        </Grid2>
        <Grid2 item size={{ lg: 8, md: 12, sm: 12, xs: 12 }}>
          <PageAnalytics websiteAnalyticsData={websiteAnalyticsData} />
        </Grid2>
      </Grid2>
    </div>
  );
};

export default SingleWebsiteAnalytics;

export const ButtonCallDetails = ({ buttonClicksData, totalVisits }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const buttonOneValue = buttonClicksData?.[1] || 0;
  const buttonTwoValue = buttonClicksData?.[2] || 0;
  const buttonThreeValue = buttonClicksData?.[3] || 0;
  const buttonFourValue = buttonClicksData?.[4] || 0;
  const buttonFiveValue = buttonClicksData?.[5] || 0;

  return (
    <div
      style={{
        backgroundColor: "#141414",
        borderRadius: "10px",
        color: "white",
        display: "flex",
        height: isMobile ? "20rem" : "33rem",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: isMobile ? "1rem" : "4rem 1rem",
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <Typography
          variant="h6" // Use a heading variant (h4, h5, etc.)
          sx={{
            fontWeight: "bold", // Make the text bold
            color: "#000", // Set text color to white
            backgroundColor: "#fff", // Add a background color
            padding: "10px 20px", // Add padding for spacing
            borderRadius: "8px", // Add rounded corners
            textAlign: "center", // Center-align the text
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)", // Add a subtle shadow
            marginBottom: "20px", // Add margin at the bottom
          }}
        >
          Total views - {totalVisits || 0}
        </Typography>{" "}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          sx={{ flexWrap: "wrap" }}
        >
          <Button
            colorMode="light"
            kind="elevated"
            onClick={function noRefCheck() {}}
            size="big"
            style={{
              margin: "10px",
              height: "auto",
            }}
          >
            Q 1 (Yes) : {buttonOneValue}
          </Button>

          <Button
            colorMode="light"
            kind="elevated"
            onClick={function noRefCheck() {}}
            size="big"
            style={{
              margin: "10px",
              height: "auto",
            }}
          >
            Q 1 (No) : {buttonTwoValue}
          </Button>

          <Button
            colorMode="light"
            kind="elevated"
            onClick={function noRefCheck() {}}
            size="big"
            style={{
              margin: "10px",
              height: "auto",
            }}
          >
            Q2 (Yes) :{buttonThreeValue}
          </Button>

          <Button
            colorMode="light"
            kind="elevated"
            onClick={function noRefCheck() {}}
            size="big"
            style={{
              margin: "10px",
              height: "auto",
            }}
          >
            Q2 (No) : {buttonFourValue}
          </Button>
        </Stack>
      </Stack>

      <Button
        colorMode="light"
        kind="elevated"
        onClick={function noRefCheck() {}}
        size="big"
        style={{
          marginTop: "3rem",
          height: "auto",
        }}
      >
        Call ({buttonFiveValue})
      </Button>
    </div>
  );
};

export const PageAnalytics = ({ websiteAnalyticsData }) => {
  const isMobile = useMediaQuery("(max-width: 600px)");

  const pieChartData = [
    {
      label: "Conversion rate",
      value: websiteAnalyticsData?.conversionPercentage || 0,
    },
    {
      label: "Bounce rate",
      value: websiteAnalyticsData?.bounceRate || 0,
    },
    // {
    //   label: "Views",
    //   value: 100 - (websiteAnalyticsData?.conversionPercentage + websiteAnalyticsData?.bounceRate) || 0,
    // }
  ];

  const totalCalls = websiteAnalyticsData?.buttonClicks?.[5] || 0;
  const last7DaysData = websiteAnalyticsData?.history || [];

  const barGraphData = last7DaysData.map((data) => ({
    label: data?.date,
    value: data?.conversionPercentage,
  }));

  const barChartsParams = {
    series: [
      {
        id: "series-1",
        data: barGraphData.map((d) => d.value),
        label: "Conversion %",
        color: "white",
      },
    ],
    xAxis: [
      {
        data: barGraphData?.map((d) => d.label),
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

  return (
    <Grid2 container spacing={2}>
      <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "20rem",
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
            <Box sx={{ flexGrow: 1 }}>
              <BarChart
                {...barChartsParams}
                slots={{
                  axisLabel: <h1>Hello</h1>,
                }}
              />
            </Box>
          </Stack>
        </div>
      </Grid2>

      <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "20rem",
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
              sx={{
                "& .MuiChartsLegend-root text": {
                  fill: "white !important",
                },
                "& .MuiChartsLegend-series text": {
                  fill: "white !important",
                },
              }}
              height={isMobile ? 170 : 220}
            />
          </Stack>
        </div>
      </Grid2>

      <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "20rem",
            width: "100%",
            color: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
          }}
        >
          <Stack sx={{ paddingTop: "2rem" }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Button Clicks
            </Typography>
          </Stack>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              paadding: "50px",
            }}
          >
            <ScoreMeter
              colorConfig={{
                dotColor: "",
                indicatorColors: {
                  decrement: "#FFB098",
                  increment: "#5CDDBE",
                  neutral: "#e2e2e2",
                },
                meterBorderColor: "#3D3D3D",
                meterStrokeBackground: "#0d0d0d",
                meterStrokeColor: {
                  average: "#EDFE79",
                  excellent: "#06C270",
                  poor: "#F29947",
                },
                scoreColor: "#ffffff",
                scoreContainerBackground: "#161616",
                scoreContainerBorder: "#0d0d0d",
              }}
              colorMode="dark"
              lowerLimit={0}
              reading={totalCalls}
              scoreDesc="Good"
              type="average"
              upperLimit={1000}
            />
          </div>
        </div>
      </Grid2>

      <Grid2 item size={{ lg: 6, md: 12, sm: 12, xs: 12 }}>
        <div
          style={{
            backgroundColor: "#141414",
            borderRadius: "10px",
            height: "20rem",
            width: "100%",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></div>
      </Grid2>
    </Grid2>
  );
};
