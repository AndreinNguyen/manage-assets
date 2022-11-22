import {
  Avatar,
  Box,
  Container,
  CssBaseline,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ManageAssets } from "./services/manage-assets";
import { Asset } from "./services/interface";
import _ from "lodash";
import { formatUnits } from "@ethersproject/units";
import React from "react";
import { promises } from "./utils/constants";
import { formatDisplayNumber } from "./utils/format-display-number";

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

  // if (isLoading)
  //   return (
  //     <Box
  //       display="flex"
  //       height={"100vh"}
  //       alignItems="center"
  //       justifyContent="center"
  //     >
  //       <CircularProgress />
  //     </Box>
  //   );

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
          <Typography variant="h4" fontWeight={600} textAlign="center">
            Total value
          </Typography>

          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width={190}
              height={30}
              animation="wave"
            ></Skeleton>
          ) : (
            <Typography variant="h5" fontWeight={500} textAlign="center">
              ${formatDisplayNumber(formatUnits(manageAssets.getTotalValue()))}
            </Typography>
          )}
        </Paper>

        <Paper elevation={3} sx={{ padding: "1rem", marginTop: "1rem" }}>
          <List sx={{ width: "100%", bgcolor: "background.paper" }}>
            {isLoading
              ? [0, 1, 2, 3, 4, 5, 6, 7, 8].map((el) => (
                  <React.Fragment key={el}>
                    <ListItem alignItems="flex-start">
                      <ListItemAvatar>
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Skeleton
                            animation="wave"
                            height={24}
                            width={40}
                            style={{ marginBottom: 6 }}
                          />
                        }
                        secondary={
                          <React.Fragment>
                            <Typography
                              sx={{ display: "inline" }}
                              component="span"
                              variant="body2"
                              color="text.primary"
                            >
                              <Skeleton
                                animation="wave"
                                height={20}
                                width={130}
                                style={{ marginBottom: 6 }}
                              />
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))
              : manageAssets.getOutputAssets().map((el) => (
                  <React.Fragment key={el.address}>
                    <ListItem alignItems="flex-start">
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
                              ${formatDisplayNumber(formatUnits(el.totalValue))}
                            </Typography>
                          </React.Fragment>
                        }
                      />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                  </React.Fragment>
                ))}
          </List>
        </Paper>
      </Box>
    </Container>
  );
}

export default App;
