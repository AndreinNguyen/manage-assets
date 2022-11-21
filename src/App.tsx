import {
  Avatar,
  Box,
  CircularProgress,
  Container,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ManageAssets } from "./services/manage-asset";
import { Asset } from "./services/interface";
import _ from "lodash";
import { formatUnits } from "@ethersproject/units";
import React from "react";
import { promises } from "./utils/constants";

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await Promise.allSettled(promises);
        const arrayFulfilled: Asset[][] = [];
        res.forEach((el) => {
          if (el.status === "fulfilled") {
            arrayFulfilled.push(el.value);
          }
        });

        const flatData = _.flatMap(arrayFulfilled);
        setAssets(flatData);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const manageAssets = useMemo(() => {
    return new ManageAssets(assets);
  }, [assets]);

  console.log(manageAssets.getOutputAssets());

  if (isLoading)
    return (
      <Box
        display="flex"
        height={"100vh"}
        alignItems="center"
        justifyContent="center"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container sx={{ marginY: 2 }}>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Paper elevation={3} sx={{ padding: "1rem" }}>
          <Typography variant="h5" fontWeight={600}>
            Total value: ${formatUnits(manageAssets.getTotalValue())}
          </Typography>
        </Paper>

        <Paper elevation={3} sx={{ padding: "1rem", marginTop: "1rem" }}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {manageAssets.getOutputAssets().map((el) => (
              <ListItem alignItems="flex-start" key={el.address}>
                <ListItemAvatar>
                  <Avatar alt={el.icon_url} src={el.icon_url} />
                </ListItemAvatar>
                <ListItemText
                  primary={el.symbol}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        ${formatUnits(el.totalValue)}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
