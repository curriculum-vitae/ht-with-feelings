import {
  Avatar,
  Badge,
  Card,
  CardActions,
  CardContent,
  CardHeader
} from "@material-ui/core";
import { grey, green, red } from "@material-ui/core/colors";
import React from "react";
import { IndexFeelings } from "screens/Index/components/IndexFeelings";
import { FEELINGS } from "shared/constants";
import { UsersProvider } from "providers/UsersProvider";

const UserSummaryDay = ({ user }) => (
  <div>
    <Badge key={user.id} badgeContent={FEELINGS[0]}>
      <Avatar
        style={{
          width: "32px",
          height: "32px"
        }}
        src={user.linkToAvatar}
      />
    </Badge>
  </div>
);

const UserSummaryWeek = ({ user, progress }) => (
  <div
    style={{
      display: "flex",
      marginBottom: "4px"
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
        padding: "8px"
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: "8px",
          backgroundColor: grey[200],
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
        isDone ? green[200] : isFailure ? red[200] : grey[200]
      }`,
      backgroundColor: "unset"
    }}
    elevation={0}
  >
    <CardHeader
      style={{
        height: "100px"
      }}
      title={habit.name}
    />

    <CardContent>
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
