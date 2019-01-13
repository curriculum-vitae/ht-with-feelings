import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  Typography
} from "@material-ui/core";
import { green, grey, red } from "@material-ui/core/colors";
import { UsersProvider } from "providers/UsersProvider";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";

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
      border: `4px solid ${
        isDone ? green[300] : isFailure ? red[300] : grey[200]
      }`,
      backgroundColor: isDone ? green[100] : isFailure ? red[100] : undefined
    }}
    elevation={0}
  >
    <CardContent>
      <Typography variant={"h6"} gutterBottom noWrap>
        {habit.name}
      </Typography>
      <Typography variant={"caption"} gutterBottom>
        WS (weekly score)
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
    </CardContent>
    <CardActions>
      <IndexFeelings
        feelings={FEELINGS}
        selected={record ? record.feelings : []}
        onChange={onChangeHabitEmojis}
      />
    </CardActions>
  </Card>
);
