import {
  Avatar,
  Box,
  CssBaseline,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { ManageAssets } from "./services";
import { Asset } from "./services/interface";
import _ from "lodash";
import { formatUnits } from "@ethersproject/units";
import React from "react";

const wallets = [
  "0x22bb68bd0b113ccf688e0759ac0b4abc013df824",
  "0x9442dad1df11c858a900f55291dc1cf645ff66df",
  "0x3ddfa8ec3052539b6c9549f12cea2c295cff5296",
];

const promises: Promise<Asset[]>[] = [];

const getAssetsOfWallet = async (walletAddress: string) => {
  const res = await fetch(
    `https://staging-api.depocket.com/v1/account/${walletAddress}/balances?chain=bsc`,
    {
      method: "POST",
    }
  );
  const data = await res.json();
  return data;
};

wallets.forEach((el) => promises.push(getAssetsOfWallet(el)));

function App() {
  const [assets, setAssets] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await Promise.all(promises);
      const flatData = _.flatMap(data);
      setAssets(flatData);
    };
    fetchData();
  }, []);

  const manageAssets = useMemo(() => {
    return new ManageAssets(assets);
  }, [assets]);

  return (
    <div>
      <CssBaseline />
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column"
      >
        <Paper elevation={3} sx={{ padding: "1rem" }}>
          <Typography variant="h5" fontWeight={600}>
            Total value: $ {formatUnits(manageAssets.getTotalValue())}
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
                        $ {formatUnits(el.totalValue)}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>
    </div>
  );
}

export default App;
