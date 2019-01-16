import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  Typography,
  Hidden,
  Icon,
  Button
} from "@material-ui/core";
import {
  green,
  grey,
  red,
  orange,
  blue,
  deepOrange,
  deepPurple,
  pink
} from "@material-ui/core/colors";
import { UsersProvider } from "providers/UsersProvider";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

const COLORS = [green, grey, red, pink, orange, blue, deepOrange, deepPurple];

const getRandomMaterialPalette = () => {
  return COLORS[Math.floor(Math.random() * (COLORS.length - 1))];
};

const UserSummaryWeek = ({ user, progress }) => (
  <div
    style={{
      display: "flex",
      marginBottom: "6px"
    }}
  >
    <Badge key={user.id} badgeContent={false && String(progress).slice(0, 2)}>
      <Avatar
        style={{
          width: "32px",
          height: "32px",
          marginRight: "12px"
        }}
        src={user.linkToAvatar}
      />
    </Badge>
    <div
      style={{
        height: "32px",
        width: "100%",
        padding: "5px"
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: "8px",
          backgroundColor: grey[400],
          width: `${progress}%`
        }}
      />
    </div>
  </div>
);

export const IndexHabitsListItemV3 = ({
  habit,
  record,
  userProgress,
  onChangeHabitEmojis,
  isDone,
  isFailure
}) => (
  <Card
    style={{
      border: `0px solid ${
        isDone ? green[300] : isFailure ? red[300] : grey[200]
      }`,
      backgroundColor: isDone ? green[100] : isFailure ? red[100] : undefined,
      marginBottom: "10px"
    }}
    elevation={1}
  >
    <div
      style={{
        display: "flex",
        alignContent: "center",
        alignItems: "stretch"
      }}
    >
      <div
        style={{
          flexGrow: "1"
        }}
      >
        <CardContent style={{ paddingBottom: "0px" }}>
          <Typography variant={"h6"} noWrap>
            {habit.name}
          </Typography>
          <Typography variant={"caption"} gutterBottom noWrap>
            {habit.lists.map(l => l.id).join(", ")}
          </Typography>
          <Hidden xsUp>
            <Typography variant={"caption"} gutterBottom>
              WS (weekly sco!re)
            </Typography>

            <UsersProvider ids={habit.uids}>
              {props =>
                props.users.map(user => (
                  <UserSummaryWeek
                    key={user.id}
                    user={user}
                    progress={userProgress[user.id]}
                  />
                ))
              }
            </UsersProvider>
          </Hidden>
        </CardContent>
        <CardActions>
          <IndexFeelings
            showCommitButton={true}
            feelings={FEELINGS}
            selected={record ? record.feelings : []}
            onChange={onChangeHabitEmojis}
          />
        </CardActions>
      </div>
      <div style={{ heigth: "100%", width: "100px", display: "none" }}>
        <Button style={{ height: "100%", width: "100%", borderRadius: "0px" }}>
          <Icon style={{ opacity: "0.75" }}>send</Icon>
        </Button>
      </div>
    </div>
  </Card>
);
